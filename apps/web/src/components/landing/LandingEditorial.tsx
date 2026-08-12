import Link from "next/link";
import type { BlogPost } from "@/lib/api/wordpress";
import { SectionTitle } from "./SectionTitle";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("sk-SK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function LandingEditorial({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  const [lead, ...rest] = posts;
  const side = rest.slice(0, 2);

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
      <SectionTitle
        index={String(posts.length).padStart(2, "0")}
        title="EDITORIAL"
        href="/blog"
        linkLabel="Celý blog →"
      />
      <div className="grid gap-8 lg:grid-cols-12">
        <article className="border border-[var(--landing-border)] bg-[var(--landing-surface)] p-6 lg:col-span-7">
          <p className="font-mono text-[10px] tracking-[0.25em] text-[var(--landing-brand)]">
            {formatDate(lead.date)}
          </p>
          <h3 className="landing-display mt-4 text-3xl font-black leading-tight text-[var(--landing-text)]">
            <Link href={`/blog/${lead.slug}`} className="hover:text-[var(--landing-brand)]">
              {lead.title}
            </Link>
          </h3>
          {lead.excerpt ? (
            <p
              className="mt-4 text-sm leading-relaxed text-[var(--landing-muted)]"
              dangerouslySetInnerHTML={{ __html: lead.excerpt }}
            />
          ) : null}
          <Link
            href={`/blog/${lead.slug}`}
            className="landing-hud-link mt-6 inline-block text-xs font-bold uppercase tracking-[0.2em] text-[var(--landing-text)]"
          >
            Čítať →
          </Link>
        </article>

        <div className="flex flex-col gap-4 lg:col-span-5">
          {side.map((post) => (
            <article key={post.id} className="border-b border-[var(--landing-border)] pb-4">
              <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--landing-muted)]">
                {formatDate(post.date)}
              </p>
              <h3 className="mt-2 text-lg font-bold text-[var(--landing-text)]">
                <Link href={`/blog/${post.slug}`} className="hover:text-[var(--landing-brand)]">
                  {post.title}
                </Link>
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
