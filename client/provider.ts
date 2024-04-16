import * as anchor from "@coral-xyz/anchor";
import { PlayHalving } from "../target/types/play_halving";
export class ProgramProvider<IDL extends anchor.Idl = PlayHalving> {
  anchorProvider: anchor.AnchorProvider;
  connection: anchor.web3.Connection;
  program: anchor.Program<IDL>;
}
