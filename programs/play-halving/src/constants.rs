pub const GRAND_REWARDS_POOL: u64 = 100_000;
pub static BET_FEE: u64 = 5;

pub const MINUTES_RETURN_FEE_PC: u8 = 50;
pub const HOUR_RETURN_FEE_PC: u8 = 25;

pub const BETS_FREE_BUNDLE: u8 = 3;
pub const PAID_BETS_FOR_FREE_BUNDLE: u8 = 5;

pub const MAX_WINNERS_PAID: usize = 10;
pub const CLAIM_WINDOW_HOURS: u8 = 48;

pub mod seeds {
    pub const SEEDS_PREFIX: &str = "PLAY_HALVING_____";
    pub const PROGRAM_CONFIG: &str = "PROGRAM_CONFIG";
    pub const SECOND_STATE: &str = "SECOND_STATE";
    pub const USER_STATE: &str = "USER_STATE";
}
