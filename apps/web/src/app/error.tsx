'use client';

import { getPublicErrorMessage } from '@/lib/safe-error';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const message = getPublicErrorMessage(
    null,
    'Something went wrong while loading this page. Please try again.',
  );

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-xl font-bold text-red-400">Unexpected error</h1>
      <p className="mb-6 max-w-md text-sm text-zinc-400">{message}</p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-bold text-zinc-100 transition-colors hover:bg-zinc-700"
      >
        Try again
      </button>
    </div>
  );
}
