use anchor_lang::prelude::*;
use anchor_lang::solana_program::vote::instruction;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{Mint, TokenAccount};

use crate::constants::seeds::{MILLISECOND_STATE, PROGRAM_CONFIG, SEEDS_PREFIX, TRANSFER_AUTHORITY, USER_STATE};
use crate::state::{
    MillisecondsBetsState, ProgramConfig, UserBetsState,
};
use crate::state::program_config::{ProgramSettings, ProgramStatus};

#[derive(Accounts)]
#[instruction(timestamp_to_bet: i64)]
pub struct Bet<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(
    seeds = [
    SEEDS_PREFIX.as_bytes(),
    PROGRAM_CONFIG.as_bytes()
    ],
    bump = program_config.program_config_bump,
    )]
    pub program_config: Account<'info, ProgramConfig>,

    #[account(
    init_if_needed,
    payer = buyer,
    space = MillisecondsBetsState::INIT_SPACE,
    seeds = [
    SEEDS_PREFIX.as_bytes(),
    MILLISECOND_STATE.as_bytes(),
    timestamp_to_bet.to_le_bytes().as_ref(),
    ],
    bump
    )]
    pub millisecond_state_acc: Account<'info, MillisecondsBetsState>,

    #[account(
    seeds = [
    SEEDS_PREFIX.as_bytes(),
    USER_STATE.as_bytes(),
    buyer.key().as_ref(),
    ],
    bump
    )]

    pub user_state_acc: Account<'info, UserBetsState>,

    pub system_program: Program<'info, System>,
    // pub clock: Sysvar<'info, Clock>, // For accessing the current blockchain timestamp
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> Bet<'info> {
    pub fn execute(ctx: Context<Self>) -> Result<()> {

        // let clock = Clock::get().unwrap();

        // let admin = &ctx.accounts.admin;
        // let program_config = &mut ctx.accounts.program_config;
        // program_config.init(
        //     clock.unix_timestamp,
        //     admin.key(),
        //     ctx.accounts.betting_mint.key(),
        //     ctx.accounts.program_vault.key(),
        //     ctx.accounts.transfer_authority.key(),
        //     ProgramSettings::default(),
        //     ctx.bumps.program_config,
        // );
        Ok(())
    }
}
