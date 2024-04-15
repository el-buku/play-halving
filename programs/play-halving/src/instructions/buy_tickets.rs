use anchor_lang::prelude::*;
use anchor_lang::solana_program::vote::instruction;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{Mint, TokenAccount};

use crate::constants::seeds::{PROGRAM_CONFIG, SEEDS_PREFIX, TRANSFER_AUTHORITY};
use crate::state::{
    BetSettings, MillisecondsBetsState, ProgramConfig, ProgramStatus, UserBetsState,
};

#[derive(Accounts)]
#[instruction(num_tickets: u8)]
pub struct BuyTickets<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(
    seeds = [
    SEEDS_PREFIX.as_bytes(),
    PROGRAM_CONFIG.as_bytes()
    ],
    bump,
    )]
    pub program_config: Account<'info, ProgramConfig>,

    /// CHECK: empty PDA, will be set as authority for rewards distribution
    #[account(
    seeds = [
    SEEDS_PREFIX.as_bytes(),
    TRANSFER_AUTHORITY.as_bytes(),
    ], bump)]
    pub transfer_authority: UncheckedAccount<'info>,

    #[account(
    associated_token::mint = program_config.betting_mint,
    associated_token::authority = program_config.transfer_authority
    )]
    pub program_vault: Account<'info, TokenAccount>,

    #[account(
    address = program_config.betting_mint
    )]
    pub betting_mint: Account<'info, Mint>,

    #[account(
    mut,
    associated_token::mint = program_config.betting_mint,
    associated_token::authority = buyer
    )]
    pub buyer_ata: Account<'info, TokenAccount>,

    #[account(
    init_if_needed,
    payer = buyer,
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

impl<'info> BuyTickets<'info> {
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
        //     BetSettings::default(),
        //     ctx.bumps.program_config,
        // );
        Ok(())
    }
}
