import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Walrus Insight Engine | AI-Powered Game Analytics",
  description: "Transform game settlement data into verifiable on-chain insights using AWS Bedrock AI + Walrus Storage + Sui NFTs",
  keywords: ["sui", "walrus", "blockchain", "game analytics", "nft", "ai"],
  authors: [{ name: "@soaryong" }],
  openGraph: {
    title: "Walrus Insight Engine",
    description: "AI-Powered Game Economy Analytics on Sui Blockchain",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
