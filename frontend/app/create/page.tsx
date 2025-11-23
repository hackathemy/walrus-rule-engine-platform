"use client";

import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { useState } from "react";
import Link from "next/link";

// Pre-built template definitions
const TEMPLATES = {
  game_abuse_detection: {
    id: "game_abuse_detection",
    name: "Gaming Abuse Detection",
    category: "Gaming",
    description: "Detect multi-accounting, refund fraud, and bot behavior in games",
    icon: "🎮",
    defaultConfig: {
      multi_account_threshold: 3,
      refund_velocity_limit: 5,
      velocity_window_hours: 24,
      min_playtime_before_refund: 2
    },
    parameters: [
      { key: "multi_account_threshold", label: "Multi-Account Threshold", type: "number", description: "Flag if > N accounts from same IP" },
      { key: "refund_velocity_limit", label: "Refund Velocity Limit", type: "number", description: "Flag if > N refunds in window" },
      { key: "velocity_window_hours", label: "Velocity Window (hours)", type: "number", description: "Time window for velocity checks" },
      { key: "min_playtime_before_refund", label: "Min Playtime (hours)", type: "number", description: "Minimum playtime before refund" }
    ]
  },
  game_anti_cheat: {
    id: "game_anti_cheat",
    name: "Game Anti-Cheat",
    category: "Gaming",
    description: "Detect speed hacks, aim bots, and impossible scores",
    icon: "🛡️",
    defaultConfig: {
      kd_ratio_max: 8.0,
      score_velocity_limit: 1500,
      impossible_movement_threshold: 0.92,
      headshot_percentage_max: 75
    },
    parameters: [
      { key: "kd_ratio_max", label: "Max K/D Ratio", type: "number", description: "Flag if K/D ratio exceeds this" },
      { key: "score_velocity_limit", label: "Score Velocity Limit", type: "number", description: "Max points per second" },
      { key: "impossible_movement_threshold", label: "Movement Threshold", type: "number", description: "Confidence for impossible movement (0-1)" },
      { key: "headshot_percentage_max", label: "Max Headshot %", type: "number", description: "Flag if headshot % exceeds this" }
    ]
  },
  defi_risk_analyzer: {
    id: "defi_risk_analyzer",
    name: "DeFi Risk Analyzer",
    category: "DeFi",
    description: "Assess lending risk and liquidity pool health",
    icon: "💰",
    defaultConfig: {
      collateral_ratio_min: 150,
      liquidity_threshold: 10000,
      volatility_max: 15,
      whale_movement_threshold: 1000000
    },
    parameters: [
      { key: "collateral_ratio_min", label: "Min Collateral Ratio (%)", type: "number", description: "Minimum safe collateral ratio" },
      { key: "liquidity_threshold", label: "Liquidity Threshold", type: "number", description: "Minimum pool liquidity" },
      { key: "volatility_max", label: "Max Volatility (%)", type: "number", description: "Alert if volatility exceeds this" },
      { key: "whale_movement_threshold", label: "Whale Threshold (USD)", type: "number", description: "Monitor movements above this value" }
    ]
  },
  token_holder_segmentation: {
    id: "token_holder_segmentation",
    name: "Token Holder Segmentation",
    category: "DeFi",
    description: "Segment holders into HODLers, traders, and potential wash traders",
    icon: "📊",
    defaultConfig: {
      holding_period_days: 30,
      trade_frequency_threshold: 10,
      wash_trading_similarity: 0.85
    },
    parameters: [
      { key: "holding_period_days", label: "HODLer Period (days)", type: "number", description: "Days to qualify as HODLer" },
      { key: "trade_frequency_threshold", label: "Trader Frequency", type: "number", description: "Trades/month to qualify as trader" },
      { key: "wash_trading_similarity", label: "Wash Trading Score", type: "number", description: "Similarity threshold (0-1)" }
    ]
  },
  social_sentiment_tracker: {
    id: "social_sentiment_tracker",
    name: "Social Sentiment Tracker",
    category: "Social",
    description: "Track real-time sentiment and trending topics",
    icon: "🐦",
    defaultConfig: {
      sentiment_window_hours: 24,
      min_mentions: 100,
      trending_threshold: 0.8
    },
    parameters: [
      { key: "sentiment_window_hours", label: "Sentiment Window (hours)", type: "number", description: "Time window for sentiment analysis" },
      { key: "min_mentions", label: "Min Mentions", type: "number", description: "Minimum mentions to include" },
      { key: "trending_threshold", label: "Trending Threshold", type: "number", description: "Score to qualify as trending (0-1)" }
    ]
  },
  iot_device_health: {
    id: "iot_device_health",
    name: "IoT Device Health Monitor",
    category: "IoT",
    description: "Predictive maintenance and anomaly detection for IoT devices",
    icon: "📡",
    defaultConfig: {
      uptime_threshold: 95,
      anomaly_sensitivity: 0.85,
      maintenance_prediction_days: 7
    },
    parameters: [
      { key: "uptime_threshold", label: "Min Uptime (%)", type: "number", description: "Alert if uptime below this" },
      { key: "anomaly_sensitivity", label: "Anomaly Sensitivity", type: "number", description: "Detection sensitivity (0-1)" },
      { key: "maintenance_prediction_days", label: "Prediction Horizon (days)", type: "number", description: "Days ahead to predict" }
    ]
  }
};

