use anchor_derive_space::InitSpace;
use anchor_lang::prelude::*;

use crate::errors::ContractError;

// Pubkeys of users that placed bets
// on this millisecond address
// in chronological order
// #[account(zero_copy)]
// #[derive(AnchorSerialize, AnchorDeserialize,InitSpace)]
#[account]
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
    fn add_bet(&mut self, bet: T) -> anchor_lang::Result<()>;
}


impl BetState<Pubkey> for MillisecondsBetsState {
    fn init_if_needed(&mut self) {
        if !self.initialized {
            self.users = [Pubkey::default(); 30_000];
            self.initialized = true;
        }
    }

    fn add_bet(&mut self, bet: Pubkey) -> Result<()> {
        for i in 0..self.users.len() {
            if self.users[i] == Pubkey::default() {
                self.users[i] = bet;
                return Ok(());
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

    fn add_bet(&mut self, bet: i64) -> anchor_lang::Result<()> {
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
