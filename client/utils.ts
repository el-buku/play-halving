import * as anchor from "@coral-xyz/anchor";

export const sToB = (seed) => Buffer.from(seed);
export const millisToB = (ts: number) =>
  new anchor.BN(ts).toArrayLike(Buffer, "be", 2);
import bs58 from "bs58";
import { readFileSync } from "fs";
//Load wallet from keypair

export function loadWalletKey(keypairFile: string): anchor.web3.Keypair {
  if (!keypairFile || keypairFile == "") {
    throw new Error("Keypair is required!");
  }

  const wallBuf = new Uint8Array(
    JSON.parse(readFileSync(keypairFile).toString())
  );
  let privKey = bs58.encode(wallBuf);
  console.log({ privKey });
  const loaded = anchor.web3.Keypair.fromSecretKey(wallBuf);
  return loaded;
}