export default function CreatePage() {
  const account = useCurrentAccount();
  const [step, setStep] = useState(1); // 1: Select Template, 2: Configure, 3: Upload & Mint
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [rulesetName, setRulesetName] = useState("");
  const [rulesetDescription, setRulesetDescription] = useState("");
  const [price, setPrice] = useState(2.5);
  const [config, setConfig] = useState<any>({});
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const template = selectedTemplate ? TEMPLATES[selectedTemplate as keyof typeof TEMPLATES] : null;

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const tmpl = TEMPLATES[templateId as keyof typeof TEMPLATES];
    setConfig(tmpl.defaultConfig);
    setRulesetName(`${tmpl.name} Pro`);
    setRulesetDescription(`Optimized ${tmpl.name.toLowerCase()} configuration`);
    setStep(2);
  };

  const handleConfigChange = (key: string, value: any) => {
    setConfig({ ...config, [key]: value });
  };

  const handleUploadAndMint = async () => {
    if (!account || !template) return;

    setUploading(true);

    try {
      // Create config JSON
      const configData = {
        template_id: selectedTemplate,
        name: rulesetName,
        description: rulesetDescription,
        config: config,
        price_per_execution: price,
        creator: account.address
      };

      // Convert to JSON blob
      const configBlob = new Blob([JSON.stringify(configData, null, 2)], {
        type: 'application/json'
      });

      // Upload to Walrus via backend
      const formData = new FormData();
      formData.append('file', configBlob, `config_${Date.now()}.json`);
      formData.append('epochs', '5');

      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      // Create ruleset object
      const newRuleset = {
        id: Date.now().toString(),
        name: `${template.icon} ${rulesetName}`,
        description: rulesetDescription,
        creator: `@${account.address.slice(0, 6)}`,
        category: template.category,
        templateId: selectedTemplate,
        price: price,
        totalUses: 0,
        rating: 0,
        config_blob_id: result.blob_id,
        created_at: new Date().toISOString()
      };

      // Save to localStorage
      const existingRulesets = JSON.parse(localStorage.getItem('custom_rulesets') || '[]');
      existingRulesets.push(newRuleset);
      localStorage.setItem('custom_rulesets', JSON.stringify(existingRulesets));

      // Set upload result
      const uploadResult = {
        config_blob_id: result.blob_id,
        ruleset_nft_id: `0x${newRuleset.id}`,
        marketplace_url: `/marketplace`,
        estimated_earnings: `${(price * 0.83 * 10).toFixed(2)} SUI (if 10 executions)`,
        aggregator_url: result.aggregator_url
      };

      setUploadResult(uploadResult);
      setStep(3);
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="text-3xl group-hover:scale-110 transition-transform">🐋</div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Walrus Insight Engine</h1>
              <p className="text-xs text-gray-600">Configure & Earn</p>
            </div>
          </Link>
          <ConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Progress Steps */}
        <div className="mb-12 flex items-center justify-center gap-4">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="font-semibold">Select Template</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="font-semibold">Configure</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span className="font-semibold">Upload & Mint</span>
          </div>
        </div>

        {/* Step 1: Template Selection */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose a Template</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Select a pre-built analytics template to configure. You'll customize parameters, not write code.
              </p>
            </div>

            {/* Gaming Templates */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                🎮 Gaming Templates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.values(TEMPLATES).filter(t => t.category === "Gaming").map(tmpl => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleTemplateSelect(tmpl.id)}
                    className="group relative bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all text-left"
                  >
                    <div className="text-5xl mb-4">{tmpl.icon}</div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">{tmpl.name}</h4>
                    <p className="text-gray-600 mb-4">{tmpl.description}</p>
                    <div className="text-sm text-gray-500">
                      {tmpl.parameters.length} configurable parameters
                    </div>
                    <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-blue-600 font-semibold">Select →</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* DeFi Templates */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                💰 DeFi Templates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.values(TEMPLATES).filter(t => t.category === "DeFi").map(tmpl => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleTemplateSelect(tmpl.id)}
                    className="group relative bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all text-left"
                  >
                    <div className="text-5xl mb-4">{tmpl.icon}</div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">{tmpl.name}</h4>
                    <p className="text-gray-600 mb-4">{tmpl.description}</p>
                    <div className="text-sm text-gray-500">
                      {tmpl.parameters.length} configurable parameters
                    </div>
                    <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-blue-600 font-semibold">Select →</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Social & IoT Templates */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                🌐 Social & IoT Templates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.values(TEMPLATES).filter(t => t.category === "Social" || t.category === "IoT").map(tmpl => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleTemplateSelect(tmpl.id)}
                    className="group relative bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all text-left"
                  >
                    <div className="text-5xl mb-4">{tmpl.icon}</div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">{tmpl.name}</h4>
                    <p className="text-gray-600 mb-4">{tmpl.description}</p>
                    <div className="text-sm text-gray-500">
                      {tmpl.parameters.length} configurable parameters
                    </div>
                    <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-blue-600 font-semibold">Select →</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Configure Parameters */}
        {step === 2 && template && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">{template.icon}</div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">{template.name}</h2>
              <p className="text-xl text-gray-600">{template.description}</p>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg space-y-6">
              {/* Ruleset Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ruleset Name
                </label>
                <input
                  type="text"
                  value={rulesetName}
                  onChange={(e) => setRulesetName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 placeholder-gray-400"
                  placeholder="My Custom Configuration"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={rulesetDescription}
                  onChange={(e) => setRulesetDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 placeholder-gray-400"
                  placeholder="Describe your configuration..."
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price per Execution (SUI)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  step="0.1"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 placeholder-gray-400"
                />
                <p className="text-sm text-gray-600 mt-2">
                  You'll earn 83% ({(price * 0.83).toFixed(2)} SUI) per execution
                </p>
              </div>

              {/* Configuration Parameters */}
              <div className="border-t-2 border-gray-100 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Configuration Parameters</h3>
                <div className="space-y-4">
                  {template.parameters.map(param => (
                    <div key={param.key} className="bg-gray-50 rounded-xl p-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {param.label}
                      </label>
                      <p className="text-xs text-gray-600 mb-2">{param.description}</p>
                      <input
                        type={param.type}
                        value={config[param.key]}
                        onChange={(e) => handleConfigChange(param.key, param.type === 'number' ? parseFloat(e.target.value) : e.target.value)}
                        step={param.type === 'number' ? "0.01" : undefined}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 placeholder-gray-400 bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* JSON Preview */}
              <div className="border-t-2 border-gray-100 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Configuration JSON</h3>
                <pre className="bg-gray-900 text-green-400 p-6 rounded-xl overflow-auto text-sm">
                  {JSON.stringify(config, null, 2)}
                </pre>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={handleUploadAndMint}
                  disabled={!account}
                  className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all ${
                    account
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {account ? 'Upload & Mint NFT →' : 'Connect Wallet First'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Upload Result */}
        {step === 3 && uploadResult && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-12 border-2 border-green-500 shadow-2xl text-center space-y-8">
              <div className="text-8xl">✅</div>
              <h2 className="text-4xl font-bold text-gray-900">Ruleset Created!</h2>

              <div className="space-y-4 text-left bg-gray-50 rounded-xl p-6">
                <div>
                  <span className="font-semibold text-gray-700">Config Blob ID:</span>
                  <p className="text-blue-600 font-mono text-sm mt-1">{uploadResult.config_blob_id}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Ruleset NFT ID:</span>
                  <p className="text-purple-600 font-mono text-sm mt-1 break-all">{uploadResult.ruleset_nft_id}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Price:</span>
                  <p className="text-gray-900 font-bold mt-1">{price} SUI per execution</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Your Earnings:</span>
                  <p className="text-green-600 font-bold mt-1">83% = {(price * 0.83).toFixed(2)} SUI per use</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Estimated Revenue:</span>
                  <p className="text-gray-600 mt-1">{uploadResult.estimated_earnings}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/marketplace"
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
                >
                  View in Marketplace
                </Link>
                <button
                  onClick={() => {
                    setStep(1);
                    setSelectedTemplate(null);
                    setUploadResult(null);
                  }}
                  className="flex-1 px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  Create Another
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
