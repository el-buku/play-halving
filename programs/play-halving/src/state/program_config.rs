use anchor_derive_space::InitSpace;
use anchor_lang::prelude::*;
use anchor_spl::token::Transfer;

use crate::constants::{BET_FEE, BETS_FREE_BUNDLE, MINUTES_RETURN_FEE_PC, PAID_BETS_FOR_FREE_BUNDLE, WINNER_MILLISECONDS_REWARD};
use crate::constants::seeds::{PROGRAM_CONFIG, SEEDS_PREFIX};

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq, InitSpace)]
pub enum ProgramStatus {
    Running,
    BettingPaused,
    Done(i64),
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
pub struct ProgramSettings {
    pub bet_fee: u64,
    pub grand_winner_prize: WinnerReward,
    pub winner_rebate_2nd: WinnerReward,
    pub winner_rebate_3rd: WinnerReward,
    pub bets_free_bundle: u8,
    pub paid_bets_for_free_bundle: u8,
}

impl Default for ProgramSettings {
    fn default() -> Self {
        Self {
            bet_fee: BET_FEE,
            grand_winner_prize: WinnerReward::Millisecond(WINNER_MILLISECONDS_REWARD),
            winner_rebate_2nd: WinnerReward::Minute(MINUTES_RETURN_FEE_PC),
            winner_rebate_3rd: WinnerReward::Second(MINUTES_RETURN_FEE_PC),
            bets_free_bundle: BETS_FREE_BUNDLE,
            paid_bets_for_free_bundle: PAID_BETS_FOR_FREE_BUNDLE,
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

    pub total_bets_sold: u64,
    pub program_config_bump: u8,
}

#[event]
pub struct TransferEvent {
    from: Pubkey,
    to: Pubkey,
    amount: u64,
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
        self.total_bets_sold = 0;
        self.program_config_bump = program_config_bump
    }

    pub fn transfer_from_signer<'info>(
        &self,
        from: AccountInfo<'info>,
        to: AccountInfo<'info>,
        authority: &Signer<'info>,
        token_program: AccountInfo<'info>,
        amount: u64,
    ) -> Result<()> {
        let context = CpiContext::new(
            token_program,
            Transfer {
                from: from.clone(),
                to: to.clone(),
                authority: authority.to_account_info(),
            },
        );
        // .with_signer(authority);

        anchor_spl::token::transfer(context, amount)
        //     .unwrap();
        // emit!(TransferEvent {
        //     from: from.key.clone(),
        //     to: to.key.clone(),
        //     amount,
        // });
        // Ok(())
    }
    pub fn transfer_tokens_out<'info>(
        &self,
        from: AccountInfo<'info>,
        to: AccountInfo<'info>,
        authority: AccountInfo<'info>,
        token_program: AccountInfo<'info>,
        amount: u64,
    ) -> Result<()> {
        let authority_seeds: &[&[&[u8]]] =
            &[&[SEEDS_PREFIX.as_bytes(),
                PROGRAM_CONFIG.as_bytes(), &[self.program_config_bump]]];
        let context = CpiContext::new(
            token_program,
            Transfer {
                from: from.clone(),
                to: to.clone(),
                authority: authority.to_account_info(),
            },
        ).with_signer(authority_seeds);

        anchor_spl::token::transfer(context, amount)
        // .unwrap();
        // emit!(TransferEvent {
        //     from: from.key.clone(),
        //     to: to.key.clone(),
        //     amount,
        // });
        // Ok(())
    }
}
