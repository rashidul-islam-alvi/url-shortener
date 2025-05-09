'use client';

import { useState } from 'react';


export default function Home() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    setCopied(false);
    
    if (!url) {
      setError('Please enter a URL');
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('/api/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      // Ensure the short URL is properly formatted
      let shortUrl = data.shortUrl;
      // Remove any double protocols if they exist
      if (shortUrl.includes('https://http') || shortUrl.includes('http://http')) {
        shortUrl = shortUrl.replace(/^https?:\/\/(https?:\/\/)?/, 'http://');
      }
      setShortUrl(shortUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">URL Shortener</h1>
          <a href="/stats" className="text-blue-500 hover:underline">View Stats</a>
        </div>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col mb-4">
            <label htmlFor="url" className="mb-2 font-medium">
              Enter the URL you want to shorten
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very-long-url"
              className="p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded font-medium"
          >
            {loading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </form>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {shortUrl && (
          <div className="bg-slate-500 border border-green-200 p-4 rounded">
            <p className="font-medium mb-2">Your shortened URL:</p>
            <div className="flex items-center">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:underline mr-2 overflow-hidden text-ellipsis"
              >
                {shortUrl}
              </a>
             
            </div>
            {copied && (
              <p className="text-green-600 text-sm mt-1">Copied to clipboard!</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}