use anchor_derive_space::InitSpace;
use anchor_lang::prelude::*;

use crate::errors::ContractError;
use crate::state::{ProgramSettings, ProgramStatus};

pub trait BetState<T: Default + Copy> {
    fn init_if_needed(&mut self);
    fn add_bet(&mut self, bet: T) -> anchor_lang::Result<()>;
}

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

impl BetState<Pubkey> for MillisecondsBetsState {
    fn init_if_needed(&mut self) {
        if !self.initialized {
            self.users = [Pubkey::default(); 30_000];
            self.initialized = true;
        }
    }

    fn add_bet(&mut self, bet_user: Pubkey) -> Result<()> {
        for i in 0..self.users.len() {
            if self.users[i] == Pubkey::default() {
                self.users[i] = bet_user;
                return Ok(());
            }
        }
        Err(ContractError::MillisecondsOverPurchase.into())
    }
}

// milliseconds bets placed for user
#[account]
#[derive(InitSpace)]
pub struct UserBetsState {
    pub initialized: bool,
    pub has_reclaimed: bool,
    pub total_paid_tickets: u64,
    pub available_paid_tickets: u64,
    pub available_free_tickets: u64,
    pub total_placed_tickets: u64,
    #[max_len(30_000)]
    pub placed_bet_milliseconds: Vec<i64>, // 30k max bets per program address * 32 bytes = 96kb
}


impl UserBetsState {
    pub fn allocate_tickets_with_bonus(&mut self, num_tickets: u8, settings: ProgramSettings) {
        let mut extra_free_tickets = 0;
        for _ in 0..num_tickets {
            self.total_paid_tickets += 1;
            self.available_paid_tickets += 1;
            if self.total_paid_tickets % settings.paid_bets_for_free_bundle as u64 == 0 {
                extra_free_tickets += settings.bets_free_bundle;
            }
        }

        self.available_free_tickets += extra_free_tickets as u64;
    }
    pub fn get_rebates_amount(&self, halving_timestamp: i64, ticket_price: u64) -> u64 {
        let bets = &self.placed_bet_milliseconds;
        let one_second = 1_000;// milliseconds
        let one_minute = one_second * 60;
        for bet in bets.iter() {
            let diff = (halving_timestamp - bet).abs();
            if diff < one_second {
                // return 0;
            } else if diff < one_minute {} else {}
        }


        0_u64
    }
}

impl BetState<i64> for UserBetsState {
    fn init_if_needed(&mut self) {
        if !self.initialized {
            self.placed_bet_milliseconds = Vec::new();
            self.available_free_tickets = 0;
            self.available_paid_tickets = 0;
            self.total_paid_tickets = 0;
            self.total_placed_tickets = 0;
            self.initialized = true;
            self.has_reclaimed = false;
        }
    }

    fn add_bet(&mut self, bet_millisecond: i64) -> anchor_lang::Result<()> {
        require!(
            self.placed_bet_milliseconds.len() < 30_000,
            ContractError::UserOverPurchase
        );
        let has_tickets_left: bool = self.available_paid_tickets > 0 || self.available_free_tickets > 0;
        require!(has_tickets_left, ContractError::NoTicketsLeft);
        if self.available_free_tickets > 0 {
            self.available_free_tickets -= 1;
        } else if self.available_paid_tickets > 0 {
            self.available_paid_tickets -= 1;
        } else {
            return Err(ContractError::NoTicketsLeft.into());
        }
        self.placed_bet_milliseconds.push(bet_millisecond);
        self.total_placed_tickets += 1;
        Ok(())
    }
}

