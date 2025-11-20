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
  templateId: string;  // Pre-built template being configured
  price: number;
  totalUses: number;
  rating: number;
}

export default function MarketplacePage() {
  const account = useCurrentAccount();

  // Sample configured rulesets (in production, fetch from Sui)
  const [rulesets] = useState<Ruleset[]>([
    {
      id: "1",
      name: "🛡️ FPS Anti-Cheat for Battle Royale",
      description: "Configured game_abuse_detection template optimized for fast-paced FPS games. Detects multi-accounting, bot farms, and refund fraud.",
      creator: "@alice",
      category: "Gaming",
      templateId: "game_abuse_detection",
      price: 2.5,
      totalUses: 67,
      rating: 4.9,
    },
    {
      id: "2",
      name: "💰 Lending Protocol Risk Monitor",
      description: "Configured defi_risk_analyzer template for lending protocols. Monitors collateral ratios and liquidity pool health.",
      creator: "@bob",
      category: "DeFi",
      templateId: "defi_risk_analyzer",
      price: 3,
      totalUses: 156,
      rating: 4.8,
    },
    {
      id: "3",
      name: "📊 Whale Tracker for DEX",
      description: "Configured token_holder_segmentation template. Identifies HODLers, traders, whales, and wash trading patterns.",
      creator: "@carol",
      category: "DeFi",
      templateId: "token_holder_segmentation",
      price: 2,
      totalUses: 89,
      rating: 4.7,
    },
    {
      id: "4",
      name: "🐦 Crypto Project Sentiment",
      description: "Configured social_sentiment_tracker template for real-time crypto sentiment analysis and trending topic detection.",
      creator: "@dave",
      category: "Social",
      templateId: "social_sentiment_tracker",
      price: 1.5,
      totalUses: 234,
      rating: 4.6,
    },
    {
      id: "5",
      name: "📡 Factory Floor IoT Monitor",
      description: "Configured iot_device_health template for manufacturing. Predictive maintenance and anomaly detection for production equipment.",
      creator: "@eve",
      category: "IoT",
      templateId: "iot_device_health",
      price: 1.8,
      totalUses: 45,
      rating: 4.5,
    },
    {
      id: "6",
      name: "⚔️ MOBA Anti-Cheat System",
      description: "Configured game_anti_cheat template for MOBA games. Detects speed hacks, aim bots, and impossible movement patterns.",
      creator: "@frank",
      category: "Gaming",
      templateId: "game_anti_cheat",
      price: 2,
      totalUses: 123,
      rating: 4.8,
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Gaming", "DeFi", "Social", "IoT"];

  const filteredRulesets = selectedCategory === "All"
    ? rulesets
    : rulesets.filter(r => r.category === selectedCategory);

  const getTemplateBadgeColor = (templateId: string) => {
    if (templateId.startsWith("game")) return "bg-purple-100 text-purple-800";
    if (templateId.startsWith("defi")) return "bg-blue-100 text-blue-800";
    if (templateId.startsWith("social")) return "bg-green-100 text-green-800";
    if (templateId.startsWith("iot")) return "bg-orange-100 text-orange-800";
    return "bg-gray-100 text-gray-800";
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
                  Walrus Insight Engine
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI Analytics Marketplace
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
            Analytics Marketplace
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Browse configured analytics templates created by the community • All powered by secure, pre-built templates
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
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getTemplateBadgeColor(ruleset.templateId)}`}>
                    {ruleset.templateId}
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
                      per execution
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
              <h3 className="text-2xl font-bold mb-2">Configure Your Own Template</h3>
              <p className="text-blue-100">
                Select a pre-built template, configure parameters, and earn from every execution
              </p>
            </div>
            <Link
              href="/create"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors"
            >
              Start Configuring
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
