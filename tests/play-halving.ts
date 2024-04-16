import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { PlayHalving } from "../target/types/play_halving";

import { join } from "path";
import { Keypair, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  createMint,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { getProgramConfigPDADef } from "../client/utils";
import { assert, expect } from "chai";

const ANCHOR_TOML_PATH = join(__dirname, "../Anchor.toml");

const adminWallet = Keypair.generate();
const mintKp = Keypair.generate();
const buyers = Array.from({ length: 100 }, (_, i) => {
  return Keypair.generate();
});

describe("play-halving", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.PlayHalving as Program<PlayHalving>;
  const connection = program.provider.connection;

  // tests prelude
  let bettingMint: anchor.web3.PublicKey = mintKp.publicKey;
  before(async () => {
    await connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        adminWallet.publicKey,
        10 * LAMPORTS_PER_SOL
      )
    );
    bettingMint = await createMint(
      connection,
      adminWallet,
      adminWallet.publicKey,
      adminWallet.publicKey,
      2,
      mintKp
    );
  });

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

  const [programConfigPDA, _config_bump] = getProgramConfigPDADef(
    program.programId
  );

  const programVault = getAssociatedTokenAddressSync(
    bettingMint,
    programConfigPDA,
    true
  );

  // this is how you get anchor workspace account types
  type ProgramSettings =
    anchor.IdlAccounts<PlayHalving>["programConfig"]["settings"];
  const programTestSettings: ProgramSettings = {
    betFee: new BN(5),
    grandRewardsPool: new BN(100000),
    maxWinnersPaid: 10,
    hourReturnPc: 25,
    minuteReturnPc: 50,
    betsFreeBundle: 2,
    paidBetsForFreeBundle: 5,
    claimWindowHours: (1 / 60 / 60) * 30, //30 sec for testing
  };
  it("Is initialized!", async () => {
    const tx = await program.methods
      .initialize(programTestSettings)
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

    // const programConfigAcc = await program.account.programConfig.all();
    // programConfigAcc.map(console.log);

    expect(tx).to.not.be.null;
  });
});
