use anchor_lang::prelude::*;
use anchor_spl::token_2022::spl_token_2022::solana_zk_token_sdk::curve25519::scalar::Zeroable;

use crate::constants::{
    BET_FEE, MINUTES_RETURN_FEE_PC, SECONDS_RETURN_FEE_PC, WINNER_MILLISECONDS_REWARD,
};
use crate::errors::ContractError;

pub type Timestamp = i64;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq, InitSpace)]
pub enum ProgramStatus {
    Running,
    BettingPaused,
    Done(Timestamp),
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq, InitSpace)]
pub enum WinnerReward {
    Millisecond(u64),
    // rebates in %pct
    Second(u8),
    // rebates in %pct
    Minute(u8),
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq, InitSpace)]
pub struct BetSettings {
    bet_fee: u8,
    grand_winner_prize: WinnerReward::Millisecond,
    winner_rebate_2nd: WinnerReward::Second,
    winner_rebate_3rd: WinnerReward::Minute,
    bets_free_bundle: u8,
    paid_bets_for_free_bundle: u8,
}

impl Default for BetSettings {
    fn default() -> Self {
        Self {
            bet_fee: BET_FEE,
            grand_winner_prize: WinnerReward::Millisecond(WINNER_MILLISECONDS_REWARD),
            winner_rebate_2nd: WinnerReward::Minute(MINUTES_RETURN_FEE_PC),
            winner_rebate_3rd: WinnerReward::Second(MINUTES_RETURN_FEE_PC),
            bets_free_bundle: 5,
            paid_bets_for_free_bundle: 10,
        }
    }
}

#[account]
#[derive(InitSpace)]
pub struct ProgramConfig {
    pub start_timestamp: Timestamp,

    pub admin: Pubkey,
    pub betting_mint: Pubkey,
    pub program_vault: Pubkey,
    pub transfer_authority: Pubkey,

    pub status: ProgramStatus,
    pub settings: BetSettings,

    pub total_bets_sold: u64,
    pub bump: u8,
}

impl ProgramConfig {
    pub fn init(
        &mut self,
        start_timestamp: Timestamp,
        admin: Pubkey,
        betting_mint: Pubkey,
        program_vault: Pubkey,
        transfer_authority: Pubkey,
        settings: BetSettings,
        bump: u8,
    ) {
        self.start_timestamp = start_timestamp;
        self.admin = admin;
        self.betting_mint = betting_mint;
        self.program_vault = program_vault;
        self.transfer_authority = transfer_authority;
        self.status = ProgramStatus::Running;
        self.settings = settings;
        self.total_bets_sold = 0;
        self.bump = bump
    }
}

// Pubkeys of users that placed bets
// on this millisecond address
// in chronological order
#[account(zero_copy)]
#[derive(InitSpace)]
pub struct MillisecondsBetsState {
    pub initialized: bool,
    // 30k max bets per program address * 32 bytes = 96kb,
    // #[max_len(1, 30_000)]
    // pub users: Box<Vec<Pubkey>>,
    pub users: [Pubkey; 30_000],
}

// milliseconds bets placed for user
#[account]
#[derive(InitSpace)]
pub struct UserBetsState {
    pub initialized: bool,

    pub total_paid_tickets: u64,
    pub available_paid_tickets: u64,
    pub available_free_tickets: u64,
    
    #[max_len(1, 30)]
    pub placed_bet_miliseconds: Vec<i64>, // 30k max bets per program address * 32 bytes = 96kb
}

pub trait BetState<T: Default + Copy> {
    fn init_if_needed(&mut self);
    fn add_bet(&mut self, bet: T) -> Result<()>;
}


impl BetState<Pubkey> for MillisecondsBetsState {
    fn init_if_needed(&mut self) {
        if !self.initialized {
            self.users = [Pubkey::default(); 30_000];
            self.initialized = true;
        }
    }

    fn add_bet(&mut self, bet: Pubkey) {
        for i in 0..self.users.len() {
            if self.users[i] == Pubkey::default() {
                self.users[i] = bet;
                return;
            }
        }
        return ContractError::MillisecondsOverPurchase.into();
    }
}

impl BetState<i64> for UserBetsState {
    fn init_if_needed(&mut self) {
        if !self.initialized {
            self.placed_bet_miliseconds = Vec::new();
            self.available_free_tickets = 0;
            self.available_paid_tickets = 0;
            self.total_paid_tickets = 0;
            self.initialized = true;
        }
    }

    fn add_bet(&mut self, bet: i64) -> Result<()> {
        require!(
            self.placed_bet_miliseconds.len() < 30_000,
            ContractError::UserOverPurchase
        );
        require!(self.has_tickets_left(), ContractError::NoTicketsLeft);
        self.placed_bet_miliseconds.push(bet);
        Ok(())
    }
}

impl UserBetsState {
    pub fn has_tickets_left(&self) -> bool {
        self.available_paid_tickets > 0 || self.available_free_tickets > 0
    }
}
