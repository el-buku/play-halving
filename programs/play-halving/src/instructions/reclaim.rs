use anchor_lang::prelude::*;
use anchor_lang::solana_program::vote::instruction;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::constants::seeds::{PROGRAM_CONFIG, SECOND_STATE, SEEDS_PREFIX, TRANSFER_AUTHORITY, USER_STATE};
use crate::errors::ContractError;
use crate::state::{BetState, program_config, ProgramConfig, SecondsBetsState, UserBetsState};
use crate::state::program_config::{ProgramSettings, ProgramStatus};

#[derive(Accounts)]
pub struct Reclaim<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(
    mut,
    associated_token::mint = program_config.betting_mint,
    associated_token::authority = buyer
    )]
    pub buyer_ata: Account<'info, TokenAccount>,

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
    mut,
    associated_token::mint = program_config.betting_mint,
    associated_token::authority = program_config
    )]
    pub program_vault: Account<'info, TokenAccount>,
    #[account(
    address = program_config.betting_mint
    )]
    pub betting_mint: Account<'info, Mint>,

    // #[account(
    // init_if_needed,
    // payer = buyer,
    // space = SecondsBetsState::INIT_SPACE,
    // seeds = [
    // SEEDS_PREFIX.as_bytes(),
    // SECOND_STATE.as_bytes(),
    // timestamp_to_bet.to_le_bytes().as_ref(),
    // ],
    // bump
    // )]
    // pub second_state_acc: Account<'info, SecondsBetsState>,

    #[account(
    seeds = [
    SEEDS_PREFIX.as_bytes(),
    USER_STATE.as_bytes(),
    buyer.key().as_ref(),
    ],
    bump
    )]

    pub user_state_acc: Account<'info, UserBetsState>,
    pub token_program: Program<'info, Token>,

    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> Reclaim<'info> {
    pub fn execute(ctx: Context<Self>) -> Result<()> {
        let program_config = &mut ctx.accounts.program_config;
        match program_config.status {
            ProgramStatus::Done(halving_ms) => {
                let user_state = &mut ctx.accounts.user_state_acc;
                // err if user has reclaimed
                require!(!user_state.has_reclaimed,ContractError::AlreadyReclaimed);

                let buyer = &ctx.accounts.buyer;
                let program_vault = &mut ctx.accounts.program_vault;
                let buyer_ata = &ctx.accounts.buyer_ata;
                let mint = &ctx.accounts.betting_mint;
                let e_decimals = 10_u64.pow(mint.decimals as u32);
                let ticket_price = program_config.settings.bet_fee *
                    e_decimals;

                let program_has_winner = program_config.winner.is_some();
                let amount: u64 = if !program_has_winner {
                    // we return all bets
                    let paid_tickets = user_state.total_paid_tickets;
                    paid_tickets * ticket_price
                } else {
                    // program had winner
                    // we pay back bets matching minute and miliseconds
                    user_state.get_rebates_amount(halving_ms, ticket_price)
                };
                if amount > 0 {
                    program_config.transfer_tokens_out(
                        program_vault.to_account_info(),
                        buyer_ata.to_account_info(),
                        program_config.to_account_info(),
                        ctx.accounts.token_program.to_account_info(),
                        amount,
                    ).unwrap()
                }
                user_state.has_reclaimed = true;
                Ok(())
            }
            _ => {
                Err(ContractError::NotDone.into())
            }
        }
    }
}
