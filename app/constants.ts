import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletConnectWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

export const network = WalletAdapterNetwork.Devnet;
export const endpoint = clusterApiUrl(network);
export const wallets = [
  /**
   * Wallets that implement either of these standards will be available automatically.
   *
   *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
   *     (https://github.com/solana-mobile/mobile-wallet-adapter)
   *   - Solana Wallet Standard
   *     (https://github.com/solana-labs/wallet-standard)
   *
   * If you wish to support a wallet that supports neither of those standards,
   * instantiate its legacy wallet adapter here. Common legacy adapters can be found
   * in the npm package `@solana/wallet-adapter-wallets`.
   */
  new WalletConnectWalletAdapter({
    network: network,
    options: {},
  }),
];
