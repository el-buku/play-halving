import Image from "next/image";
import {
  WalletDisconnectButtonDynamic,
  WalletMultiButtonDynamic,
} from "@/components/WalletMultiButton";
import React from "react";

//@ts-ignore
import appHtml from "./homepage.html";
// import { Homepage } from "@/components/Homepage";
import { seeds } from "../../client/config";
import { Homepage } from "@/components/layout/Homepage";

export default function Home() {
  console.log(seeds);
  return <Homepage />;
}
