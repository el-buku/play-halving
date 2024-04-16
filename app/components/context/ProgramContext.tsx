import { PropsWithChildren, createContext } from "react";
import { ProgramProvider } from "../../../client/provider";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { IDL, PlayHalving } from "../../../target/types/play_halving";
import { PublicKey } from "@solana/web3.js";
import { bettingMint } from "../../../client/config";

const ProgramContext = createContext<ProgramProvider | undefined>(undefined);

// TODO
const programAddy = "AwhF2my6A4mmpBBSP2UAWFo4392DY6Vp6TdrP1uFPCvu";
export const ProgramContextProvider: React.FC<PropsWithChildren<null>> = ({
  children,
}) => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  if (!wallet || !connection) {
    return (
      <ProgramContext.Provider value={undefined}>
        {children}
      </ProgramContext.Provider>
    );
  } else {
    const anchorProvider = new anchor.AnchorProvider(
      connection,
      wallet,
      anchor.AnchorProvider.defaultOptions()
    );
    const programId = new PublicKey(programAddy);
    const program = new anchor.Program<PlayHalving>(
      IDL,
      programId,
      anchorProvider
    );
    const programProvider = new ProgramProvider(
      anchorProvider,
      connection,
      programId,
      program,
      IDL,
      bettingMint
    );
    return (
      <ProgramContext.Provider value={programProvider}>
        {children}
      </ProgramContext.Provider>
    );
  }
};
