import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPost, getBlogPosts } from '@/lib/api/wordpress';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: 'Článok nenájdený – SlotStar' };
  return {
    title: `${post.title} – SlotStar Blog`,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  const { data } = await getBlogPosts({ perPage: 50 });
  return data.map((p) => ({ slug: p.slug }));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('sk-SK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-zinc-300">Domov</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-zinc-300">Blog</Link>
        <span>/</span>
        <span className="text-zinc-400 truncate max-w-50">{post.title}</span>
      </nav>

      {/* Featured image */}
      {post.featuredImage && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-800">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Article header */}
      <header className="space-y-3">
        <p className="text-xs text-zinc-500 uppercase tracking-wider">
          {formatDate(post.date)} · {post.author}
        </p>
        <h1 className="text-3xl font-black tracking-tight text-zinc-100 leading-tight">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-base text-zinc-400 leading-relaxed border-l-2 border-amber-500 pl-4">
            {post.excerpt}
          </p>
        )}
      </header>

      {/* Article content — rendered from WordPress HTML */}
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Back link */}
      <div className="pt-8 border-t border-zinc-800">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm font-semibold text-amber-500 hover:underline"
        >
          ← Späť na blog
        </Link>
      </div>
    </article>
  );
}
