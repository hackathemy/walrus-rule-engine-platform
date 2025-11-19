"use client";

import { useState } from "react";

interface InsightProps {
  insight: {
    player_id: string;
    analysis_date: string;
    total_spend_30d: number;
    tier: string;
    tier_reasoning: string;
    patterns: {
      frequency: string;
      consistency: string;
      peak_hours: number[];
    };
    fraud_score: number;
    fraud_flags: string[];
    recommendations: string[];
    player_value: {
      ltv_estimate: number;
      retention_risk: string;
      vip_eligible: boolean;
    };
    metadata: {
      model: string;
      analyzed_at: string;
      transaction_count: number;
    };
  };
}

export default function InsightCard({ insight }: InsightProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "whale":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "regular":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "casual":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getTierEmoji = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "whale":
        return "🐋";
      case "regular":
        return "⭐";
      case "casual":
        return "🌱";
      default:
        return "👤";
    }
  };

  const getRiskColor = (score: number) => {
    if (score > 0.7) return "text-red-600";
    if (score > 0.3) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-6">
      {/* Tier Badge */}
      <div className="flex items-center gap-4">
        <div className={`px-6 py-3 rounded-full border-2 ${getTierColor(insight.tier)} font-bold text-lg`}>
          {getTierEmoji(insight.tier)} {insight.tier.toUpperCase()} Player
        </div>
        <div className="text-gray-600 dark:text-gray-400">
          <div className="text-sm">Total Spend (30 days)</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            ${insight.total_spend_30d.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Tier Reasoning */}
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Why this tier?</strong> {insight.tier_reasoning}
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Spending Frequency
          </div>
          <div className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
            {insight.patterns.frequency}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Consistency
          </div>
          <div className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
            {insight.patterns.consistency}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Fraud Risk Score
          </div>
          <div className={`text-xl font-semibold ${getRiskColor(insight.fraud_score)}`}>
            {(insight.fraud_score * 100).toFixed(1)}%
            {insight.fraud_score < 0.3 ? " ✅" : insight.fraud_score < 0.7 ? " ⚠️" : " 🚨"}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            VIP Status
          </div>
          <div className="text-xl font-semibold text-gray-900 dark:text-white">
            {insight.player_value.vip_eligible ? "✅ Eligible" : "❌ Not Eligible"}
          </div>
        </div>
      </div>

      {/* Peak Hours */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Peak Playing Hours (UTC)
        </div>
        <div className="flex gap-2 flex-wrap">
          {insight.patterns.peak_hours.map((hour) => (
            <span
              key={hour}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
            >
              {hour}:00
            </span>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          💡 Personalized Recommendations
        </div>
        <ul className="space-y-2">
          {insight.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
              <span className="text-green-500 mt-1">✓</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Advanced Details Toggle */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-700 dark:text-gray-300 font-medium"
      >
        {showDetails ? "Hide" : "Show"} Advanced Details
      </button>

      {showDetails && (
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg space-y-4">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Estimated Lifetime Value
            </div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white">
              ${insight.player_value.ltv_estimate.toLocaleString()}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Retention Risk
            </div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
              {insight.player_value.retention_risk}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Total Transactions Analyzed
            </div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white">
              {insight.metadata.transaction_count}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              AI Model Used
            </div>
            <div className="text-sm font-mono text-gray-900 dark:text-white">
              {insight.metadata.model}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Analysis Date
            </div>
            <div className="text-sm text-gray-900 dark:text-white">
              {new Date(insight.metadata.analyzed_at).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
