"use client";

import { ConnectButton } from "@mysten/dapp-kit";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🐋</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Walrus Insight Engine
                </h1>
                <p className="text-sm text-gray-600">
                  AI Analytics Marketplace
                </p>
              </div>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-semibold">
              ⚡ Multi-Provider AI · Walrus Storage · Sui Blockchain
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Decentralized AI Analytics<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Template Marketplace
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create analytics templates once, earn forever. Execute professional analytics without building teams. All results cryptographically verified on-chain.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/create"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all hover:-translate-y-1"
              >
                Start Creating →
              </Link>
              <Link
                href="/marketplace"
                className="px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all"
              >
                Explore Marketplace
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-blue-600">6+</div>
                <div className="text-sm text-gray-600 mt-1">Pre-Built Templates</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">100%</div>
                <div className="text-sm text-gray-600 mt-1">Verifiable Results</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-600">3</div>
                <div className="text-sm text-gray-600 mt-1">AI Providers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
              🚀 Production-Ready Features
            </h3>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Fully working implementation, not a prototype
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Real Walrus Integration */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-100">
                <div className="text-3xl mb-3">🌊</div>
                <h4 className="font-bold text-gray-900 mb-2">Real Walrus Storage</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Actual config & data uploads to Walrus Testnet. Verifiable blob IDs. Download via Aggregator URL.
                </p>
                <div className="text-xs text-blue-700 font-semibold">✅ Working Now</div>
              </div>

              {/* Multi-Provider AI */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-100">
                <div className="text-3xl mb-3">🤖</div>
                <h4 className="font-bold text-gray-900 mb-2">Multi-Provider AI</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Auto-detection: Claude 3 Haiku (Anthropic), Claude 3.5 Sonnet (Bedrock), or Mock AI for demos.
                </p>
                <div className="text-xs text-purple-700 font-semibold">✅ Working Now</div>
              </div>

              {/* Instant Results */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-100">
                <div className="text-3xl mb-3">⚡</div>
                <h4 className="font-bold text-gray-900 mb-2">5-15s Analysis</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Real-time AI analysis with structured JSON results. Summary, findings, recommendations, metadata.
                </p>
                <div className="text-xs text-green-700 font-semibold">✅ Working Now</div>
              </div>

              {/* localStorage Integration */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-100">
                <div className="text-3xl mb-3">💾</div>
                <h4 className="font-bold text-gray-900 mb-2">Client-Side Storage</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Created templates instantly appear in marketplace. Execution history persists locally.
                </p>
                <div className="text-xs text-orange-700 font-semibold">✅ Working Now</div>
              </div>

              {/* Template Security */}
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border-2 border-red-100">
                <div className="text-3xl mb-3">🛡️</div>
                <h4 className="font-bold text-gray-900 mb-2">Secure Templates</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Pre-built, audited templates only. Users configure JSON parameters. No arbitrary code execution.
                </p>
                <div className="text-xs text-red-700 font-semibold">✅ Working Now</div>
              </div>

              {/* Mock AI */}
              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-6 border-2 border-indigo-100">
                <div className="text-3xl mb-3">🎭</div>
                <h4 className="font-bold text-gray-900 mb-2">Zero-Cost Demo</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Mock AI auto-activates when no API keys configured. Instant results, $0 cost, production-like UX.
                </p>
                <div className="text-xs text-indigo-700 font-semibold">✅ Working Now</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
              How It Works
            </h3>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              3-step process for both creators and users
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Creator Flow */}
              <div>
                <div className="text-center mb-6">
                  <div className="inline-block px-4 py-2 bg-purple-100 rounded-full text-purple-700 font-bold mb-2">
                    👷 Creator Flow
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 mb-1">Pick Template</div>
                      <div className="text-sm text-gray-600">
                        Choose from 6 pre-built templates (Gaming, DeFi, Social, IoT)
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 mb-1">Configure Parameters</div>
                      <div className="text-sm text-gray-600">
                        Tune thresholds via JSON. Set execution price in SUI.
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 mb-1">Upload & Earn</div>
                      <div className="text-sm text-gray-600">
                        Upload config to Walrus → Get blob_id → Instant marketplace listing
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-purple-50 rounded-lg p-4">
                  <div className="text-sm text-purple-800 font-semibold mb-2">💰 Revenue Share</div>
                  <div className="text-2xl font-bold text-purple-600">83% to Creator</div>
                  <div className="text-sm text-gray-600">17% platform fee covers AI & infrastructure</div>
                </div>
              </div>

              {/* User Flow */}
              <div>
                <div className="text-center mb-6">
                  <div className="inline-block px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-bold mb-2">
                    👤 User Flow
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 mb-1">Upload Data</div>
                      <div className="text-sm text-gray-600">
                        CSV/JSON → Real Walrus upload → Get blob_id
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 mb-1">Browse Marketplace</div>
                      <div className="text-sm text-gray-600">
                        Select configured template. Review parameters & pricing.
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 mb-1">Execute & Get Results</div>
                      <div className="text-sm text-gray-600">
                        Pay SUI → Real-time AI analysis (5-15s) → Structured JSON results
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-blue-800 font-semibold mb-2">💎 Cost Comparison</div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">2-5 SUI</div>
                      <div className="text-xs text-gray-600">per analysis</div>
                    </div>
                    <div className="text-gray-400">vs</div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-400 line-through">$150k+</div>
                      <div className="text-xs text-gray-600">hire data team</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Why Walrus Insight Engine?
            </h3>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Traditional analytics: expensive, slow, unverifiable. Walrus Insight: instant, affordable, trustless.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Problems */}
              <div className="bg-white rounded-xl p-8 border-2 border-red-100">
                <h4 className="text-xl font-bold text-red-600 mb-4">❌ Old Way</h4>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-red-500">•</span>
                    <span>Hire expensive data scientists ($150k+/year)</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-red-500">•</span>
                    <span>Wait months for custom analytics tools</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-red-500">•</span>
                    <span>No way to verify external analysis results</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-red-500">•</span>
                    <span>Lock-in to proprietary platforms</span>
                  </li>
                </ul>
              </div>

              {/* Solution */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border-2 border-blue-200">
                <h4 className="text-xl font-bold text-blue-600 mb-4">✅ Walrus Insight</h4>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-blue-600">•</span>
                    <span>Pay 2-5 SUI per analysis (~$6-15)</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-blue-600">•</span>
                    <span>Run analytics instantly with 1-click</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-blue-600">•</span>
                    <span>Cryptographically verify all results via blob_id</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-blue-600">•</span>
                    <span>Own your data forever on Walrus storage</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Real-World Use Cases
            </h3>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              From gaming studios to DeFi protocols, see how teams use Walrus Insight
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Gaming */}
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🎮</div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Gaming Studios</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Detect cheaters, balance gameplay, predict churn
                </p>
                <div className="text-xs text-purple-700 font-semibold">
                  2 templates available
                </div>
              </div>

              {/* DeFi */}
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">💰</div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">DeFi Protocols</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Risk scoring, whale tracking, liquidity analysis
                </p>
                <div className="text-xs text-blue-700 font-semibold">
                  2 templates available
                </div>
              </div>

              {/* Social */}
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🐦</div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Social Platforms</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Sentiment analysis, trending topics, bot detection
                </p>
                <div className="text-xs text-green-700 font-semibold">
                  1 template available
                </div>
              </div>

              {/* IoT */}
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">📡</div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">IoT Systems</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Predictive maintenance, anomaly detection, optimization
                </p>
                <div className="text-xs text-orange-700 font-semibold">
                  1 template available
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Built on Industry-Leading Technology
            </h3>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Walrus for storage, Sui for blockchain, multi-provider AI for analysis
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🌊</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Walrus Storage</h4>
                <p className="text-sm text-gray-600">
                  Decentralized, content-addressed storage for immutable configs & data
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚡</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Sui Blockchain</h4>
                <p className="text-sm text-gray-600">
                  Fast, low-cost NFT marketplace with programmable assets
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🤖</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Multi-Provider AI</h4>
                <p className="text-sm text-gray-600">
                  Auto-detection: Anthropic API, AWS Bedrock, or Mock AI
                </p>
              </div>
            </div>

            {/* AI Provider Details */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border-2 border-purple-100">
              <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">🎯 Flexible AI Options</h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="font-bold text-gray-900 mb-1">Claude 3 Haiku</div>
                  <div className="text-xs text-gray-600 mb-2">via Anthropic API</div>
                  <div className="text-sm text-gray-700">
                    Fast & cheap (~$0.0004/run)
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl mb-2">🏢</div>
                  <div className="font-bold text-gray-900 mb-1">Claude 3.5 Sonnet</div>
                  <div className="text-xs text-gray-600 mb-2">via AWS Bedrock</div>
                  <div className="text-sm text-gray-700">
                    Enterprise-grade (~$0.02/run)
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl mb-2">🎭</div>
                  <div className="font-bold text-gray-900 mb-1">Mock AI</div>
                  <div className="text-xs text-gray-600 mb-2">Auto-fallback</div>
                  <div className="text-sm text-gray-700">
                    Instant demo ($0 cost)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
              🛡️ Security & Trust
            </h3>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Template-based approach ensures security without sacrificing flexibility
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border-2 border-green-100">
                <div className="text-3xl mb-3">✅</div>
                <h4 className="font-bold text-gray-900 mb-2">Pre-Built Templates</h4>
                <p className="text-sm text-gray-700">
                  Only audited, secure templates allowed. Users configure JSON parameters, not code.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-blue-100">
                <div className="text-3xl mb-3">🔐</div>
                <h4 className="font-bold text-gray-900 mb-2">Verifiable Results</h4>
                <p className="text-sm text-gray-700">
                  All configs & data on Walrus with SHA-256 verification. Download via Aggregator URL.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-purple-100">
                <div className="text-3xl mb-3">🏦</div>
                <h4 className="font-bold text-gray-900 mb-2">Sandboxed Execution</h4>
                <p className="text-sm text-gray-700">
                  Backend executes in isolated environment. No arbitrary code execution risk.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h3 className="text-4xl font-bold mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-xl mb-8 text-blue-100">
              Join the decentralized AI analytics revolution today
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/create"
                className="px-8 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                Create Your First Template
              </Link>
              <Link
                href="/marketplace"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-purple-600 transition-all"
              >
                Explore Marketplace
              </Link>
            </div>

            {/* Live Status */}
            <div className="mt-12 inline-block bg-white/10 backdrop-blur rounded-lg px-6 py-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live on Sui Testnet · Working Demo Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              Built with 💙 for{" "}
              <span className="font-semibold">Sui Walrus Hackathon 2025</span>
            </div>
            <div className="flex gap-6">
              <a
                href="https://github.com/snorlax00x/walrus-insight-engine"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com/snorlax00x"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold"
              >
                @snorlax00x
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
