import { PublicKey } from "@solana/web3.js";
import { seeds } from "./config";
import { sToB, millisToB } from "./utils";

type PDADef = [PublicKey, number];
const getUserStateAcc = async (
  user: PublicKey,
  programId: PublicKey
): Promise<PDADef> => {
  return PublicKey.findProgramAddressSync(
    [sToB(seeds.SEEDS_PREFIX), sToB(seeds.USER_STATE), user.toBuffer()],
    programId
  );
};
const getMillisecondStateAcc = async (
  timestamp: number,
  programId: PublicKey
): Promise<PDADef> => {
  return PublicKey.findProgramAddressSync(
    [
      sToB(seeds.SEEDS_PREFIX),
      sToB(seeds.MILLISECOND_STATE),
      millisToB(timestamp),
    ],
    programId
  );
};
export const getProgramConfigPDADef = (programId: PublicKey) =>
  PublicKey.findProgramAddressSync(
    [sToB(seeds.SEEDS_PREFIX), sToB(seeds.PROGRAM_CONFIG)],
    programId
  );
