import { Program } from "@coral-xyz/anchor";
import { PlayHalving } from "../../target/types/play_halving";
import { bettingMint, programSettings, bettingMintAddy } from "../config";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
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
  console.log({ here: program.programId.toString() });
  const bettingM = Keypair.generate();
  if (provider.connection.rpcEndpoint.includes("localhost")) {
    console.log("Running on devnet...");
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

  console.log({
    [bettingMintAddy]: await connection.getAccountInfo(bettingMint),
  });
  const programVault = getAssociatedTokenAddressSync(
    bettingMint,
    programConfigPDA,
    true
  );
  // const adminPDA = await getOrCreateAssociatedTokenAccount(
  //   connection,
  //   adminWallet,
  //   bettingMint,
  //   adminWallet.publicKey
  // );
  // console.log({ adminPDA });
  // const slo = await getOrCreateAssociatedTokenAccount(
  //   connection,
  //   adminWallet,
  //   bettingMint,
  //   adminWallet.publicKey
  // );
  const adminPDA = await getAssociatedTokenAddressSync(
    bettingMint,
    adminWallet.publicKey
  );
  // const adminPDA = await getOrCreateAssociatedTokenAccount(
  //   connection,
  //   adminWallet,
  //   bettingMint,
  //   adminWallet.publicKey
  // );
  console.log({ adminPDA });
  const adminTknAc = await connection.getTokenAccountBalance(adminPDA);
  console.log({ adminTknAc });
  if (0 === 0) {
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
