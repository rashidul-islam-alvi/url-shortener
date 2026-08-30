import UrlForm from "@/components/url-form";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-lg">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold md:text-4xl">URL Shortener</h1>

          <a
            href="/stats"
            className="text-blue-500 transition hover:text-blue-600 hover:underline"
          >
            View Stats
          </a>
        </header>

        <UrlForm />
      </div>
    </main>
  );
}
