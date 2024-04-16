import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./design.css";
import { Providers } from "@/context";
import { Links } from "@/components/Links";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Play Halving Project",
  description: "Bet on bitcoin's halving timestamp for huge rewards",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>
        <body>
          <Links />

          {children}
        </body>
      </Providers>
    </html>
  );
}
