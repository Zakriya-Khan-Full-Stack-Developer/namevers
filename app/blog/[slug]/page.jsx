import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPosts } from '../../../lib/data/names-data.js';
import AdSlot from '../../../components/AdSlot.jsx';

export const revalidate = 2592000; // 30 days
export const dynamicParams = false;

// Fix 2 — prerender every blog post plus the three static stubs.
const BLOG_STUB_SLUGS = [
  'top-islamic-baby-names-2026',
  'hindu-baby-names-meanings',
  'christian-baby-names-bible',
];

export function generateStaticParams() {
  const posts = getBlogPosts();
  const slugs = new Set(BLOG_STUB_SLUGS);
  for (const post of posts) {
    if (post && post.id) slugs.add(post.id);
  }
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const blogPosts = getBlogPosts();
  const post = blogPosts.find((p) => p.id === params.slug);

  if (!post) {
    if (params.slug === 'top-islamic-baby-names-2026') {
      return {
        title: 'Top Islamic Baby Names for 2026',
        description: 'Explore the most searched Muslim baby names this year with meanings and origins.',
        alternates: { canonical: 'https://nameverse.site/blog/top-islamic-baby-names-2026' },
      };
    }
    if (params.slug === 'hindu-baby-names-meanings') {
      return {
        title: 'Hindu Baby Names with Deep Meanings',
        description: 'Sanskrit and Vedic names carrying spiritual significance and heritage.',
        alternates: { canonical: 'https://nameverse.site/blog/hindu-baby-names-meanings' },
      };
    }
    if (params.slug === 'christian-baby-names-bible') {
      return {
        title: 'Christian Baby Names from the Bible',
        description: 'Timeless biblical names with Hebrew and Greek roots, explained.',
        alternates: { canonical: 'https://nameverse.site/blog/christian-baby-names-bible' },
      };
    }
    return {};
  }

  return {
    title: `${post.title} | NameVerse`,
    description: post.excerpt,
    alternates: {
      canonical: `https://nameverse.site/blog/${post.id}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishDate,
      modifiedTime: post.lastUpdated,
    },
  };
}

export default function BlogPostPage({ params }) {
  const blogPosts = getBlogPosts();
  const post = blogPosts.find((p) => p.id === params.slug);

  // Handle static stubs gracefully
  if (!post) {
    const stubs = {
      'top-islamic-baby-names-2026': {
        title: 'Top Islamic Baby Names for 2026',
        description: 'Explore the most searched Muslim baby names this year with meanings and origins.',
        targetDir: '/names/islamic',
        dirLabel: 'Islamic Names Directory',
      },
      'hindu-baby-names-meanings': {
        title: 'Hindu Baby Names with Deep Meanings',
        description: 'Sanskrit and Vedic names carrying spiritual significance and heritage.',
        targetDir: '/names/hindu',
        dirLabel: 'Hindu Names Directory',
      },
      'christian-baby-names-bible': {
        title: 'Christian Baby Names from the Bible',
        description: 'Timeless biblical names with Hebrew and Greek roots, explained.',
        targetDir: '/names/christian',
        dirLabel: 'Christian Names Directory',
      },
    };

    const stub = stubs[params.slug];
    if (!stub) notFound();

    return (
      <div className="container-page py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <Link href="/blog" className="text-sm font-semibold text-nv-accent hover:underline">
            &larr; Back to Blog
          </Link>
          <h1 className="font-display mt-4 text-3xl font-bold text-nv-text sm:text-4xl">{stub.title}</h1>
          <p className="mt-4 text-nv-text-secondary">{stub.description}</p>
          <div className="mt-6 rounded-2xl border border-nv-border bg-nv-surface p-6">
            <p className="text-sm text-nv-text-secondary">
              This guide is being updated for 2026. In the meantime, explore our{' '}
              <Link href={stub.targetDir} className="font-semibold text-nv-accent hover:underline">
                {stub.dirLabel}
              </Link>{' '}
              for full meanings, origins, and lucky numbers.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const {
    title,
    subtitle,
    excerpt,
    category,
    author,
    publishDate,
    lastUpdated,
    readTime,
    content,
  } = post;

  const formattedDate = new Date(publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: excerpt,
    datePublished: publishDate,
    dateModified: lastUpdated,
    author: {
      '@type': 'Organization',
      name: author || 'NameVerse Editorial Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'NameVerse',
      url: 'https://nameverse.site',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://nameverse.site/blog/${post.id}`,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nameverse.site' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://nameverse.site/blog' },
      { '@type': 'ListItem', position: 3, name: title },
    ],
  };

  return (
    <article className="container-page py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-nv-text-secondary" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-nv-accent transition">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-nv-accent transition">Blog</Link>
          <span>/</span>
          <span className="text-nv-text font-medium truncate">{title}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 text-xs text-nv-text-secondary mb-3">
            <span className="badge bg-nv-accent-subtle text-nv-accent">{category}</span>
            <span>&bull;</span>
            <span>{readTime}</span>
            <span>&bull;</span>
            <time dateTime={publishDate}>{formattedDate}</time>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-nv-text sm:text-5xl">
            {title}
          </h1>
          {subtitle && <p className="mt-3 text-lg text-nv-text-secondary font-medium">{subtitle}</p>}
        </header>

        <AdSlot placement="blog-post-top" />

        {/* Introduction */}
        {content?.introduction && (
          <div className="card p-6 sm:p-8 mb-8 bg-nv-subtle/50 text-base leading-relaxed text-nv-text">
            {content.introduction}
          </div>
        )}

        {/* Sections */}
        <div className="space-y-8">
          {content?.sections?.map((section, idx) => (
            <section key={idx} className="card p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold text-nv-text mb-4">
                {section.title}
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-nv-text-secondary">
                {section.content}
              </div>

              {section.featuredNames && section.featuredNames.length > 0 && (
                <div className="mt-6 pt-4 border-t border-nv-border">
                  <span className="text-xs font-bold uppercase tracking-wider text-nv-text-secondary block mb-2">
                    Featured names in this section:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {section.featuredNames.map((name) => (
                      <Link
                        key={name}
                        href={`/search?q=${encodeURIComponent(name)}`}
                        className="rounded-full border border-nv-border bg-nv-surface px-3 py-1 text-xs font-semibold text-nv-accent hover:bg-nv-accent-subtle transition"
                      >
                        {name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* FAQs if present */}
        {content?.faqs && content.faqs.length > 0 && (
          <section className="mt-12 card p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold text-nv-text mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {content.faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="group rounded-xl border border-nv-border bg-nv-surface p-4 transition hover:border-nv-accent/40"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-nv-text hover:text-nv-accent">
                    <span>{faq.q}</span>
                    <span className="text-nv-text-muted transition-transform duration-200 group-open:rotate-180">
                      &darr;
                    </span>
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-nv-text-secondary">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 pt-6 border-t border-nv-border flex justify-between items-center">
          <Link href="/blog" className="btn-ghost text-xs">
            &larr; Back to all guides
          </Link>
          <Link href="/names" className="btn-primary text-xs">
            Explore All Names &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
