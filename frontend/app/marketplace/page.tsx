"use client";

import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { useState } from "react";
import Link from "next/link";

interface Ruleset {
  id: string;
  name: string;
  description: string;
  creator: string;
  category: string;
  ruleType: string;
  price: number;
  totalUses: number;
  rating: number;
}

export default function MarketplacePage() {
  const account = useCurrentAccount();

  // Sample rulesets (in production, fetch from Sui)
  const [rulesets] = useState<Ruleset[]>([
    {
      id: "1",
      name: "Whale Detector Pro",
      description: "AI-powered analysis to identify high-value players. Uses Claude 3.5 with advanced spending pattern recognition.",
      creator: "0x1234...5678",
      category: "Gaming",
      ruleType: "AI",
      price: 50,
      totalUses: 234,
      rating: 4.8,
    },
    {
      id: "2",
      name: "Fraud Alert System",
      description: "Detect suspicious payment patterns and potential chargebacks before they happen.",
      creator: "0x2234...6789",
      category: "Gaming",
      ruleType: "AI",
      price: 100,
      totalUses: 156,
      rating: 4.9,
    },
    {
      id: "3",
      name: "Churn Prediction",
      description: "Predict which players are likely to stop playing in the next 30 days.",
      creator: "0x3334...7890",
      category: "Gaming",
      ruleType: "AI",
      price: 75,
      totalUses: 89,
      rating: 4.6,
    },
    {
      id: "4",
      name: "DeFi Risk Scorer",
      description: "Analyze lending protocol risk using on-chain data and market conditions.",
      creator: "0x4434...8901",
      category: "DeFi",
      ruleType: "AI",
      price: 150,
      totalUses: 67,
      rating: 4.7,
    },
    {
      id: "5",
      name: "Token Holder Analysis",
      description: "Segment token holders by behavior: HODLers, traders, whales, and bots.",
      creator: "0x5534...9012",
      category: "DeFi",
      ruleType: "SQL",
      price: 80,
      totalUses: 123,
      rating: 4.5,
    },
    {
      id: "6",
      name: "Social Sentiment Analyzer",
      description: "Analyze social media sentiment for projects, tokens, or trends.",
      creator: "0x6634...0123",
      category: "Social",
      ruleType: "AI",
      price: 60,
      totalUses: 201,
      rating: 4.4,
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Gaming", "DeFi", "IoT", "Social"];

  const filteredRulesets = selectedCategory === "All"
    ? rulesets
    : rulesets.filter(r => r.category === selectedCategory);

  const getRuleTypeColor = (type: string) => {
    switch (type) {
      case "AI": return "bg-purple-100 text-purple-800";
      case "SQL": return "bg-blue-100 text-blue-800";
      case "Python": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="text-3xl">🐋</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Walrus RuleEngine
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Marketplace
                </p>
              </div>
            </Link>
            <ConnectButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Ruleset Marketplace
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Browse and purchase AI-powered analysis rulesets created by the community
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Rulesets Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRulesets.map((ruleset) => (
            <div
              key={ruleset.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {ruleset.name}
                  </h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRuleTypeColor(ruleset.ruleType)}`}>
                    {ruleset.ruleType}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {ruleset.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <span>⭐</span>
                    <span>{ruleset.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🔄</span>
                    <span>{ruleset.totalUses} uses</span>
                  </div>
                </div>

                {/* Creator */}
                <div className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                  by {ruleset.creator}
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {ruleset.price} SUI
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      + 5 SUI per execution
                    </div>
                  </div>

                  {account ? (
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all">
                      Purchase
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-500 rounded-lg font-medium cursor-not-allowed"
                    >
                      Connect Wallet
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRulesets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No rulesets found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try selecting a different category
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Create Your Own Ruleset</h3>
              <p className="text-blue-100">
                Build analysis tools and earn passive income from every use
              </p>
            </div>
            <Link
              href="/create"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors"
            >
              Start Creating
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
