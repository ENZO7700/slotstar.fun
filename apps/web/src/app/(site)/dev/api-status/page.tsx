import { notFound } from 'next/navigation';
import { getFilters, getGames, getHealth, getProviders, getThemes, getTypes } from '@/lib/api/wordpress';

export const dynamic = 'force-dynamic';

export default async function ApiStatusPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  let health = null;
  let games = null;
  let providers = null;
  let themes = null;
  let types = null;
  let filters = null;
  let errorMsg = null;

  try {
    health = await getHealth();
    games = await getGames({ perPage: 1 });
    providers = await getProviders({ perPage: 1 });
    themes = await getThemes({ perPage: 1 });
    types = await getTypes({ perPage: 1 });
    filters = await getFilters({ perPage: 1 });
  } catch (err: unknown) {
    errorMsg = err instanceof Error ? err.message : 'Failed to connect to WordPress API';
  }

  return (
    <main className="p-8 max-w-4xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-6">SlotStar Development API Diagnostics</h1>

      {errorMsg ? (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-6">
          <strong>API Error:</strong> {errorMsg}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-300 rounded">
            <h2 className="font-semibold text-lg text-green-800 mb-2">WordPress Status</h2>
            <p><strong>Status:</strong> {health?.status}</p>
            <p><strong>WordPress Connected:</strong> {health?.wordpress ? 'YES' : 'NO'}</p>
            <p><strong>SlotsLaunch Plugin Active:</strong> {health?.slotsLaunchPluginActive ? 'YES' : 'NO'}</p>
            <p><strong>Source Mode:</strong> {health?.sourceMode}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded shadow-sm">
              <h3 className="font-medium text-gray-700">Games Total</h3>
              <p className="text-2xl font-bold">{games?.pagination.total ?? 0}</p>
            </div>
            <div className="p-4 border rounded shadow-sm">
              <h3 className="font-medium text-gray-700">Providers Total</h3>
              <p className="text-2xl font-bold">{providers?.pagination.total ?? 0}</p>
            </div>
            <div className="p-4 border rounded shadow-sm">
              <h3 className="font-medium text-gray-700">Themes Total</h3>
              <p className="text-2xl font-bold">{themes?.pagination.total ?? 0}</p>
            </div>
            <div className="p-4 border rounded shadow-sm">
              <h3 className="font-medium text-gray-700">Types Total</h3>
              <p className="text-2xl font-bold">{types?.pagination.total ?? 0}</p>
            </div>
            <div className="p-4 border rounded shadow-sm">
              <h3 className="font-medium text-gray-700">Filters Total</h3>
              <p className="text-2xl font-bold">{filters?.pagination.total ?? 0}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
