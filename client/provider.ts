import * as anchor from "@coral-xyz/anchor";
import { PlayHalving } from "../target/types/play_halving";
import { PublicKey } from "@solana/web3.js";
export class ProgramProvider<IDL extends anchor.Idl = PlayHalving> {
  anchorProvider: anchor.AnchorProvider;
  connection: anchor.web3.Connection;
  program: anchor.Program<IDL>;
  bettingMint: PublicKey;
  constructor(
    provider: anchor.AnchorProvider,
    connection: anchor.web3.Connection,
    programId: PublicKey,
    program: anchor.Program<IDL>,
    idl: IDL,
    bettingMint: PublicKey
  ) {
    this.anchorProvider = provider;
    this.connection = connection;
    this.program = new anchor.Program<IDL>(
      idl,
      this.anchorProvider.wallet.publicKey,
      this.anchorProvider
    );
  }
}
