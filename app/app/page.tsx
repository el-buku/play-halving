import Image from "next/image";
import {
  WalletDisconnectButtonDynamic,
  WalletMultiButtonDynamic,
} from "@/components/WalletMultiButton";

import React from "react";

//@ts-ignore
import appHtml from "./homepage.html";
import { seeds } from "../../client/config";

export default function Home() {
  console.log(seeds);
  return (
    <body>
      <WalletMultiButtonDynamic />
    </body>
  );
}
