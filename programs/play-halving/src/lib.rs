use anchor_lang::prelude::*;

use instructions::*;

mod constants;
mod errors;
mod instructions;
mod state;

declare_id!("AwhF2my6A4mmpBBSP2UAWFo4392DY6Vp6TdrP1uFPCvu");

#[program]
pub mod play_halving {
    use super::*;

    pub fn initialize(ctx: Context<InitProgram>) -> Result<()> {
        InitProgram::execute(ctx)
    }

    pub fn buy_tickets(ctx: Context<BuyTickets>, num_tickets: u8) -> Result<()> {
        BuyTickets::execute(ctx, num_tickets)
    }

    pub fn place_bet(ctx: Context<PlaceBet>, timestamp_to_bet: i64) -> Result<()> {
        PlaceBet::execute(ctx, timestamp_to_bet)
    }

    pub fn pause_betting(ctx: Context<PauseBetting>) -> Result<()> {
        PauseBetting::execute(ctx)
    }

    pub fn mark_halving(ctx: Context<MarkHalvingTimestaml>, halving_timestamp: i64) -> Result<()> {
        MarkHalvingTimestaml::execute(ctx, halving_timestamp)
    }

    // pub fn reclaim()
}