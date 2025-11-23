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

        // Real upload to Walrus via backend
        const formData = new FormData();
        formData.append('file', file);
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

        // Add parsed data info to result
        const uploadResult = {
          ...result,
          row_count: Array.isArray(parsedData) ? parsedData.length : 1,
          column_count: Array.isArray(parsedData) && parsedData[0]
            ? Object.keys(parsedData[0]).length
            : 0,
          metadata: metadata,
        };

        setUploadResult(uploadResult);
        setUploading(false);
      };

      reader.readAsText(file);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
      setUploading(false);
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "gaming": return "🎮";
      case "defi": return "💰";
      case "iot": return "📡";
      case "social": return "🐦";
      default: return "📊";
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
                  Upload Data
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/marketplace" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Marketplace
              </Link>
              <Link href="/create" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Create
              </Link>
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Upload Your Data
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Upload CSV or JSON data to Walrus Storage for verifiable, decentralized analysis
            </p>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">Decentralized storage</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">SHA-256 verification</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">Permanent storage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {!uploadResult ? (
          <div className="space-y-6">
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all ${
                dragActive
                  ? "border-blue-500 bg-blue-50 shadow-xl scale-105"
                  : "border-gray-300 bg-white hover:border-gray-400 hover:shadow-md"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-8xl mb-6">📁</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Drop your file here
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                or click to browse from your computer
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
                className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl cursor-pointer font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Choose File
              </label>
              <p className="text-sm text-gray-500 mt-6">
                Supports CSV and JSON files up to 10MB
              </p>
            </div>

            {/* File Preview */}
            {file && (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-2xl">📄</span>
                  Selected File
                </h3>
                <div className="flex items-center justify-between bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">
                      {file.type === "application/json" ? "📄" : "📊"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg mb-1">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {/* Metadata Form */}
            {file && (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  Dataset Information
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Dataset Name *
                    </label>
                    <input
                      type="text"
                      value={metadata.name}
                      onChange={(e) => setMetadata({...metadata, name: e.target.value})}
                      placeholder="e.g., Player Spending Data Q4 2024"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={metadata.description}
                      onChange={(e) => setMetadata({...metadata, description: e.target.value})}
                      placeholder="Describe your dataset..."
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={metadata.category}
                      onChange={(e) => setMetadata({...metadata, category: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    >
                      <option value="gaming">{getCategoryIcon("gaming")} Gaming</option>
                      <option value="defi">{getCategoryIcon("defi")} DeFi</option>
                      <option value="iot">{getCategoryIcon("iot")} IoT</option>
                      <option value="social">{getCategoryIcon("social")} Social Media</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg">
                    <input
                      type="checkbox"
                      id="is-public"
                      checked={metadata.isPublic}
                      onChange={(e) => setMetadata({...metadata, isPublic: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <label htmlFor="is-public" className="text-sm font-medium text-gray-700">
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
                className={`w-full py-5 rounded-xl font-bold text-lg transition-all ${
                  uploading || !metadata.name
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                }`}
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
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
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">⚠️</div>
                <p className="text-yellow-800 font-semibold text-lg">
                  Please connect your wallet to upload data
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Upload Success */
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-100 p-12">
            <div className="text-center mb-8">
              <div className="text-8xl mb-6">✅</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                Upload Successful!
              </h3>
              <p className="text-xl text-gray-600">
                Your data has been uploaded to Walrus Storage
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
                <p className="text-sm font-semibold text-gray-700 mb-2">Blob ID</p>
                <p className="font-mono text-sm text-gray-900 break-all bg-white p-3 rounded-lg">
                  {uploadResult.blob_id}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200">
                <p className="text-sm font-semibold text-gray-700 mb-2">Content Hash (SHA-256)</p>
                <p className="font-mono text-xs text-gray-900 break-all bg-white p-3 rounded-lg">
                  {uploadResult.content_hash}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center border-2 border-green-200">
                  <p className="text-sm text-gray-600 mb-2">Rows</p>
                  <p className="text-3xl font-bold text-green-900">
                    {uploadResult.row_count.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl text-center border-2 border-orange-200">
                  <p className="text-sm text-gray-600 mb-2">Columns</p>
                  <p className="text-3xl font-bold text-orange-900">
                    {uploadResult.column_count}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl text-center border-2 border-indigo-200">
                  <p className="text-sm text-gray-600 mb-2">Size</p>
                  <p className="text-3xl font-bold text-indigo-900">
                    {(uploadResult.size_bytes / 1024).toFixed(1)}KB
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/marketplace"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg text-center transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                ⚡ Run Analysis
              </Link>
              <button
                onClick={() => {
                  setFile(null);
                  setUploadResult(null);
                  setMetadata({ name: "", description: "", category: "gaming", isPublic: true });
                }}
                className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-bold text-lg transition-all"
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
