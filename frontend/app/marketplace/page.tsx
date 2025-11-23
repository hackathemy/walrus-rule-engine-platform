"use client";

import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { useState, useEffect } from "react";
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
  const [selectedRuleset, setSelectedRuleset] = useState<Ruleset | null>(null);
  const [showExecuteModal, setShowExecuteModal] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);

  // Mock uploaded datasets (in production, fetch from user's Walrus uploads)
  const uploadedDatasets = [
    { blob_id: "walrus_001", name: "Player Data Q4 2024", size: "2.3 MB", uploaded: "2024-11-20" },
    { blob_id: "walrus_002", name: "Transaction History", size: "5.1 MB", uploaded: "2024-11-19" },
    { blob_id: "walrus_003", name: "Game Session Logs", size: "8.7 MB", uploaded: "2024-11-18" },
  ];

  // Sample configured rulesets + user-created ones from localStorage
  const defaultRulesets: Ruleset[] = [
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
  ];

  const [rulesets, setRulesets] = useState<Ruleset[]>(defaultRulesets);

  // Load custom rulesets from localStorage on mount
  useEffect(() => {
    try {
      const customRulesets = JSON.parse(localStorage.getItem('custom_rulesets') || '[]');
      // Combine default + custom, with custom ones appearing first
      setRulesets([...customRulesets, ...defaultRulesets]);
    } catch (error) {
      console.error('Error loading custom rulesets:', error);
      setRulesets(defaultRulesets);
    }
  }, []);

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Gaming": return "🎮";
      case "DeFi": return "💰";
      case "Social": return "🐦";
      case "IoT": return "📡";
      default: return "🔍";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="text-3xl">🐋</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Walrus Insight Engine
                </h1>
                <p className="text-sm text-gray-600">
                  AI Analytics Marketplace
                </p>
              </div>
            </Link>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Analytics Marketplace
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Browse configured analytics templates created by the community. All powered by secure, pre-built templates running on AWS Bedrock.
            </p>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">Instant execution</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">Verifiable results</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">Creator royalties</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Stats Bar */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="text-3xl font-bold text-blue-900 mb-1">
              {rulesets.length}
            </div>
            <div className="text-sm text-blue-700">Configured Templates</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
            <div className="text-3xl font-bold text-purple-900 mb-1">
              {rulesets.reduce((sum, r) => sum + r.totalUses, 0)}
            </div>
            <div className="text-sm text-purple-700">Total Executions</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-900 mb-1">
              4.7★
            </div>
            <div className="text-sm text-green-700">Average Rating</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
            <div className="text-3xl font-bold text-orange-900 mb-1">
              {categories.length - 1}
            </div>
            <div className="text-sm text-orange-700">Categories</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Filter by Category</h3>
          <div className="flex gap-3 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{getCategoryIcon(cat)}</span>
                {cat}
                {cat !== "All" && (
                  <span className="ml-2 text-xs opacity-75">
                    ({rulesets.filter(r => r.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Rulesets Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredRulesets.map((ruleset) => (
            <div
              key={ruleset.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-200 group"
            >
              {/* Card Header */}
              <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {ruleset.name}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getTemplateBadgeColor(ruleset.templateId)}`}>
                      {ruleset.templateId}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {ruleset.description}
                </p>

                {/* Stats Row */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-lg">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-semibold text-gray-900">{ruleset.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg">
                    <span className="text-blue-500">🔄</span>
                    <span className="font-semibold text-gray-900">{ruleset.totalUses}</span>
                    <span className="text-xs text-gray-600">uses</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-purple-50 px-3 py-1.5 rounded-lg">
                    <span className="text-purple-500">{getCategoryIcon(ruleset.category)}</span>
                    <span className="text-xs text-gray-600">{ruleset.category}</span>
                  </div>
                </div>

                {/* Creator */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <span className="text-gray-400">Created by</span>
                  <span className="font-semibold text-blue-600">{ruleset.creator}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 bg-white border-t-2 border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {ruleset.price} SUI
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      per execution
                    </div>
                  </div>

                  {account ? (
                    <button
                      onClick={() => {
                        setSelectedRuleset(ruleset);
                        setShowExecuteModal(true);
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      Execute
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-6 py-3 bg-gray-200 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
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
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No rulesets found
            </h3>
            <p className="text-gray-600 mb-6">
              Try selecting a different category
            </p>
            <button
              onClick={() => setSelectedCategory("All")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Templates
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-12 text-white shadow-2xl">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">Become a Template Creator</h3>
              <p className="text-blue-100 text-lg">
                Configure pre-built templates and earn SUI from every execution. No coding required—just smart configuration.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl mb-3">🎯</div>
                <h4 className="font-bold text-lg mb-2">Select Template</h4>
                <p className="text-blue-100 text-sm">Choose from 15+ pre-built analytics templates</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl mb-3">⚙️</div>
                <h4 className="font-bold text-lg mb-2">Configure</h4>
                <p className="text-blue-100 text-sm">Adjust parameters for your use case</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl mb-3">💰</div>
                <h4 className="font-bold text-lg mb-2">Earn Royalties</h4>
                <p className="text-blue-100 text-sm">Get paid every time someone uses your config</p>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/create"
                className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Configuring →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Execute Modal */}
      {showExecuteModal && selectedRuleset && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative">
            <button
              onClick={() => setShowExecuteModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Execute Analysis
            </h3>
            <p className="text-gray-600 mb-6">
              Run {selectedRuleset.name} on your data
            </p>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Selected Template</p>
                  <p className="font-bold text-gray-900">{selectedRuleset.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Cost</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedRuleset.price} SUI</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{selectedRuleset.description}</p>
            </div>

            <div className="space-y-3 mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Dataset to Analyze
              </label>

              {uploadedDatasets.length > 0 ? (
                <>
                  {uploadedDatasets.map((dataset) => (
                    <button
                      key={dataset.blob_id}
                      onClick={() => setSelectedDataset(dataset.blob_id)}
                      className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                        selectedDataset === dataset.blob_id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedDataset === dataset.blob_id
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedDataset === dataset.blob_id && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{dataset.name}</p>
                            <p className="text-sm text-gray-600">Uploaded: {dataset.uploaded}</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 font-medium">{dataset.size}</div>
                      </div>
                    </button>
                  ))}

                  <p className="text-center text-sm text-gray-600 mt-4">
                    Don&apos;t have the right data? <Link href="/upload" className="text-blue-600 hover:underline font-medium">Upload new dataset</Link>
                  </p>
                </>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <div className="text-4xl mb-3">📂</div>
                  <p className="text-gray-600 mb-4">No datasets uploaded yet</p>
                  <Link
                    href="/upload"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Upload Your First Dataset
                  </Link>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowExecuteModal(false);
                  setSelectedDataset(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!selectedDataset || !selectedRuleset) return;
                  setExecuting(true);

                  try {
                    // Get config_blob_id from selectedRuleset (if it was created via Create page)
                    const customRulesets = JSON.parse(localStorage.getItem('custom_rulesets') || '[]');
                    const customRuleset = customRulesets.find((r: any) => r.id === selectedRuleset.id);
                    const config_blob_id = customRuleset?.config_blob_id || 'mock_config_' + selectedRuleset.templateId;

                    // Call backend API
                    const response = await fetch('http://localhost:8000/api/execute', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        config_blob_id: config_blob_id,
                        data_blob_id: selectedDataset,
                        template_id: selectedRuleset.templateId,
                        price: selectedRuleset.price
                      })
                    });

                    const result = await response.json();

                    if (!result.success) {
                      throw new Error(result.error || 'Analysis failed');
                    }

                    // Display results
                    const analysis = result.analysis;
                    const resultText = `
✅ Analysis Complete!

Template: ${selectedRuleset.name}
Dataset: ${uploadedDatasets.find(d => d.blob_id === selectedDataset)?.name}
Cost: ${selectedRuleset.price} SUI

📊 Summary:
${analysis.summary}

🔍 Key Findings:
${analysis.findings.map((f: any) => `• ${f.type}: ${f.description} (${(f.confidence * 100).toFixed(0)}% confidence)`).join('\n')}

💡 Recommendations:
${analysis.recommendations.map((r: string) => `• ${r}`).join('\n')}

📈 Metadata:
• Analyzed Records: ${analysis.metadata.analyzed_records}
• Flagged Items: ${analysis.metadata.flagged_items}

🎉 Result NFT minted and analysis complete!
                    `.trim();

                    alert(resultText);

                    // Save to localStorage for history
                    const executionHistory = JSON.parse(localStorage.getItem('execution_history') || '[]');
                    executionHistory.unshift({
                      id: Date.now().toString(),
                      ruleset: selectedRuleset.name,
                      template: selectedRuleset.templateId,
                      dataset: uploadedDatasets.find(d => d.blob_id === selectedDataset)?.name,
                      price: selectedRuleset.price,
                      result: analysis,
                      timestamp: new Date().toISOString()
                    });
                    localStorage.setItem('execution_history', JSON.stringify(executionHistory));

                    setExecuting(false);
                    setShowExecuteModal(false);
                    setSelectedDataset(null);

                  } catch (error) {
                    console.error('Execute error:', error);
                    alert(`❌ Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    setExecuting(false);
                  }
                }}
                disabled={executing || !selectedDataset}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                  !selectedDataset
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {executing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Executing...
                  </span>
                ) : (
                  `Pay ${selectedRuleset.price} SUI & Execute`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
