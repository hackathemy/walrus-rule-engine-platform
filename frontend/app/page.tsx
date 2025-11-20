"use client";

import { ConnectButton } from "@mysten/dapp-kit";
import Link from "next/link";

export default function Home() {

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
                  AI Analytics Marketplace
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
            Two-Sided AI Analytics Marketplace
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Creators build & sell analytics rulesets • Buyers run them on their data •
            All results verified on Walrus + Sui
          </p>
        </div>

        {/* Feature Cards - 2 Sides */}
        <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-8 rounded-xl shadow-lg border-2 border-purple-200 dark:border-purple-800">
            <div className="text-4xl mb-4">🛠️</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              Ruleset Creators
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Build AI-powered analytics rulesets and earn SUI every time someone uses them.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-purple-600 dark:text-purple-400">→</span>
                Select pre-built template (Gaming, DeFi, IoT, Social)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-600 dark:text-purple-400">→</span>
                Configure parameters (thresholds, indicators)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-600 dark:text-purple-400">→</span>
                Upload config to Walrus, set price, earn per use
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-xl shadow-lg border-2 border-blue-200 dark:border-blue-800">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              Ruleset Users
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Browse rulesets, run analytics on your data, and get verifiable results.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">→</span>
                Browse marketplace (Gaming, DeFi, Social, IoT)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">→</span>
                Upload your data, select rulesets
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">→</span>
                Pay & execute, get results on Walrus
              </li>
            </ul>
          </div>
        </div>

        {/* Main CTAs - Clear Two-Sided Actions */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Creator Side */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl shadow-2xl p-10 text-white">
            <div className="text-5xl mb-4">🛠️</div>
            <h3 className="text-3xl font-bold mb-4">
              Configure & Earn
            </h3>
            <p className="text-lg mb-6 opacity-95">
              Pick a secure template, tune parameters for your use case.
              Configure once, earn forever.
            </p>
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold mb-2">Example Earnings:</p>
              <p className="text-2xl font-bold">2.5 SUI × 67 runs = 167.5 SUI</p>
              <p className="text-xs opacity-80 mt-1">Game Abuse Prevention ruleset</p>
            </div>
            <Link
              href="/create"
              className="inline-block w-full text-center px-6 py-4 bg-white text-purple-700 rounded-lg font-bold text-lg hover:bg-purple-50 transition-colors shadow-lg"
            >
              Start Creating →
            </Link>
          </div>

          {/* User Side */}
          <div className="bg-gradient-to-br from-blue-600 to-cyan-700 rounded-xl shadow-2xl p-10 text-white">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-3xl font-bold mb-4">
              Browse & Execute
            </h3>
            <p className="text-lg mb-6 opacity-95">
              Run professional analytics on your data without building
              in-house teams.
            </p>
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold mb-2">Available Categories:</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Gaming</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs">DeFi</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Social</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs">IoT</span>
              </div>
            </div>
            <Link
              href="/marketplace"
              className="inline-block w-full text-center px-6 py-4 bg-white text-blue-700 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              Explore Marketplace →
            </Link>
          </div>
        </div>

        {/* How It Works - Simplified 2-Step Flow */}
        <div className="max-w-5xl mx-auto mt-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            How The Marketplace Works
          </h3>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Creator Flow */}
            <div className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-8 border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl">🛠️</div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Creator Flow
                </h4>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Select Template</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Choose from pre-built, audited templates</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Configure Parameters</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tune thresholds and indicators (JSON)</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Upload & List</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Config to Walrus, NFT on Sui, set price</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">💰</div>
                  <div>
                    <p className="font-semibold text-green-600 dark:text-green-400">Earn Per Execution</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Passive income every time it's used</p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Flow */}
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-8 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl">📊</div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                  User Flow
                </h4>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Browse Marketplace</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Filter by category, read reviews</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Upload Your Data</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">CSV/JSON to Walrus (private or public)</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Select & Execute</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pay creator, run on Bedrock AI</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">✓</div>
                  <div>
                    <p className="font-semibold text-green-600 dark:text-green-400">Get Verifiable Results</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Results on Walrus, NFT receipt on Sui</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="mt-12 text-center bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-8">
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              ⚡ Powered by Walrus + Sui + AWS Bedrock
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Immutable storage • On-chain verification • Enterprise AI
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div>
              Built with 💙 by <a href="https://twitter.com/snorlax00x" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@snorlax00x</a>
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
