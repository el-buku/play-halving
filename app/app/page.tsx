import Image from "next/image";
import {
  WalletDisconnectButtonDynamic,
  WalletMultiButtonDynamic,
} from "@/components/wallet-multi-button";

import React from "react";

//@ts-ignore
import appHtml from "./homepage.html";
import { Homepage } from "@/components/homepage";
import { seeds } from "../../client/seeds";

export default function Home() {
  console.log(seeds);
  return <Homepage />;
}
