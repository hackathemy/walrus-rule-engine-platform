"use client";

import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { useState } from "react";
import InsightCard from "@/components/InsightCard";
import MintButton from "@/components/MintButton";

export default function Home() {
  const account = useCurrentAccount();
  const [sampleInsight] = useState({
    player_id: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    analysis_date: "2025-11-16",
    total_spend_30d: 329.95,
    tier: "whale",
    tier_reasoning: "High spending pattern with consistent large transactions",
    patterns: {
      frequency: "daily",
      consistency: "high",
      peak_hours: [20, 21, 22]
    },
    fraud_score: 0.02,
    fraud_flags: [],
    recommendations: [
      "VIP program eligibility - unlock exclusive rewards",
      "Early access to new content based on spending tier",
      "Personalized offers for high-value items"
    ],
    player_value: {
      ltv_estimate: 3000,
      retention_risk: "low",
      vip_eligible: true
    },
    metadata: {
      model: "anthropic.claude-3-5-sonnet",
      analyzed_at: "2025-11-16T12:00:00Z",
      transaction_count: 25
    },
    walrus_blob_id: "sample_blob_123",
    content_hash: "abc123def456..."
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🐋</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Walrus Insight Engine
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI-Powered Game Analytics on Sui
                </p>
              </div>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your Game Economy Insights, On-Chain
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            AI analyzes your spending patterns • Walrus stores verifiable data •
            Sui NFTs prove your player status
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              AI Analysis
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              AWS Bedrock AI analyzes your behavior patterns, spending habits, and player tier
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">💾</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Walrus Storage
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Insights stored on decentralized Walrus network - verifiable and immutable
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              NFT Badges
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Mint dynamic NFTs that prove your player status - Whale, Regular, or Casual
            </p>
          </div>
        </div>

        {/* Main Content */}
        {account ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Your Player Insight
              </h3>

              <InsightCard insight={sampleInsight} />

              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Mint Your Insight NFT
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create an on-chain NFT badge that represents your player status.
                  This NFT references your analysis data stored on Walrus.
                </p>
                <MintButton insight={sampleInsight} />
              </div>

              {/* Verification Section */}
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  🔍 Verify Data Integrity
                </h4>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Walrus Blob ID:</strong> {sampleInsight.walrus_blob_id}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Content Hash:</strong> {sampleInsight.content_hash}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                    Anyone can verify this data by downloading the blob from Walrus
                    and comparing the SHA-256 hash.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12">
              <div className="text-6xl mb-6">👛</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Connect Your Wallet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Connect your Sui wallet to view your player insights and mint NFT badges
              </p>
              <ConnectButton />
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div>
              Built with 💙 by <a href="https://twitter.com/soaryong" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@soaryong</a>
            </div>
            <div className="flex gap-4">
              <span>Sui Walrus Hackathon 2025</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
