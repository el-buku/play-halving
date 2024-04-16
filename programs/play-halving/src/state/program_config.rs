use anchor_derive_space::InitSpace;
use anchor_lang::prelude::*;
use anchor_spl::token::Transfer;

use crate::constants::seeds::{PROGRAM_CONFIG, SEEDS_PREFIX};
use crate::constants::{
    BETS_FREE_BUNDLE, BET_FEE, CLAIM_WINDOW_HOURS, GRAND_REWARDS_POOL, HOUR_RETURN_FEE_PC,
    MAX_WINNERS_PAID, MINUTES_RETURN_FEE_PC, PAID_BETS_FOR_FREE_BUNDLE,
};

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq, InitSpace)]
pub struct MarkedHalving {
    pub halving_timestamp: i64,
    pub marked_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq, InitSpace)]
pub enum ProgramStatus {
    Running,
    BettingPaused,
    ClaimsOpen(MarkedHalving),
    Closed(MarkedHalving),
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq, InitSpace)]
pub struct ProgramSettings {
    pub bet_fee: u64,
    pub grand_winner_prize: u64, // 100_000
    pub winner_rebate_1: u8,
    pub winner_rebate_2: u8,
    pub bets_free_bundle: u8,
    pub paid_bets_for_free_bundle: u8,
    pub claim_window_hours: u8,
}

impl Default for ProgramSettings {
    fn default() -> Self {
        Self {
            bet_fee: BET_FEE,
            grand_winner_prize: GRAND_REWARDS_POOL,
            winner_rebate_1: MINUTES_RETURN_FEE_PC,
            winner_rebate_2: HOUR_RETURN_FEE_PC,
            bets_free_bundle: BETS_FREE_BUNDLE,
            paid_bets_for_free_bundle: PAID_BETS_FOR_FREE_BUNDLE,
            claim_window_hours: CLAIM_WINDOW_HOURS,
        }
    }
}

#[account]
#[derive(InitSpace)]
pub struct ProgramConfig {
    pub start_timestamp: i64,

    pub admin: Pubkey,
    pub betting_mint: Pubkey,
    pub program_vault: Pubkey,

    pub status: ProgramStatus,
    pub settings: ProgramSettings,

    pub total_bets_placed: u64,
    pub program_config_bump: u8,
    #[max_len(MAX_WINNERS_PAID)]
    pub winners: Vec<Pubkey>,
    pub winners_paid: u8,
}

impl ProgramConfig {
    pub fn init(
        &mut self,
        start_timestamp: i64,
        admin: Pubkey,
        betting_mint: Pubkey,
        program_vault: Pubkey,
        settings: ProgramSettings,
        program_config_bump: u8,
    ) {
        self.start_timestamp = start_timestamp;
        self.admin = admin;
        self.betting_mint = betting_mint;
        self.program_vault = program_vault;
        self.status = ProgramStatus::Running;
        self.settings = settings;
        self.total_bets_placed = 0;
        self.program_config_bump = program_config_bump;
        self.winners = Vec::new();
        self.winners_paid = 0
    }

    pub fn is_claiming_window_open(&self, now: i64) -> bool {
        match self.status {
            ProgramStatus::ClaimsOpen(marked) => {
                now <= marked.marked_at + self.settings.claim_window_hours as i64 * 60 * 60
            }
            _ => false,
        }
    }

    pub fn has_winners(&self) -> bool {
        self.winners
            .iter()
            .any(|winner| winner != &Pubkey::default())
    }

    pub fn transfer_signed_out<'info>(
        &self,
        accounts: Transfer<'info>,
        token_program: AccountInfo<'info>,
        amount: u64,
    ) -> Result<()> {
        let authority_seeds: &[&[&[u8]]] = &[&[
            SEEDS_PREFIX.as_bytes(),
            PROGRAM_CONFIG.as_bytes(),
            &[self.program_config_bump],
        ]];
        let context = CpiContext::new(token_program, accounts).with_signer(authority_seeds);

        anchor_spl::token::transfer(context, amount)
    }
}
