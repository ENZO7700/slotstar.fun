'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-center text-zinc-100">
        <h1 className="mb-2 text-xl font-bold text-red-400">Application error</h1>
        <p className="mb-6 max-w-md text-sm text-zinc-400">
          Something went wrong. Please try again later.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-bold text-zinc-100 transition-colors hover:bg-zinc-700"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
