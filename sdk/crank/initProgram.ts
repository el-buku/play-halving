import { Program } from "@coral-xyz/anchor";
import { type PlayHalving } from "../../target/types/play_halving";
import { programSettings, bettingMintAddy, bettingMint } from "../config";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  createInitializeMint2Instruction,
  createMint,
} from "@solana/spl-token";

import { getProgramConfigPDADef } from "../PDAs";
import {
  SystemProgram,
  LAMPORTS_PER_SOL,
  Connection,
  Keypair,
} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { loadWalletKey } from "../loadKp";
import { BN } from "bn.js";

export const adminWallet = loadWalletKey(__dirname + "/../../deployment.json");
const run = async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.PlayHalving as Program<PlayHalving>;
  // const connection = new Connection("https://api.devnet.solana.com");
  const connection = provider.connection;
  console.log({ provider, connection });
  console.log({ here: program.programId.toString() });
  const betm = Keypair.generate();
  const bettingMint = await createMint(
    connection,
    adminWallet,
    adminWallet.publicKey,
    adminWallet.publicKey,
    2,
    betm
  );
  if (provider.connection.rpcEndpoint.includes("0.0.0.0")) {
    console.log("Running on localnet...");
    // console.log("connection", await connection.getLatestBlockhashAndContext());
    await connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        adminWallet.publicKey,
        10 * LAMPORTS_PER_SOL
      )
      //    const b=  {
      //   signature:await provider.connection.requestAirdrop(
      //     adminWallet.publicKey,
      //     10 * LAMPORTS_PER_SOL
      //   ) ,
      //   ...(await connection.getLatestBlockhash("confirmed")),
      // }
    );
  }

  const [programConfigPDA, _config_bump] = getProgramConfigPDADef(
    program.programId
  );

  // console.log({
  //   [bettingMintAddy]: await connection.getAccountInfo(bettingMint),
  // });
  const programVault = getAssociatedTokenAddressSync(
    bettingMint,
    programConfigPDA,
    true
  );
  const adminATAInfo = await getOrCreateAssociatedTokenAccount(
    connection,
    adminWallet,
    bettingMint,
    adminWallet.publicKey
  );
  const mintTxId = await mintTo(
    connection,
    adminWallet,
    bettingMint,
    adminATAInfo.address,
    adminWallet,
    100000
  );
  const res = await connection.confirmTransaction(mintTxId, "confirmed");
  console.log({ res });
  // console.log({ adminPDA });
  // const slo = await getOrCreateAssociatedTokenAccount(
  //   connection,
  //   adminWallet,
  //   bettingMint,
  //   adminWallet.publicKey
  // );
  const adminATA = await getAssociatedTokenAddressSync(
    bettingMint,
    adminWallet.publicKey
  );
  // const adminPDA = await getOrCreateAssociatedTokenAccount(
  //   connection,
  //   adminWallet,
  //   bettingMint,
  //   adminWallet.publicKey
  // );
  console.log({ adminPDA: adminATA });
  const adminTknAc = await connection.getTokenAccountBalance(adminATA);
  console.log({ adminTknAc });
  if (adminTknAc.value.uiAmount === 0) {
    throw new Error("Admin PDA has no tokens");
  }
  const tx = await program.methods
    .initialize(programSettings)
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
  const bhash = await connection.getLatestBlockhash("confirmed");

  await connection.confirmTransaction(
    {
      signature: tx,
      ...bhash,
    },
    "confirmed"
  );
};
run();
