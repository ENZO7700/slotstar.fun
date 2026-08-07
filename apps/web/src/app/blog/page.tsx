import React from 'react';
import Link from 'next/link';
import { getBlogPosts } from '@/lib/api/wordpress';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog – SlotStar | Tipy, novinky a sprievodcovia kasíno hrami',
  description: 'Čítajte najnovšie články o demo kasíno hrách, stratégiách, poskytovateľoch a novinkách zo sveta online slotov.',
};

export const dynamic = 'force-dynamic';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('sk-SK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPage() {
  const { data: posts, total } = await getBlogPosts({ perPage: 12 });

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <section className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-zinc-100">Blog</h1>
        <p className="text-sm text-zinc-400 max-w-xl">
          Tipy, stratégie a novinky zo sveta demo kasíno hier a poskytovateľov.
        </p>
      </section>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
          <span className="text-5xl">📝</span>
          <h2 className="text-xl font-bold text-zinc-100">Zatiaľ žiadne články</h2>
          <p className="text-sm text-zinc-500 max-w-sm">
            Čoskoro tu nájdete tipy, sprievodcov a novinky zo sveta kasíno hier.
          </p>
          <Link
            href="/games"
            className="mt-2 inline-flex items-center bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            Preskúmať hry
          </Link>
        </div>
      ) : (
        <>
          <p className="text-xs text-zinc-500">{total} článkov</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors"
              >
                {/* Thumbnail */}
                {post.featuredImage ? (
                  <div className="aspect-video w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-zinc-800 flex items-center justify-center">
                    <span className="text-4xl opacity-30">🎰</span>
                  </div>
                )}

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 space-y-3">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    {formatDate(post.date)} · {post.author}
                  </span>
                  <h2 className="text-base font-bold text-zinc-100 group-hover:text-amber-400 transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="text-xs font-semibold text-amber-500 group-hover:underline mt-auto">
                    Čítať viac →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
