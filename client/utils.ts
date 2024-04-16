import * as anchor from "@coral-xyz/anchor";

import bs58 from "bs58";
import { readFileSync } from "fs";

export const sToB = (seed: string) => Buffer.from(seed);

export function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomTimestamp() {
  // Get the current timestamp in milliseconds
  const now = Date.now();

  // One week in milliseconds (7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds/second)
  const oneWeek = 7 * 24 * 60 * 60 * 1000;

  // Generate a random number of milliseconds within the one week range
  const randomOffset = Math.floor(Math.random() * oneWeek);

  // Add the random offset to the current timestamp to get the random timestamp
  const randomTimestamp = now + randomOffset;

  return randomTimestamp;
}
