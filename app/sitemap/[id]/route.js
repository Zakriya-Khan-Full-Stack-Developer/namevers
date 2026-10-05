import { getManifest, getBlogPosts } from '../../../lib/data/names-data.js';
import { ORIGIN_SLUGS, CATEGORY_SLUGS } from '../../../lib/data/name-utils.js';
import { ALL_RELIGIONS, ALL_LETTERS, lettersFor } from '../../../lib/data/letter-browser.js';

export const revalidate = 2592000; // 30 days

// Prerender every sitemap chunk at build time so this route is static (○),
// not server-rendered on demand (ƒ). Without this, each crawler hit on a
// sitemap URL burns a Function Invocation + Active CPU.
export function generateStaticParams() {
  const manifest = getManifest();
  const chunkSize = 5000;
  const ids = ['pages'];

  for (const rel of ['islamic', 'christian', 'hindu', 'italian']) {
    const count = (manifest[rel] || []).filter((i) => i.meaning && i.origin).length;
    const chunks = Math.ceil(count / chunkSize) || 1;
    if (chunks === 1) {
      ids.push(rel);
    } else {
      for (let i = 1; i <= chunks; i++) ids.push(`${rel}-${i}`);
    }
  }

  return ids.map((id) => ({ id: `${id}.xml` }));
}

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function GET(request, { params }) {
  const siteUrl = 'https://nameverse.site';
  const manifest = getManifest();
  const id = params.id.replace(/\.xml$/, '');

  let urls = [];

  if (id === 'pages') {
    // Core pages
    urls.push(`${siteUrl}/`);
    urls.push(`${siteUrl}/names`);
    urls.push(`${siteUrl}/origins`);
    urls.push(`${siteUrl}/categories`);
    urls.push(`${siteUrl}/blog`);
    urls.push(`${siteUrl}/about`);
    urls.push(`${siteUrl}/contact`);
    urls.push(`${siteUrl}/trending-names`);
    urls.push(`${siteUrl}/unique-names`);
    urls.push(`${siteUrl}/popularity`);
    urls.push(`${siteUrl}/name-meanings`);
    urls.push(`${siteUrl}/names-by-meaning`);
    urls.push(`${siteUrl}/names-by-origin`);

    // Tradition hubs
    for (const rel of ['islamic', 'christian', 'hindu', 'italian']) {
      urls.push(`${siteUrl}/names/${rel}`);
    }

    // Gender hubs
    const genderHubs = [
      'islamic-boy-names',
      'islamic-girl-names',
      'christian-boy-names',
      'christian-girl-names',
      'hindu-boy-names',
      'hindu-girl-names',
      'italian-boy-names',
      'italian-girl-names',
    ];
    for (const gh of genderHubs) {
      urls.push(`${siteUrl}/${gh}`);
    }

    // Origin hubs
    for (const o of ORIGIN_SLUGS) {
      urls.push(`${siteUrl}/origins/${o}`);
    }

    // Category hubs
    for (const c of CATEGORY_SLUGS) {
      urls.push(`${siteUrl}/categories/${c}`);
    }

    // Letter browse hubs
    for (const rel of ALL_RELIGIONS) {
      const avail = lettersFor(rel, manifest);
      for (const letter of ALL_LETTERS) {
        if (avail.has(letter)) {
          urls.push(`${siteUrl}/names/${rel}/letter/${letter === '#' ? '%23' : letter}`);
        }
      }
    }

    // Blog posts
    const blogPosts = getBlogPosts();
    for (const post of blogPosts) {
      if (post.id) {
        urls.push(`${siteUrl}/blog/${post.id}`);
      }
    }
  } else {
    // Name detail sitemaps: e.g. islamic-1, islamic-2, or italian
    let religion = id;
    let chunkIndex = 1;

    const match = id.match(/^([a-z]+)-(\d+)$/);
    if (match) {
      religion = match[1];
      chunkIndex = parseInt(match[2], 10);
    }

    // Only publish URLs for pages that actually carry unique content. A record
    // with no meaning and no origin renders a thin page, and submitting those
    // to Google is what causes "Crawled — currently not indexed" at scale.
    // The 352-record Italian stub set is excluded here for exactly that reason.
    const items = (manifest[religion] || []).filter((item) => item.slug && item.meaning && item.origin);
    const chunkSize = 5000;
    const start = (chunkIndex - 1) * chunkSize;
    const chunkItems = items.slice(start, start + chunkSize);

    for (const item of chunkItems) {
      urls.push(`${siteUrl}/names/${religion}/${item.slug}`);
    }
  }

  if (urls.length === 0) {
    return new Response('Sitemap not found', { status: 404 });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=2592000, s-maxage=2592000',
    },
  });
}
