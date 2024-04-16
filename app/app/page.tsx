import Image from "next/image";
import {
  WalletDisconnectButtonDynamic,
  WalletMultiButtonDynamic,
} from "@/components/WalletMultiButton";
import HTMLR from "react-html-renderer";
import React from "react";

//@ts-ignore
import appHtml from "./homepage.html";
// import { Homepage } from "@/components/Homepage";
import { seeds } from "../../client/config";

export default function Home() {
  console.log(seeds);
  return <HTMLR html={appHtml} />;

  // return <Homepage />;
}
