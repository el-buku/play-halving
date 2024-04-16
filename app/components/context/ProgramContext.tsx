"use client";

import {
  PropsWithChildren,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ProgramProvider } from "../../../client/provider";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { IDL, PlayHalving } from "../../../target/types/play_halving";
import { ConfirmedSignatureInfo, PublicKey } from "@solana/web3.js";
import { bettingMint } from "../../../client/config";
import { SolanaParser } from "@debridge-finance/solana-transaction-parser";

const ProgramContext = createContext<ProgramProvider | undefined>(undefined);

// TODO
const programAddy = "AwhF2my6A4mmpBBSP2UAWFo4392DY6Vp6TdrP1uFPCvu";
const programId = new PublicKey(programAddy);

export type TxnSummary = {
  wallet: string;
  timestamp: number;
  sig: string;
  totalAmountTickets: number;
};

const useTxnList = (): TxnSummary[] => {
  const { connection } = useConnection();
  const [txnList, setTxnList] = useState<TxnSummary[]>([]);

  const txParser = new SolanaParser([
    { idl: IDL as PlayHalving, programId: programAddy },
  ]);

  // const parsed = txParser.parseTransaction(connection, sig.signature, false);
  // console.log({ parsed });
  connection.onSignature(txId, (updatedTxInfo, context) =>
    console.log("Updated account info: ", updatedTxInfo)
  );
  return txnList;
};

export const ProgramContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  let txnList = useTxnList();
  if (!wallet) {
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
