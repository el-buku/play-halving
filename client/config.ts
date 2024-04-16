import { BN, IdlAccounts } from "@coral-xyz/anchor";
import { PlayHalving } from "../target/types/play_halving";

//   this is how you get anchor workspace account types
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
