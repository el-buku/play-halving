import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
} from "react";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
  type AnchorWallet,
} from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { IDL, type PlayHalving } from "../../../target/types/play_halving";
import {
  // ConfirmedSignatureInfo,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import { bettingMint, bettingMintAddy } from "../../../sdk/config";
import { SolanaParser } from "@debridge-finance/solana-transaction-parser";
import {
  getProgramConfigPDADef,
  getSecondStateAcc,
  getUserStateAcc,
} from "../../../sdk/PDAs";
// import { type PlayHalving } from "../../../target/types/play_halving";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import pk from "bn.js";
const BN = pk.BN;
// import {
//   InboundTransactionListener,
//   SubscriptionStreamManager,
// } from "@/services/sol-listener";
// import { SUB_ID } from "@/constants";

type ProgramData = {
  buyTicketsTxn: (
    wallet: AnchorWallet
  ) => (numTickets: number) => Promise<anchor.web3.Transaction>;
  placeBetTxn: (
    wallet: AnchorWallet
  ) => (timestamp: number) => Promise<anchor.web3.Transaction>;
  claimTxn: (wallet: AnchorWallet) => () => Promise<anchor.web3.Transaction>;
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
export const useProgram = () => useContext(ProgramContext);
type ProgramEvtName = PlayHalving["events"][number]["name"];
const useProgramListener = (
  evt: ProgramEvtName,
  callback: (data: any) => void
): number =>
  // : TxnSummary[]
  {
    //@ts-ignore
    const program = new anchor.Program<PlayHalving>(
      IDL,
      programId
      // anchorProvider
    );
    return program.addEventListener(evt, callback);
    // const subscriptionId = program.addEventListener("ClaimEvent", (event) => {
    //   console.log("ClaimEvent", event);
    // });
    // const subscriptionId2 = program.addEventListener(
    //   "PlaceBetEvent",
    //   (event) => {
    //     console.log("PlaceBetEvent", event);
    //   }
    // );
    // const subscriptionId3 = program.addEventListener(
    //   "BuyTicketsEvent",
    //   (event) => {
    //     console.log("BuyTicketsEvent", event);
    //   }
    // );
    // const programConfigPDA = getProgramConfigPDADef(programId)[0];
    // const [txnList, setTxnList] = useState<TxnSummary[]>([]);
    // const { connection } = useConnection();
    // useEffect(() => {
    //   const f = async () => {
    //     const txParser = new SolanaParser([
    //       { idl: IDL as PlayHalving, programId: programAddy },
    //     ]);
    //     const t = await connection.getConfirmedSignaturesForAddress2(programId);
    //     for (let sig of t) {
    //       const txn = await connection.getTransaction(sig.signature);
    //       const parsed = await txParser.parseTransaction(
    //         connection,
    //         sig.signature
    //       );
    //       // const eventParser = new anchor.EventParser(
    //       //   programId,
    //       //   new anchor.BorshCoder(IDL)
    //       // );
    //       // console.log(txn, parsed);
    //       // if (txn?.meta?.logMessages) {
    //       //   console.log(txn.meta.logMessages);
    //       //   const events = eventParser.parseLogs(txn?.meta?.logMessages);
    //       //   for (let event of events) {
    //       //     console.log(event);
    //       //   }
    //       // }
    //     }
    //   };
    //   setInterval(f, 2000);
    // }, [connection, programConfigPDA]);
    // return txnList;
  };
// new InboundTransactionListener(SUB_ID, (txs) => {
//   txs.map(console.log);
// });

// const initStream = useCallback(async (): Promise<void> => {
//   console.log({ programConfigPDA: programConfigPDA.toString() });
//   // const streamManager = new SubscriptionStreamManager(
//   //   bettingMintAddy,
//   //   programConfigPDA.toString()
//   // );
//   // console.log({ streamManager });
//   // const subData = await streamManager.init();
//   // if (!subData?.subscriptionId) {
//   //   console.error("Subscription not created");
//   // } else {
//   // const subId = subData.subscriptionId;

//   // const cleanupStream = async () => {
//   //   console.log("Closing stream sub..");
//   //   await streamManager.closeStream(subId);
//   //   process.exit(0);
//   // };
//   // return cleanupStream;
// }, [programConfigPDA]);
// useEffect(() => {
//   initStream();
// }, [programConfigPDA, initStream]);
// to subscribe for all mints:
// const allMintsSubId = "5a47d17c-6e2e-42f6-bea9-7e458e91adce"

// const parsed = txParser.parseTransaction(connection, sig.signature, false);
// // console.log({ parsed });
// connection.onSignature(txId, (updatedTxInfo, context) =>
//   console.log("Updated account info: ", updatedTxInfo)
// );
// return txnList;

export const ProgramContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const { connection } = useConnection();

  // const wallet = useAnchorWallet();
  // const [userBetStateInfo, setUserBetStateInfo] = useState();
  // if (!wallet) {
  //   return (
  //     <ProgramContext.Provider value={undefined}>
  //       {children}
  //     </ProgramContext.Provider>
  //   );
  // } else {
  const anchorProvider = new anchor.AnchorProvider(
    connection,
    //@ts-ignore
    null,
    anchor.AnchorProvider.defaultOptions()
  );
  //@ts-ignore
  IDL.address = programId;
  console.log({ IDL });

  //@ts-ignore
  const program = new anchor.Program<PlayHalving>(
    IDL,
    programId,
    anchorProvider
  );
  console.log("erer232");

  const programConfigPDA = getProgramConfigPDADef(programId)[0];
  const programVault = getAssociatedTokenAddressSync(
    bettingMint,
    programConfigPDA,
    true
  );
  const buyTicketsTxn = (wallet: AnchorWallet) => (numTickets: number) => {
    const userStateAcc = getUserStateAcc(wallet.publicKey, TOKEN_PROGRAM_ID)[0];

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
      .transaction();
  };
  const placeBetTxn = (wallet: AnchorWallet) => (timestamp: number) => {
    const secondStateAcc = getSecondStateAcc(timestamp, program.programId)[0];
    const userStateAcc = getUserStateAcc(wallet.publicKey, TOKEN_PROGRAM_ID)[0];

    return program.methods
      .placeBet(new BN(timestamp))
      .accounts({
        buyer: wallet.publicKey,
        programConfig: programConfigPDA,
        userStateAcc,
        secondStateAcc,
        systemProgram: SystemProgram.programId,
      })
      .transaction();
  };
  const claimTxn = (wallet: AnchorWallet) => async () => {
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
      .transaction();
  };

  const programState = program.account;
  console.log({ programState });
  // const ads = program.account.userBetsState.subscribe(userStateAcc);
  // ads.on("change", (info) => {
  //   console.log({ userStateAccInfo: info });
  // });

  // const userBetStateInfo = await program.account.userBetsState.fetch(
  //   userStateAcc
  // );
  // console.log("sssttt", { userBetStateInfo });
  return (
    <ProgramContext.Provider
      value={{
        buyTicketsTxn,
        placeBetTxn,
        claimTxn,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};
