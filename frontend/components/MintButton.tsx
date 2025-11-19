"use client";

import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";

interface MintButtonProps {
  insight: {
    player_id: string;
    total_spend_30d: number;
    tier: string;
    fraud_score: number;
    analysis_date: string;
    walrus_blob_id: string;
    content_hash: string;
  };
}

export default function MintButton({ insight }: MintButtonProps) {
  const client = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [isMinting, setIsMinting] = useState(false);
  const [txDigest, setTxDigest] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMint = async () => {
    setIsMinting(true);
    setError(null);
    setTxDigest(null);

    try {
      // Get contract package ID from environment
      const packageId = process.env.NEXT_PUBLIC_CONTRACT_ID;
      const clockObjectId = "0x6"; // Sui Clock object

      if (!packageId) {
        throw new Error("Contract not deployed. Please set NEXT_PUBLIC_CONTRACT_ID");
      }

      // Convert tier to numeric value
      const tierMap: { [key: string]: number } = {
        casual: 1,
        regular: 2,
        whale: 3,
      };
      const tierValue = tierMap[insight.tier.toLowerCase()] || 1;

      // Convert spend to cents (avoid decimals in Move)
      const totalSpendCents = Math.round(insight.total_spend_30d * 100);

      // Convert fraud score to 0-100 scale
      const fraudScoreInt = Math.round(insight.fraud_score * 100);

      // Create transaction
      const tx = new Transaction();

      tx.moveCall({
        target: `${packageId}::insight_nft::mint_insight`,
        arguments: [
          tx.pure.string(insight.walrus_blob_id), // walrus_blob_id
          tx.pure.string(insight.content_hash), // content_hash
          tx.pure.u8(tierValue), // tier (u8)
          tx.pure.u64(totalSpendCents), // total_spend_cents (u64)
          tx.pure.u8(fraudScoreInt), // fraud_score (u8)
          tx.pure.string(insight.analysis_date), // analysis_date
          tx.object(clockObjectId), // clock
        ],
      });

      // Execute transaction
      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            console.log("Mint successful:", result);
            setTxDigest(result.digest);
            setIsMinting(false);
          },
          onError: (err) => {
            console.error("Mint failed:", err);
            setError(err.message || "Transaction failed");
            setIsMinting(false);
          },
        }
      );
    } catch (err: any) {
      console.error("Mint error:", err);
      setError(err.message || "Unknown error");
      setIsMinting(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleMint}
        disabled={isMinting || !!txDigest}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
          isMinting || txDigest
            ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
        }`}
      >
        {isMinting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Minting NFT...
          </span>
        ) : txDigest ? (
          "✅ NFT Minted Successfully!"
        ) : (
          "🎨 Mint Insight NFT"
        )}
      </button>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
          <p className="text-red-800 dark:text-red-300 text-sm">
            <strong>Error:</strong> {error}
          </p>
          {!process.env.NEXT_PUBLIC_CONTRACT_ID && (
            <p className="text-red-600 dark:text-red-400 text-xs mt-2">
              💡 Tip: Deploy the contract first and set NEXT_PUBLIC_CONTRACT_ID in .env.local
            </p>
          )}
        </div>
      )}

      {txDigest && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
          <p className="text-green-800 dark:text-green-300 text-sm mb-2">
            <strong>Transaction successful!</strong>
          </p>
          <a
            href={`https://suiscan.xyz/testnet/tx/${txDigest}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-mono break-all"
          >
            View on Suiscan →
          </a>
        </div>
      )}

      {/* NFT Preview */}
      <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">
            {insight.tier === "whale" ? "🐋" : insight.tier === "regular" ? "⭐" : "🌱"}
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {insight.tier.toUpperCase()} Player Badge
          </div>
        </div>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex justify-between">
            <span>Total Spend:</span>
            <span className="font-semibold">${insight.total_spend_30d.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Fraud Score:</span>
            <span className="font-semibold">{(insight.fraud_score * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Walrus Blob:</span>
            <span className="font-mono text-xs">{insight.walrus_blob_id.substring(0, 12)}...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
