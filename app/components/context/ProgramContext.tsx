"use client";

import {
  PropsWithChildren,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { IDL, PlayHalving } from "../../../target/types/play_halving";
import {
  ConfirmedSignatureInfo,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import { bettingMint } from "../../../client/config";
import { SolanaParser } from "@debridge-finance/solana-transaction-parser";
import {
  getProgramConfigPDADef,
  getSecondStateAcc,
  getUserStateAcc,
} from "../../../client/PDAs";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";

type ProgramData = {
  buyTicketsIxn: (
    numTickets: number
  ) => Promise<anchor.web3.TransactionInstruction>;
  placeBetIxn: (
    timestamp: number
  ) => Promise<anchor.web3.TransactionInstruction>;
  claimIxn: () => Promise<anchor.web3.TransactionInstruction>;
};
const ProgramContext = createContext<ProgramData | undefined>(undefined);

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
  // // console.log({ parsed });
  // connection.onSignature(txId, (updatedTxInfo, context) =>
  //   console.log("Updated account info: ", updatedTxInfo)
  // );
  return txnList;
};

export const ProgramContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [userBetStateInfo, setUserBetStateInfo] = useState();
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
    const programConfigPDA = getProgramConfigPDADef(programId)[0];
    const programVault = getAssociatedTokenAddressSync(
      bettingMint,
      programConfigPDA,
      true
    );
    const userStateAcc = getUserStateAcc(wallet.publicKey, TOKEN_PROGRAM_ID)[0];
    const buyTicketsIxn = (numTickets: number) => {
      const buyerAta = getAssociatedTokenAddressSync(
        bettingMint,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID
      );
      return program.methods
        .buyTickets(numTickets)
        .accounts({
          buyer: wallet.publicKey,
          buyerAta,
          programVault,
          programConfig: programConfigPDA,
          bettingMint,
          userStateAcc,
          systemProgram: SystemProgram.programId,
          associatedTokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction();
    };
    const placeBetIxn = (timestamp: number) => {
      const secondStateAcc = getSecondStateAcc(timestamp, program.programId)[0];

      return program.methods
        .placeBet(new anchor.BN(timestamp))
        .accounts({
          buyer: wallet.publicKey,
          programConfig: programConfigPDA,
          userStateAcc,
          secondStateAcc,
          systemProgram: SystemProgram.programId,
        })
        .instruction();
    };
    const claimIxn = async () => {
      const ata = await getAssociatedTokenAddress(
        bettingMint,
        wallet.publicKey,
        false
      );
      // Claim rewards
      return await program.methods
        .claim()
        .accounts({
          buyer: wallet.publicKey,
          buyerAta: ata,
          programConfig: programConfigPDA,
          programVault: programVault,
          bettingMint: bettingMint,
          userStateAcc: getUserStateAcc(wallet.publicKey, program.programId)[0],
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .instruction();
    };
    const ads = program.account.userBetsState.subscribe(userStateAcc);
    ads.on("change", (info) => {
      console.log({ userStateAccInfo: info });
    });
    // const userBetStateInfo = await program.account.userBetsState.fetch(
    //   userStateAcc
    // );
    // console.log("sssttt", { userBetStateInfo });
    return (
      <ProgramContext.Provider
        value={{
          buyTicketsIxn,
          placeBetIxn,
          claimIxn,
        }}
      >
        {children}
      </ProgramContext.Provider>
    );
  }
};
