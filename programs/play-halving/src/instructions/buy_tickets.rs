use anchor_lang::prelude::*;
use anchor_lang::solana_program::vote::instruction;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{Mint, TokenAccount};

use crate::constants::seeds::{PROGRAM_CONFIG, SEEDS_PREFIX, TRANSFER_AUTHORITY, USER_STATE};
use crate::errors::ContractError;
use crate::state::{
    MillisecondsBetsState, ProgramConfig, ProgramSettings, ProgramStatus, UserBetsState};

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
    program_config.key().as_ref()
    ], bump = program_config.transfer_authority_bump)]
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
    space = UserBetsState::INIT_SPACE,
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
    pub fn execute(ctx: Context<Self>, num_tickets: u8) -> Result<()> {
        let buyer = &ctx.accounts.buyer;
        let mint = &ctx.accounts.betting_mint;
        let buyer_ata = &ctx.accounts.buyer_ata;
        let program_config = &ctx.accounts.program_config;
        let program_settings = program_config.settings;
        let tickets_price =
            num_tickets as u64 *
                program_settings.bet_fee *
                10_u64.pow(mint.decimals as u32);
        
        require_gte!(buyer_ata.amount, tickets_price, ContractError::NotEnoughTokens);
        msg!("Begin transfer");

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
