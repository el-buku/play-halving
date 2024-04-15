use anchor_lang::prelude::*;
use anchor_lang::solana_program::vote::instruction;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{Mint, TokenAccount};

use crate::constants::seeds::{MILLISECOND_STATE, PROGRAM_CONFIG, SEEDS_PREFIX, TRANSFER_AUTHORITY, USER_STATE};
use crate::errors::ContractError;
use crate::state::{BetState, MillisecondsBetsState, ProgramConfig, UserBetsState};
use crate::state::program_config::{ProgramSettings, ProgramStatus};

#[derive(Accounts)]
#[instruction(timestamp_to_bet: i64)]
pub struct PlaceBet<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(
    mut,
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
}

impl<'info> PlaceBet<'info> {
    pub fn execute(ctx: Context<Self>, timestamp_to_bet: i64) -> Result<()> {
        let buyer = &ctx.accounts.buyer;
        let program_config = &mut ctx.accounts.program_config;
        require!(program_config.status==ProgramStatus::Running,ContractError::BettingPaused);
        let user_state = &mut ctx.accounts.user_state_acc;
        let millisecond_state = &mut ctx.accounts.millisecond_state_acc;
        user_state.add_bet(timestamp_to_bet).unwrap();
        millisecond_state.add_bet(buyer.key()).unwrap();
        program_config.total_bets_sold += 1;
        Ok(())
    }
}
