import { BN, IdlAccounts } from "@coral-xyz/anchor";
import { PlayHalving } from "../target/types/play_halving";
import { PublicKey } from "@solana/web3.js";
import { loadWalletKey } from "./utils";

export const adminWallet = loadWalletKey(__dirname + "/../deployment.json");

// this is how you get anchor workspace account types
export type ProgramSettings =
  IdlAccounts<PlayHalving>["programConfig"]["settings"];
export const programSettings: ProgramSettings = {
  betFee: new BN(5),
  grandRewardsPool: new BN(100000),
  maxWinnersPaid: 10,
  hourReturnPc: 25,
  minuteReturnPc: 50,
  betsFreeBundle: 2,
  paidBetsForFreeBundle: 5,
  claimWindowHours: 48,
};

//USDC
export const bettingMintAddy = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
export const bettingMint = new PublicKey(bettingMintAddy);

export const seeds = {
  SEEDS_PREFIX: "PLAY_HALVING_____",
  PROGRAM_CONFIG: "PROGRAM_CONFIG",
  MILLISECOND_STATE: "MILLISECOND_STATE",
  USER_STATE: "USER_STATE",
};
