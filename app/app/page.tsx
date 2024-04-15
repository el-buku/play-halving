import Image from "next/image";
import {
  WalletDisconnectButtonDynamic,
  WalletMultiButtonDynamic,
} from "@/components/wallet-multi-button";

import React from "react";

//@ts-ignore
import appHtml from "./homepage.html";

export default function Home() {
  return <html dangerouslySetInnerHTML={{ __html: appHtml }}></html>;
}
