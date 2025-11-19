"use client";

import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { useState, useCallback } from "react";
import Link from "next/link";

export default function UploadPage() {
  const account = useCurrentAccount();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [metadata, setMetadata] = useState({
    name: "",
    description: "",
    category: "gaming",
    isPublic: true,
  });

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  // Handle file input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Process file
  const handleFile = (file: File) => {
    const validTypes = ["text/csv", "application/json", "text/plain"];
    if (!validTypes.includes(file.type) && !file.name.endsWith(".csv")) {
      alert("Please upload CSV or JSON files only");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert("File size must be less than 10MB");
      return;
    }

    setFile(file);

    // Auto-fill name from filename
    if (!metadata.name) {
      setMetadata(prev => ({
        ...prev,
        name: file.name.replace(/\.[^/.]+$/, "")
      }));
    }
  };

  // Upload to Walrus (mock for now)
  const handleUpload = async () => {
    if (!file || !account) return;

    setUploading(true);
    setUploadResult(null);

    try {
      // Read file
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;

        // Parse CSV/JSON
        let parsedData;
        try {
          if (file.type === "application/json") {
            parsedData = JSON.parse(content);
          } else {
            // Simple CSV parsing
            const lines = content.split("\n").filter(l => l.trim());
            const headers = lines[0].split(",").map(h => h.trim());
            parsedData = lines.slice(1).map(line => {
              const values = line.split(",");
              return headers.reduce((obj: any, header, i) => {
                obj[header] = values[i]?.trim();
                return obj;
              }, {});
            });
          }
        } catch (err) {
          alert("Failed to parse file. Please check format.");
          setUploading(false);
          return;
        }

        // Mock upload to Walrus
        await new Promise(resolve => setTimeout(resolve, 2000));

        const mockResult = {
          blob_id: `walrus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          content_hash: Array.from({length: 64}, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join(''),
          aggregator_url: `https://aggregator.walrus-testnet.mystenlabs.com/v1/...`,
          row_count: Array.isArray(parsedData) ? parsedData.length : 1,
          column_count: Array.isArray(parsedData) && parsedData[0]
            ? Object.keys(parsedData[0]).length
            : 0,
          size_bytes: file.size,
          metadata: metadata,
        };

        setUploadResult(mockResult);
        setUploading(false);
      };

      reader.readAsText(file);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
      setUploading(false);
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
                  Upload Data
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/marketplace" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Marketplace
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
            Upload Your Data
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Upload CSV or JSON data to Walrus Storage for verifiable, decentralized analysis
          </p>
        </div>

        {!uploadResult ? (
          <div className="space-y-6">
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Drop your file here
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                or click to browse
              </p>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".csv,.json"
                onChange={handleChange}
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
              >
                Choose File
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
                Supports CSV and JSON files up to 10MB
              </p>
            </div>

            {/* File Preview */}
            {file && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Selected File
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">
                      {file.type === "application/json" ? "📄" : "📊"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {/* Metadata Form */}
            {file && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Dataset Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Dataset Name
                    </label>
                    <input
                      type="text"
                      value={metadata.name}
                      onChange={(e) => setMetadata({...metadata, name: e.target.value})}
                      placeholder="e.g., Player Spending Data Q4 2024"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={metadata.description}
                      onChange={(e) => setMetadata({...metadata, description: e.target.value})}
                      placeholder="Describe your dataset..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={metadata.category}
                      onChange={(e) => setMetadata({...metadata, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="gaming">Gaming</option>
                      <option value="defi">DeFi</option>
                      <option value="iot">IoT</option>
                      <option value="social">Social Media</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is-public"
                      checked={metadata.isPublic}
                      onChange={(e) => setMetadata({...metadata, isPublic: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <label htmlFor="is-public" className="text-sm text-gray-700 dark:text-gray-300">
                      Make this dataset publicly accessible
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Button */}
            {file && account && (
              <button
                onClick={handleUpload}
                disabled={uploading || !metadata.name}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                  uploading || !metadata.name
                    ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Uploading to Walrus...
                  </span>
                ) : (
                  "🚀 Upload to Walrus Storage"
                )}
              </button>
            )}

            {!account && file && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
                <p className="text-yellow-800 dark:text-yellow-300">
                  Please connect your wallet to upload data
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Upload Success */
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Upload Successful!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your data has been uploaded to Walrus Storage
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Blob ID</p>
                <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                  {uploadResult.blob_id}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Content Hash (SHA-256)</p>
                <p className="font-mono text-xs text-gray-900 dark:text-white break-all">
                  {uploadResult.content_hash}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rows</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {uploadResult.row_count.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Columns</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {uploadResult.column_count}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Size</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(uploadResult.size_bytes / 1024).toFixed(1)}KB
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Link
                href="/analytics"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium text-center transition-all"
              >
                ⚡ Run Analysis
              </Link>
              <button
                onClick={() => {
                  setFile(null);
                  setUploadResult(null);
                  setMetadata({ name: "", description: "", category: "gaming", isPublic: true });
                }}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Upload Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
