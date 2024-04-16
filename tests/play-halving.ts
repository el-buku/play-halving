import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { PlayHalving } from "../target/types/play_halving";

import { join } from "path";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  createMint,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

const ANCHOR_TOML_PATH = join(__dirname, "../Anchor.toml");

const seeds = {
  SEEDS_PREFIX: "PLAY_HALVING_____",
  PROGRAM_CONFIG: "PROGRAM_CONFIG",
  MILLISECOND_STATE: "MILLISECOND_STATE",
  USER_STATE: "USER_STATE",
};
const sToB = (seed) => Buffer.from(seed);
const millisToB = (ts: number) =>
  new anchor.BN(ts).toArrayLike(Buffer, "be", 2);

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

const adminWallet = Keypair.generate();
const buyer = Keypair.generate();

describe("play-halving", async () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.PlayHalving as Program<PlayHalving>;
  const connection = program.provider.connection;
  connection.requestAirdrop(adminWallet.publicKey, LAMPORTS_PER_SOL * 8);
  const bettingMint = await createMint(
    connection,
    adminWallet,
    adminWallet.publicKey,
    adminWallet.publicKey,
    2
  );
  const subscriptionId = program.addEventListener("ClaimEvent", (event) => {
    console.log("ClaimEvent", event);
  });
  const subscriptionId2 = program.addEventListener("PlaceBetEvent", (event) => {
    console.log("PlaceBetEvent", event);
  });
  const subscriptionId3 = program.addEventListener(
    "BuyTicketsEvent",
    (event) => {
      console.log("reclaimEvt", event);
    }
  );

  const [programConfigPDA, _config_bump] = PublicKey.findProgramAddressSync(
    [sToB(seeds.SEEDS_PREFIX), sToB(seeds.PROGRAM_CONFIG)],
    program.programId
  );

  const programVault = getAssociatedTokenAddressSync(
    bettingMint,
    programConfigPDA,
    true
  );

  //   this is how you get anchor workspace account types
  type P = anchor.IdlAccounts<PlayHalving>["programConfig"]["settings"];
  const c: P = {
    betFee: new BN(5),
    grandRewardsPool: new BN(100000),
    maxWinnersPaid: 10,
    hourReturnPc: 25,
    minuteReturnPc: 50,
    betsFreeBundle: 2,
    paidBetsForFreeBundle: 5,
    claimWindowHours: 48,
  };

  it("Is initialized!", async () => {
    const tx = await program.methods
      .initialize(c)
      .accounts({
        admin: adminWallet.publicKey,
        programConfig: programConfigPDA,
        programVault: programVault,
        bettingMint,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([adminWallet])
      .rpc();
    console.log("init signature", tx);
    console.log({
      programConfigPDA: await program.account.programConfig.all(),
    });
  });
});
