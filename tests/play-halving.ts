import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PlayHalving } from "../target/types/play_halving";

import { join } from "path";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

const ANCHOR_TOML_PATH = join(__dirname, "../Anchor.toml");

const seeds = {
  SEEDS_PREFIX: "PLAY_HALVING_____",
  PROGRAM_CONFIG: "PROGRAM_CONFIG",
  TRANSFER_AUTHORITY: "TRANSFER_AUTHORITY",
  MILLISECOND_STATE: "MILLISECOND_STATE",
  USER_STATE: "USER_STATE",
};
const sToB = (seed) => Buffer.from(seed);
const millisToB = (ts: number) =>
  new anchor.BN(ts).toArrayLike(Buffer, "be", 2);

const mintAd = "dasmjksmdS";
const bettingMint = new PublicKey(mintAd);

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

describe("play-halving", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.PlayHalving as Program<PlayHalving>;
  const subscriptionId = program.addEventListener("ClaimEvent", (event) => {
    console.log("reclaimEvt", event);
  });

  const adminWallet = Keypair.generate();
  const buyer = Keypair.generate();

  const [programConfigPDA, _config_bumper] = PublicKey.findProgramAddressSync(
    [sToB(seeds.SEEDS_PREFIX), sToB(seeds.PROGRAM_CONFIG)],
    program.programId
  );

  const programVault = getAssociatedTokenAddressSync(
    bettingMint,
    programConfigPDA,
    true
  );

  it("Is initialized!", async () => {
    const tx = await program.methods
      .initialize()
      .accounts({
        admin: adminWallet.publicKey,
        programConfig: programConfigPDA,
        programVault: programVault,
        bettingMing: bettingMint,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();
    console.log("Your transaction signature", tx);
  });
});
