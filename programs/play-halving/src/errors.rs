use anchor_lang::prelude::*;

#[error_code]
pub enum ContractError {
    #[msg("This milliscond has been fully booked, try another bet.")]
    MillisecondsOverPurchase,
    #[msg("This user account has been fully booked, try with another wallet.")]
    UserOverPurchase,
    #[msg("No tickets left, buy some more")]
    NoTicketsLeft,
}
