"use client";

import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { useState } from "react";
import Link from "next/link";

export default function CreatePage() {
  const account = useCurrentAccount();
  const [step, setStep] = useState(1);
  const [ruleset, setRuleset] = useState({
    name: "",
    description: "",
    category: "gaming",
    ruleType: "ai" as "ai" | "sql" | "python",
    price: 50,
    content: "",
  });
  const [testData, setTestData] = useState("");
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [minting, setMinting] = useState(false);
  const [mintedNFT, setMintedNFT] = useState<any>(null);

  const ruleTemplates = {
    ai: {
      whale: `Analyze this player spending data and identify whales (high-value players).

Return JSON with:
- whale_count: number of whales found
- whale_ids: array of player IDs
- avg_whale_spend: average spending amount
- recommendations: suggestions for engagement`,

      fraud: `Analyze payment patterns for fraud indicators.

Return JSON with:
- fraud_score: 0-100 risk score
- flags: array of suspicious patterns
- high_risk_users: array of user IDs
- recommended_actions: what to do next`,

      churn: `Predict which players are likely to stop playing in next 30 days.

Return JSON with:
- churn_risk_count: number at risk
- at_risk_players: array of player IDs with risk scores
- key_factors: main reasons for churn
- retention_strategies: recommended actions`,
    }
  };

  const handleTest = async () => {
    if (!testData || !ruleset.content) return;

    setTesting(true);
    setTestResult(null);

    // Mock AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock result based on rule type
    const mockResult = {
      success: true,
      analysis: {
        whale_count: 3,
        whale_ids: ["player_001", "player_005", "player_012"],
        avg_whale_spend: 1250.50,
        recommendations: [
          "Create VIP tier for top 3 spenders",
          "Offer exclusive items to maintain engagement",
          "Personalized communication strategy"
        ]
      },
      execution_time: "1.2s",
      timestamp: new Date().toISOString(),
    };

    setTestResult(mockResult);
    setTesting(false);
  };

  const handleMint = async () => {
    if (!account) return;

    setMinting(true);

    // Mock NFT minting
    await new Promise(resolve => setTimeout(resolve, 2500));

    const mockNFT = {
      id: `ruleset_${Date.now()}`,
      tx_digest: `0x${Array.from({length: 64}, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`,
      blob_id: `walrus_rule_${Math.random().toString(36).substr(2, 9)}`,
      ...ruleset,
    };

    setMintedNFT(mockNFT);
    setMinting(false);
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
                  Create Ruleset
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/marketplace" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Marketplace
              </Link>
              <Link href="/upload" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Upload Data
              </Link>
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create Your Ruleset
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Build AI-powered analysis tools and earn passive income
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= s ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-700 text-gray-600"
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-1 mx-2 ${
                  step > s ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"
                }`} />
              )}
            </div>
          ))}
        </div>

        {!mintedNFT ? (
          <>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Step 1: Basic Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ruleset Name *
                  </label>
                  <input
                    type="text"
                    value={ruleset.name}
                    onChange={(e) => setRuleset({...ruleset, name: e.target.value})}
                    placeholder="e.g., Whale Detector Pro"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={ruleset.description}
                    onChange={(e) => setRuleset({...ruleset, description: e.target.value})}
                    placeholder="Describe what your ruleset does..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={ruleset.category}
                      onChange={(e) => setRuleset({...ruleset, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="gaming">Gaming</option>
                      <option value="defi">DeFi</option>
                      <option value="iot">IoT</option>
                      <option value="social">Social Media</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type
                    </label>
                    <select
                      value={ruleset.ruleType}
                      onChange={(e) => setRuleset({...ruleset, ruleType: e.target.value as any})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="ai">AI Prompt</option>
                      <option value="sql">SQL Query</option>
                      <option value="python">Python Script</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price (SUI)
                  </label>
                  <input
                    type="number"
                    value={ruleset.price}
                    onChange={(e) => setRuleset({...ruleset, price: parseInt(e.target.value)})}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    You'll earn 80% ({(ruleset.price * 0.8).toFixed(0)} SUI) per sale
                  </p>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!ruleset.name || !ruleset.description}
                  className={`w-full py-3 rounded-lg font-bold transition-all ${
                    !ruleset.name || !ruleset.description
                      ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  Next: Write Rule →
                </button>
              </div>
            )}

            {/* Step 2: Write Rule */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Step 2: Write Your {ruleset.ruleType.toUpperCase()} Rule
                  </h3>

                  {/* Templates */}
                  {ruleset.ruleType === "ai" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Quick Templates
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setRuleset({...ruleset, content: ruleTemplates.ai.whale})}
                          className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-sm"
                        >
                          Whale Detector
                        </button>
                        <button
                          onClick={() => setRuleset({...ruleset, content: ruleTemplates.ai.fraud})}
                          className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded text-sm"
                        >
                          Fraud Detection
                        </button>
                        <button
                          onClick={() => setRuleset({...ruleset, content: ruleTemplates.ai.churn})}
                          className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-sm"
                        >
                          Churn Prediction
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {ruleset.ruleType === "ai" && "AI Prompt"}
                      {ruleset.ruleType === "sql" && "SQL Query"}
                      {ruleset.ruleType === "python" && "Python Code"}
                    </label>
                    <textarea
                      value={ruleset.content}
                      onChange={(e) => setRuleset({...ruleset, content: e.target.value})}
                      placeholder={
                        ruleset.ruleType === "ai"
                          ? "Analyze this data and return JSON with..."
                          : ruleset.ruleType === "sql"
                          ? "SELECT * FROM data WHERE..."
                          : "def analyze(df):\n    # Your code here\n    return results"
                      }
                      rows={12}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!ruleset.content}
                    className={`flex-1 py-3 rounded-lg font-bold ${
                      !ruleset.content
                        ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    Next: Test & Mint →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Test & Mint */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Step 3: Test Your Ruleset
                  </h3>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sample Data (CSV or JSON)
                    </label>
                    <textarea
                      value={testData}
                      onChange={(e) => setTestData(e.target.value)}
                      placeholder="player_id,spend,sessions&#10;1,100,50&#10;2,500,100&#10;3,1000,200"
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                    />
                  </div>

                  <button
                    onClick={handleTest}
                    disabled={testing || !testData}
                    className={`w-full py-3 rounded-lg font-bold mb-4 ${
                      testing || !testData
                        ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    {testing ? "Testing..." : "🧪 Test Ruleset"}
                  </button>

                  {testResult && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <p className="font-bold text-green-800 dark:text-green-300 mb-2">
                        ✅ Test Successful!
                      </p>
                      <pre className="text-sm text-green-700 dark:text-green-400 overflow-auto">
                        {JSON.stringify(testResult.analysis, null, 2)}
                      </pre>
                      <p className="text-xs text-green-600 dark:text-green-500 mt-2">
                        Execution time: {testResult.execution_time}
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                  <h4 className="text-xl font-bold mb-2">Ready to Mint?</h4>
                  <p className="text-blue-100 mb-4">
                    Mint your ruleset as an NFT and start earning {(ruleset.price * 0.8).toFixed(0)} SUI per sale
                  </p>
                  <div className="flex items-center gap-2 text-sm mb-4">
                    <span>✓ Stored on Walrus</span>
                    <span>✓ Tradeable NFT</span>
                    <span>✓ 80% revenue share</span>
                  </div>
                  <button
                    onClick={handleMint}
                    disabled={minting || !testResult || !account}
                    className={`w-full py-3 rounded-lg font-bold ${
                      minting || !testResult || !account
                        ? "bg-white/50 cursor-not-allowed"
                        : "bg-white text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {minting ? "Minting..." : !account ? "Connect Wallet to Mint" : "🎨 Mint Ruleset NFT"}
                  </button>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    ← Back
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Minting Success */
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Ruleset NFT Minted!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your ruleset is now live on the marketplace
            </p>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-6 text-left">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Transaction Digest</p>
              <p className="font-mono text-xs text-gray-900 dark:text-white break-all">
                {mintedNFT.tx_digest}
              </p>
            </div>

            <div className="flex gap-4">
              <Link
                href="/marketplace"
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                View in Marketplace
              </Link>
              <button
                onClick={() => {
                  setStep(1);
                  setMintedNFT(null);
                  setRuleset({ name: "", description: "", category: "gaming", ruleType: "ai", price: 50, content: "" });
                  setTestData("");
                  setTestResult(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Create Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
