use crate::constants::seeds::{PROGRAM_CONFIG, SEEDS_PREFIX, TRANSFER_AUTHORITY};
use crate::state::{BetSettings, ProgramConfig, ProgramStatus};
use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[derive(Accounts)]
pub struct InitProgram<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        init,
        payer=admin,
        seeds=[
            SEEDS_PREFIX.as_bytes(),
            PROGRAM_CONFIG.as_bytes()
            ],
        bump,
        space=ProgramConfig::INIT_SPACE
        )]
    pub program_config: Account<'info, ProgramConfig>,
    /// CHECK: empty PDA, will be set as authority for rewards distribution
    #[account(init,space=0, payer=admin,
        seeds=[
            SEEDS_PREFIX.as_bytes(),
            TRANSFER_AUTHORITY.as_bytes(),
        ], bump)]
    pub transfer_authority: UncheckedAccount<'info>,

    #[account(
        init,
        payer=admin,
        associated_token::mint = betting_mint,
        associated_token::authority = transfer_authority)]
    pub program_vault: Account<'info, TokenAccount>,

    pub betting_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>, // For accessing the current blockchain timestamp
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
}
impl<'info> InitProgram<'info> {
    pub fn execute(ctx: Context<Self>) -> Result<()> {
        let clock = Clock::get().unwrap();

        let admin = &ctx.accounts.admin;
        let program_config = &mut ctx.accounts.program_config;
        program_config.init(
            clock.unix_timestamp,
            admin.key(),
            ctx.accounts.betting_mint.key(),
            ctx.accounts.program_vault.key(),
            ctx.accounts.transfer_authority.key(),
            BetSettings::default(),
            ctx.bumps.program_config,
        );
        Ok(())
    }
}
