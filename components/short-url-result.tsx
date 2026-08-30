"use client";

import { useState } from "react";

interface ShortUrlResultProps {
  shortUrl: string;
}

export default function ShortUrlResult({ shortUrl }: ShortUrlResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  return (
    <div className="mt-6 rounded-lg border border-green-200 bg-slate-700 p-4">
      <p className="mb-2 font-medium text-white">Your shortened URL:</p>

      <div className="flex items-center gap-2">
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-blue-300 hover:underline"
        >
          {shortUrl}
        </a>

        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded bg-white/10 px-3 py-1.5 text-sm text-white transition hover:bg-white/20"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
