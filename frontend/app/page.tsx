"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://document-assistant-4.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.analysis);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-12 px-4">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-green-700 mb-2">
              Document Assistant
        </h1>
        <p className="text-gray-500 text-lg">
          Upload a PDF or Word document and let AI analyse it for you
        </p>
      </div>

      {/* Upload Box */}
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-xl">

        <label className="block text-gray-700 font-semibold mb-2">
          Select a document to upload
        </label>

        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setError("");
            setResult("");
          }}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0 file:text-sm file:font-semibold
            file:bg-green-50 file:text-green-700 hover:file:bg-green-100 mb-4"
        />

        {/* Selected file name */}
        {file && (
          <p className="text-sm text-gray-400 mb-4">
            Selected: <span className="text-green-600 font-medium">{file.name}</span>
          </p>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold
            py-3 px-6 rounded-xl transition duration-200 disabled:opacity-50"
        >
          {loading ? "Analysing document..." : "Upload & Analyse"}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-600
            rounded-xl p-4 text-sm">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="mt-8 flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent
            rounded-full animate-spin"></div>
          <p className="text-gray-500 mt-3">AI is analysing your document...</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-8 bg-white shadow-md rounded-2xl p-8 w-full max-w-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-green-700">
                Analysis Results
            </h2>
          </div>
          <div className="text-gray-700 leading-relaxed border-t pt-4">
            {result.split('\n').map((line, index) => (
              <p key={index} className="mb-2">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

    </main>
  );
}