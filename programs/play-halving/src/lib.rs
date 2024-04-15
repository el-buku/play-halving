use anchor_lang::prelude::*;

mod constants;
mod errors;
mod instructions;
mod state;
use instructions::*;
declare_id!("AwhF2my6A4mmpBBSP2UAWFo4392DY6Vp6TdrP1uFPCvu");

#[program]
pub mod play_halving {
    use super::*;

    pub fn initialize(ctx: Context<InitProgram>) -> Result<()> {
        InitProgram::execute(ctx)
    }
}
