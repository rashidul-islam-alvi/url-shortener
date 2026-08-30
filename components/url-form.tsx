"use client";

import { FormEvent, useState } from "react";
import ShortUrlResult from "./short-url-result";

export default function UrlForm() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setShortUrl("");

    if (!url.trim()) {
      setError("Please enter a URL.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to shorten URL.");
      }

      setShortUrl(data.shortUrl);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="url" className="block font-medium">
            Enter the URL you want to shorten
          </label>

          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very-long-url"
            className="w-full rounded border border-gray-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-500 p-3 font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {shortUrl && <ShortUrlResult shortUrl={shortUrl} />}
    </>
  );
}
