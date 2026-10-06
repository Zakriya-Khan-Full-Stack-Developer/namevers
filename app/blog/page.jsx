import Link from 'next/link';
import { getBlogPosts } from '../../lib/data/names-data.js';
import AdSlot from '../../components/AdSlot.jsx';
export const revalidate = 2592000; // 30 days

export const metadata = {
  title: 'Baby Name Guides & Trends 2026 | NameVerse Blog',
  description:
    'Expert baby naming guides, curated name lists and cultural insights — Islamic, Hindu, Christian and global naming traditions explained by the NameVerse editorial team.',
  alternates: {
    canonical: 'https://nameverse.site/blog',
  },
};

export default function BlogIndexPage() {
  const blogPosts = getBlogPosts();
  const siteUrl = 'https://nameverse.site';

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'NameVerse Blog',
    description: 'Expert naming guides, baby name trends and cultural insights from the NameVerse editorial team.',
    url: `${siteUrl}/blog`,
    publisher: { '@type': 'Organization', name: 'NameVerse', url: siteUrl },
    blogPost: blogPosts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${siteUrl}/blog/${post.id}`,
      datePublished: post.publishDate,
      dateModified: post.lastUpdated,
      author: { '@type': 'Organization', name: post.author || 'NameVerse Editorial Team' },
    })),
  };

  return (
    <div className="container-page py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center">
          <span className="eyebrow">NameVerse editorial</span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-nv-text sm:text-5xl">
            Baby Name Guides &amp; Trends
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-nv-text-secondary">
            Expert naming guides, curated lists and cultural insights for parents in every tradition.
          </p>
        </header>

        <AdSlot placement="blog-index-top" />

        {/* Articles Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="card card-hover group flex flex-col p-6"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="badge bg-nv-accent-subtle text-nv-accent">{post.category}</span>
                <span className="text-xs text-nv-text-muted">{post.readTime}</span>
              </div>
              <h2 className="mt-3 font-display text-xl font-bold leading-snug text-nv-text group-hover:text-nv-accent transition-colors">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-nv-text-secondary">
                {post.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between pt-5 text-xs text-nv-text-secondary">
                <span>{new Date(post.publishDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                <span className="font-semibold text-nv-accent group-hover:translate-x-0.5 transition-transform">
                  Read article &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Browse by tradition links */}
        <section className="mt-16 border-t border-nv-border pt-12" aria-labelledby="tradition-heading">
          <h2 id="tradition-heading" className="mb-6 font-display text-2xl font-bold tracking-tight text-nv-text text-center">
            Explore Names by Tradition
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: 'Islamic Boy Names', href: '/islamic-boy-names' },
              { label: 'Islamic Girl Names', href: '/islamic-girl-names' },
              { label: 'Christian Boy Names', href: '/christian-boy-names' },
              { label: 'Christian Girl Names', href: '/christian-girl-names' },
              { label: 'Hindu Boy Names', href: '/hindu-boy-names' },
              { label: 'Hindu Girl Names', href: '/hindu-girl-names' },
            ].map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="card p-3.5 text-center text-sm font-semibold text-nv-text hover:border-nv-accent hover:text-nv-accent transition"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
