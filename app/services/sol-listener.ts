// import WebSocket from "isomorphic-ws";
// import { Connection, PublicKey } from "@solana/web3.js";
// import {
//   dataStreamFilters,
//   RestClient,
//   CreateStreamsRequest,
//   DeleteStreamsRequest,
//   TokenTransferStream,
// } from "@hellomoon/api";
// import { API_KEY, RPC_URL, RPC_WSS } from "@/constants";

// type TxnData = {
//   blockId: number;
//   blockTime: number;
//   transactionId: string;
//   transactionPosition: number;
//   account: string;
//   accountOwner?: string; // Optional field
//   mint?: string; // Optional field
//   decimals: number;
//   preBalance: number;
//   postBalance: number;
//   amount: number;
// };

// // {
// //     blockId: 258555913,
// //     blockTime: 1712352270,
// //     transactionId: '5XXefKwBuMC9dwDBRxrvBWkMFyM5SsmzHuKtV98bmsXDCVUQKKGaAKKVpA6YiN8kUpjxcNPEU24ihPANKFx58Wb8',
// //     transactionPosition: 422,
// //     account: '96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5',
// //     accountOwner: 'AEHdYwoHCGwXoRxRjY39oRGe1jUKYy6w85LWESHbFRW3',
// //     mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
// //     decimals: 9,
// //     preBalance: 53013823,
// //     postBalance: 58013823,
// //     amount: 5000000
// //   },

// export class InboundTransactionListener {
//   socket: WebSocket;
//   subId: string;
//   onTransactions: (txns: TxnData[]) => void;
//   constructor(subId: string, onTransaction: (txns: TxnData[]) => void) {
//     this.subId = subId;
//     this.connect();
//     this.onTransactions = onTransaction;
//     this.socket = new WebSocket(RPC_WSS);
//   }

//   connect(e = null) {
//     this.socket = new WebSocket(RPC_WSS);

//     this.socket.addEventListener("open", (e) => this.onOpen(e));
//     this.socket.addEventListener("message", (e) => this.onMessage(e));
//     this.socket.addEventListener("close", (e) => this.connect()); //Reconnect
//   }

//   onOpen(e: { target: WebSocket }) {
//     console.log("Socket open");
//     const msg = JSON.stringify({
//       action: "subscribe",
//       apiKey: API_KEY,
//       subscriptionId: this.subId,
//     });

//     this.send(msg);
//   }

//   onMessage(e: { data: any; type: string; target: WebSocket }) {
//     if (e.data.indexOf("successfully subscribed") > -1) return; //Subscribed

//     const d: TxnData[] = JSON.parse(e.data);
//     this.onTransactions(d);
//   }
//   send(message, callback?) {
//     this.waitForC(() => {
//       this.socket.send(message);
//       if (typeof callback !== "undefined") {
//         callback();
//       }
//     }, 1000);
//   }
//   waitForC(callback, interval) {
//     if (this.socket.readyState === 1) {
//       callback();
//     } else {
//       var that = this;
//       // optional: implement backoff for interval here
//       setTimeout(function () {
//         that.waitForC(callback, interval);
//       }, interval);
//     }
//   }
// }

// export class SubscriptionStreamManager {
//   stream: TokenTransferStream;
//   restClient: RestClient;
//   constructor(mintAddr: string, owner: string) {
//     this.stream = new TokenTransferStream({
//       target: {
//         targetType: "WEBSOCKET",
//       },
//       filters: {
//         mint: dataStreamFilters.text.equals(mintAddr),
//         amount: dataStreamFilters.numeric.greaterThanEquals(0),
//         // owner:
//         // owner: {
//         //   //@ts-ignore
//         //   fields: ["destinationOwner"],
//         //   filter: dataStreamFilters.text.equals(owner),
//         //   type: "COMPOSITE",
//         // },
//       },
//     });
//     this.restClient = new RestClient(API_KEY);
//   }
//   async init() {
//     const subData = this.restClient.send(new CreateStreamsRequest(this.stream));
//     return subData;
//   }
//   async closeStream(subId: string) {
//     return this.restClient.send(new DeleteStreamsRequest(subId));
//   }
// }
