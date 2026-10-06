import { getManifest } from '../../lib/data/names-data.js';

export const revalidate = 2592000; // 30 days

export async function GET() {
  const siteUrl = 'https://nameverse.site';
  const manifest = getManifest();

  const chunkSize = 5000;
  const sitemaps = [
    { loc: `${siteUrl}/sitemap/pages.xml` },
  ];

  for (const rel of ['islamic', 'christian', 'hindu', 'italian']) {
    // Count only records that will actually be published. Counting every record
    // would emit sitemap chunks for pages that are never prerendered, and a
    // crawler following those would hit 404s (or, before the Fluid Active CPU
    // fix, trigger on-demand renders).
    const count = (manifest[rel] || []).filter((i) => i.indexable).length;
    const chunks = Math.ceil(count / chunkSize) || 1;
    if (chunks === 1) {
      sitemaps.push({ loc: `${siteUrl}/sitemap/${rel}.xml` });
    } else {
      for (let i = 1; i <= chunks; i++) {
        sitemaps.push({ loc: `${siteUrl}/sitemap/${rel}-${i}.xml` });
      }
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (s) => `  <sitemap>
    <loc>${s.loc}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=2592000, s-maxage=2592000',
    },
  });
}
