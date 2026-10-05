import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readNameData, normalizeReligion, normalizeSlug, getKnownSlugsMap, getPopularSlugs } from '@/lib/data/names-data.js';
import {
  religionLabel,
  normalizeGender,
  genderLabel,
  slugify,
  originSlugFor,
  ORIGIN_LABELS,
} from '@/lib/data/name-utils.js';
import { enrichNameProfile } from '@/lib/data/name-enricher.js';
import Ad from '@/components/Ad.jsx';
import NativeAdBanner from '@/components/NativeAdBanner.jsx';
import SocialShare from '@/components/SocialShare.jsx';

export const revalidate = 2592000; // 30 days
export const dynamicParams = true;

// Fix 2 — prerender the highest-popularity name pages at build time.
// The long tail is still generated on demand (dynamicParams = true) and then
// cached for 30 days, so a single crawl of the sitemap no longer triggers
// 13,802 on-demand renders.
//
// The cap is env-tunable: raise PRERENDER_NAME_PAGES on a build machine with
// more memory (Vercel's builder has far more than a 2 GB container).
const PRERENDER_NAME_PAGES = Number(process.env.PRERENDER_NAME_PAGES) || 4000;

export function generateStaticParams() {
  return getPopularSlugs(PRERENDER_NAME_PAGES);
}

export async function generateMetadata({ params }) {
  const finalReligion = normalizeReligion(params.religion);
  const normalizedSlug = normalizeSlug(params.slug);
  if (!finalReligion || !normalizedSlug) return {};

  const rawData = await readNameData(finalReligion, normalizedSlug);
  if (!rawData) return {};

  const nameData = enrichNameProfile(rawData);
  const relLabel = religionLabel(finalReligion);
  const seo = nameData.seo?.seo || nameData.seo || {};
  const pageTitle = seo.title || `${nameData.name} — ${relLabel} Name Meaning, Origin & Lucky Number | NameVerse`;
  const pageDescription =
    seo.meta_description ||
    nameData.short_meaning ||
    nameData.meaning ||
    `Discover the comprehensive meaning, origin, pronunciation, lucky numbers, and cultural context for the ${relLabel} baby name ${nameData.name}.`;

  const canonicalUrl = `https://nameverse.site/names/${finalReligion}/${normalizedSlug}`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      type: 'article',
      images: [
        {
          url: 'https://nameverse.site/nameverse_logo_emblem.webp',
          width: 512,
          height: 512,
          alt: `${nameData.name} Meaning`,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: pageTitle,
      description: pageDescription,
    },
  };
}

export default async function NameDetailPage({ params }) {
  const finalReligion = normalizeReligion(params.religion);
  const normalizedSlug = normalizeSlug(params.slug);
  if (!finalReligion || !normalizedSlug) notFound();

  const rawData = await readNameData(finalReligion, normalizedSlug);
  if (!rawData) notFound();

  const nameData = enrichNameProfile(rawData);
  const knownSlugsMap = getKnownSlugsMap();

  const relLabel = religionLabel(finalReligion);
  const canonicalUrl = `https://nameverse.site/names/${finalReligion}/${normalizedSlug}`;
  const siteUrl = 'https://nameverse.site';

  const seo = nameData.seo?.seo || nameData.seo || {};
  const pageTitle = seo.title || `${nameData.name} — ${relLabel} Name Meaning & Origin`;
  const pageDescription =
    seo.meta_description ||
    nameData.short_meaning ||
    nameData.meaning ||
    `Meaning and origin of the name ${nameData.name}`;

  const genderKey = normalizeGender(nameData.gender);
  const genLabel = genderKey ? genderLabel(nameData.gender) : 'Unisex';
  const origin = nameData.origin || relLabel;
  const originSlug = originSlugFor(origin);
  const meaning = nameData.short_meaning || nameData.meaning || '';
  const longMeaning = nameData.long_meaning || nameData.editorialOverview || '';
  const pronunciation = nameData.pronunciation?.english || nameData.pronunciation?.ipa || '';
  const luckyNumber = nameData.lucky_number;
  const luckyDay = nameData.lucky_day;
  const luckyColors = Array.isArray(nameData.lucky_colors) ? nameData.lucky_colors : [];
  const luckyStone = nameData.lucky_stone;
  const lifePath = nameData.life_path_number;
  const numerology = nameData.numerology_meaning;
  const popularityScore = nameData.popularity_score ?? '';

  const emotionalTraits = Array.isArray(nameData.emotional_traits) ? nameData.emotional_traits : [];
  const acrosticTraits = Array.isArray(nameData.acrosticTraits) ? nameData.acrosticTraits : [];
  const languages = Array.isArray(nameData.language) ? nameData.language : [];
  const rawSimilarNames = Array.isArray(nameData.similar_sounding_names) ? nameData.similar_sounding_names : [];
  const variations = Array.isArray(nameData.name_variations) ? nameData.name_variations : [];
  const rawRelatedNames = Array.isArray(nameData.related_names) ? nameData.related_names : [];
  const regionData = Array.isArray(nameData.popularity_by_region) ? nameData.popularity_by_region : [];
  const celebrities = Array.isArray(nameData.celebrity_usage) ? nameData.celebrity_usage : [];
  const historyRefs = Array.isArray(nameData.historical_references) ? nameData.historical_references : [];
  const richFaqs = Array.isArray(nameData.richFaqs) ? nameData.richFaqs : [];

  function resolveNameLink(rawName) {
    const targetSlug = slugify(rawName);
    if (!targetSlug) return null;
    if (knownSlugsMap.has(`${finalReligion}:${targetSlug}`)) {
      return { name: rawName, href: `/names/${finalReligion}/${targetSlug}` };
    }
    for (const r of ['islamic', 'christian', 'hindu', 'italian']) {
      if (r !== finalReligion && knownSlugsMap.has(`${r}:${targetSlug}`)) {
        return { name: rawName, href: `/names/${r}/${targetSlug}` };
      }
    }
    return { name: rawName, href: null };
  }

  const resolvedSimilarNames = rawSimilarNames.slice(0, 10).map(resolveNameLink).filter(Boolean);
  const resolvedRelatedNames = rawRelatedNames.slice(0, 10).map(resolveNameLink).filter(Boolean);

  const otherLangs = [
    { key: 'in_arabic', label: 'Arabic', rtl: true },
    { key: 'in_urdu', label: 'Urdu', rtl: true },
    { key: 'in_hindi', label: 'Hindi', rtl: false },
    { key: 'in_pashto', label: 'Pashto', rtl: true },
    { key: 'in_hebrew', label: 'Hebrew', rtl: true },
    { key: 'in_greek', label: 'Greek', rtl: false },
    { key: 'in_latin', label: 'Latin', rtl: false },
    { key: 'in_english', label: 'English', rtl: false },
  ]
    .map((lang) => ({ ...lang, data: nameData[lang.key] }))
    .filter((lang) => lang.data && (lang.data.name || lang.data.meaning));

  function cleanText(s) {
    const t = String(s || '').replace(/[?]{2,}/g, ' ').trim();
    return t.includes('\uFFFD') ? '' : t;
  }

  const firstLetter = nameData.name.trim().charAt(0).toLowerCase();
  const letterSegment = /^[a-z]$/.test(firstLetter) ? firstLetter : '%23';

  // Structured Data (JSON-LD) for rich Google snippets
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
    mainEntity: {
      '@type': 'DefinedTerm',
      name: nameData.name,
      description: meaning,
      inDefinedTermSet: `${siteUrl}/names/${finalReligion}`,
      termCode: normalizedSlug,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}` },
      { '@type': 'ListItem', position: 2, name: 'All Names', item: `${siteUrl}/names` },
      { '@type': 'ListItem', position: 3, name: `${relLabel} Names`, item: `${siteUrl}/names/${finalReligion}` },
      { '@type': 'ListItem', position: 4, name: `Letter ${firstLetter.toUpperCase()}`, item: `${siteUrl}/names/${finalReligion}/letter/${letterSegment}` },
      { '@type': 'ListItem', position: 5, name: nameData.name },
    ],
  };

  const faqSchema =
    richFaqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: richFaqs.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        }
      : null;

  return (
    <div className="container-page py-6 sm:py-10">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="mx-auto max-w-5xl space-y-6">
        {/* Top Native Ad Banner Placement for Maximum Revenue */}
        <NativeAdBanner placement="detail-top" title="Featured Partner" />

        {/* Breadcrumb Navigation */}
        <nav className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-nv-text-secondary" aria-label="Breadcrumb">
          <Link href="/" className="font-medium hover:text-nv-accent transition">Home</Link>
          <span>/</span>
          <Link href="/names" className="font-medium hover:text-nv-accent transition">All Names</Link>
          <span>/</span>
          <Link href={`/names/${finalReligion}`} className="font-medium hover:text-nv-accent transition">{relLabel} Names</Link>
          <span>/</span>
          <Link href={`/names/${finalReligion}/letter/${letterSegment}`} className="font-medium hover:text-nv-accent transition">
            Letter {firstLetter.toUpperCase()}
          </Link>
          <span>/</span>
          <span className="font-medium text-nv-text">{nameData.name}</span>
        </nav>

        {/* Hero Card */}
        <div className="card p-6 sm:p-8 lg:p-10 border border-nv-border/80 shadow-md">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-nv-accent-subtle px-3 py-1 text-xs font-semibold text-nv-accent">
                {relLabel} Name Meaning &amp; Cultural Heritage
              </div>
              <h1 className="break-words font-display text-4xl font-extrabold tracking-tight text-nv-text sm:text-5xl lg:text-6xl">
                {nameData.name}
              </h1>
              {meaning && (
                <p className="mt-3 text-lg font-medium text-nv-text-secondary sm:text-xl leading-relaxed">
                  &ldquo;{meaning}&rdquo;
                </p>
              )}
              {pronunciation && (
                <p className="mt-3 flex items-center gap-2 text-sm text-nv-text-secondary">
                  <span className="font-semibold text-nv-text">Pronunciation:</span>
                  <span className="font-mono text-nv-text">{pronunciation}</span>
                  {nameData.pronunciation?.ipa && <span className="text-nv-text-muted">({nameData.pronunciation.ipa})</span>}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {genderKey === 'boy' && (
                <Link href={`/${finalReligion}-boy-names`} className="rounded-full bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-100 dark:bg-sky-950/60 dark:text-sky-300">
                  ♂ Boy Name
                </Link>
              )}
              {genderKey === 'girl' && (
                <Link href={`/${finalReligion}-girl-names`} className="rounded-full bg-rose-50 px-3.5 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300">
                  ♀ Girl Name
                </Link>
              )}
              {genderKey === 'unisex' && (
                <span className="rounded-full bg-purple-50 px-3.5 py-1.5 text-xs font-semibold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                  ⚥ Unisex Name
                </span>
              )}
              {origin && originSlug ? (
                <Link href={`/origins/${originSlug}`} className="rounded-full border border-nv-border bg-nv-surface px-3.5 py-1.5 text-xs font-semibold text-nv-text-secondary transition hover:border-nv-accent/50 hover:text-nv-accent">
                  {origin} origin
                </Link>
              ) : origin ? (
                <span className="rounded-full border border-nv-border bg-nv-surface px-3.5 py-1.5 text-xs font-semibold text-nv-text-secondary">
                  {origin} origin
                </span>
              ) : null}
              {popularityScore !== '' && (
                <span className="rounded-full border border-nv-border bg-nv-surface px-3.5 py-1.5 text-xs font-semibold text-nv-text-secondary">
                  Popularity: {popularityScore}/100
                </span>
              )}
            </div>
          </div>

          {/* Key Stats Grid */}
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-nv-border bg-nv-subtle/70 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-nv-text-muted">Core Meaning</div>
              <div className="mt-1.5 text-sm font-bold text-nv-text line-clamp-2">{meaning || 'Blessing & Virtue'}</div>
            </div>

            <div className="rounded-2xl border border-nv-border bg-nv-subtle/70 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-nv-text-muted">Origin &amp; Tradition</div>
              <div className="mt-1.5 text-sm font-bold text-nv-text">{origin} &bull; {relLabel}</div>
            </div>

            <div className="rounded-2xl border border-nv-border bg-nv-subtle/70 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-nv-text-muted">Lucky Number</div>
              <div className="mt-1.5 text-2xl font-black text-nv-accent">{luckyNumber}</div>
            </div>

            <div className="rounded-2xl border border-nv-border bg-nv-subtle/70 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-nv-text-muted">Auspicious Day</div>
              <div className="mt-1.5 text-sm font-bold text-nv-text">{luckyDay || 'Sunday'}</div>
            </div>

            <div className="rounded-2xl border border-nv-border bg-nv-subtle/70 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-nv-text-muted">Lucky Gemstone</div>
              <div className="mt-1.5 text-sm font-bold text-nv-text">{luckyStone || 'Moonstone'}</div>
            </div>

            <div className="rounded-2xl border border-nv-border bg-nv-subtle/70 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-nv-text-muted">Life Path Number</div>
              <div className="mt-1.5 text-2xl font-black text-nv-text">{lifePath || 1}</div>
            </div>

            <div className="rounded-2xl border border-nv-border bg-nv-subtle/70 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-nv-text-muted">Syllables / Letters</div>
              <div className="mt-1.5 text-sm font-bold text-nv-text">
                {nameData.syllableCount || 2} Syllables &bull; {nameData.letterCount || nameData.name.length} Letters
              </div>
            </div>

            <div className="rounded-2xl border border-nv-border bg-nv-subtle/70 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-nv-text-muted">Spoken Languages</div>
              <div className="mt-1.5 text-sm font-bold text-nv-text truncate">
                {languages.length > 0 ? languages.join(', ') : 'English, Arabic, Multi-cultural'}
              </div>
            </div>
          </div>

          {/* Lucky Colors */}
          {luckyColors.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-bold uppercase tracking-wide text-nv-text-muted">Auspicious Colors:</span>
              {luckyColors.map((color) => (
                <span key={color} className="rounded-full border border-nv-border bg-nv-surface px-3 py-1 text-xs font-semibold text-nv-text shadow-sm">
                  {color}
                </span>
              ))}
            </div>
          )}

          {/* Social Share Bar */}
          <div className="mt-6 pt-6 border-t border-nv-border flex items-center justify-between">
            <SocialShare title={`Meaning of ${nameData.name} on NameVerse`} url={canonicalUrl} />
          </div>
        </div>

        {/* Meaning & Deep Linguistic Breakdown */}
        <section className="card p-6 sm:p-8">
          <span className="eyebrow">Etymology &amp; Linguistic Heritage</span>
          <h2 className="mt-1 font-display text-2xl font-bold text-nv-text sm:text-3xl">
            What Does the Name {nameData.name} Truly Mean?
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-nv-text-secondary sm:text-lg">
            <p>{longMeaning}</p>
            {nameData.spiritual_meaning && (
              <p className="rounded-xl border border-nv-border/80 bg-nv-subtle/50 p-4 text-base italic text-nv-text">
                &ldquo;{nameData.spiritual_meaning}&rdquo;
              </p>
            )}
          </div>
        </section>

        {/* Acrostic Personality Ladder & Character Breakdown */}
        {acrosticTraits.length > 0 && (
          <section className="card p-6 sm:p-8">
            <span className="eyebrow">Personality Archetype</span>
            <h2 className="mt-1 font-display text-2xl font-bold text-nv-text sm:text-3xl">
              Hidden Personality Traits of {nameData.name}
            </h2>
            <p className="mt-2 text-sm text-nv-text-secondary">
              An acrostic virtue ladder revealing the energetic qualities encoded into each letter of {nameData.name}:
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {acrosticTraits.map((trait, idx) => {
                const parts = trait.split('=');
                const letter = parts[0]?.trim() || '';
                const desc = parts[1]?.trim() || trait;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 rounded-2xl border border-nv-border bg-nv-subtle/40 p-3.5 transition hover:border-nv-accent/40"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-nv-accent text-white font-display text-lg font-bold shadow-sm">
                      {letter}
                    </div>
                    <span className="text-sm font-semibold text-nv-text leading-snug">
                      {desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Mid-content Native Ad Banner */}
        <Ad placement="inline" />

        {/* Transliterations & Multi-Language Scripts in Depth */}
        {otherLangs.length > 0 && (
          <section className="card p-6 sm:p-8">
            <span className="eyebrow">Global Alphabets</span>
            <h2 className="mt-1 font-display text-2xl font-bold text-nv-text sm:text-3xl">
              {nameData.name} in World Scripts &amp; Languages
            </h2>
            <p className="mt-2 text-sm text-nv-text-secondary">
              Authentic calligraphy, original alphabet renderings, and local cultural interpretations:
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {otherLangs.map((lang) => (
                <div key={lang.key} className="rounded-2xl border border-nv-border bg-nv-subtle/50 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-nv-text-muted">
                      {lang.label} Tradition
                    </span>
                    <span className="text-xs text-nv-accent font-semibold">Verified Script</span>
                  </div>
                  <div className="mt-3 text-2xl font-bold text-nv-text" dir={lang.rtl ? 'rtl' : 'ltr'}>
                    {lang.data.name || nameData.name}
                  </div>
                  {cleanText(lang.data.meaning) && (
                    <div className="mt-2 text-sm font-semibold text-nv-text">
                      {cleanText(lang.data.meaning)}
                    </div>
                  )}
                  {cleanText(lang.data.long_meaning) && cleanText(lang.data.long_meaning) !== cleanText(lang.data.meaning) && (
                    <p className="mt-2 text-xs leading-relaxed text-nv-text-secondary" dir={lang.rtl ? 'rtl' : 'ltr'}>
                      {cleanText(lang.data.long_meaning)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Scriptural Roots & Historical Heritage */}
        {(nameData.biblical_reference?.is_biblical ||
          nameData.saint_reference?.is_saint_name ||
          nameData.islamic_reference?.is_quranic ||
          nameData.islamic_reference?.note ||
          historyRefs.length > 0) && (
          <section className="card p-6 sm:p-8">
            <span className="eyebrow">Sacred &amp; Historical Roots</span>
            <h2 className="mt-1 font-display text-2xl font-bold text-nv-text sm:text-3xl">
              Historical &amp; Spiritual Canon for {nameData.name}
            </h2>
            <div className="mt-5 space-y-4">
              {nameData.islamic_reference && (
                <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                    {nameData.islamic_reference.is_quranic ? '📖 Quranic Heritage' : '🕌 Traditional Islamic Heritage'}
                  </div>
                  <p className="mt-1 text-sm text-emerald-900/80 dark:text-emerald-200/80">
                    {nameData.islamic_reference.note || 'A revered name bearing deep spiritual resonance in Islamic history and prophetic traditions.'}
                    {nameData.islamic_reference.surah && ` (Mentioned in Surah ${nameData.islamic_reference.surah}${nameData.islamic_reference.ayah ? `, Ayah ${nameData.islamic_reference.ayah}` : ''})`}
                  </p>
                </div>
              )}

              {nameData.biblical_reference && nameData.biblical_reference.is_biblical && (
                <div className="rounded-2xl border border-indigo-200/60 bg-indigo-50/50 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/20">
                  <div className="font-bold text-indigo-800 dark:text-indigo-300 text-sm">
                    ✝ Biblical Scripture
                  </div>
                  <p className="mt-1 text-sm text-indigo-900/80 dark:text-indigo-200/80">
                    {nameData.biblical_reference.origin_scripture || 'Biblical name recorded in holy scripture.'}{' '}
                    {nameData.biblical_reference.verse_reference && `(${nameData.biblical_reference.verse_reference})`}
                  </p>
                </div>
              )}

              {nameData.saint_reference && nameData.saint_reference.saint_name && (
                <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                  <div className="font-bold text-amber-800 dark:text-amber-300 text-sm">
                    🕊 Saint Connection
                  </div>
                  <p className="mt-1 text-sm text-amber-900/80 dark:text-amber-200/80">
                    Named in honor of {nameData.saint_reference.saint_name}.
                  </p>
                </div>
              )}

              {historyRefs.map((ref, idx) => (
                <div key={idx} className="rounded-2xl border border-nv-border bg-nv-subtle/50 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-nv-accent">
                    <span>{ref.time_period || 'Historical Record'}</span>
                    <span>&bull;</span>
                    <span>{ref.context || 'Heritage'}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-nv-text leading-relaxed">{ref.reference}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2-Column Grid: Numerology & Multi-Lingual Pronunciation */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Numerology Matrix */}
          <section className="card p-6 sm:p-8">
            <span className="eyebrow">Numerology Profile</span>
            <h2 className="mt-1 font-display text-xl font-bold text-nv-text sm:text-2xl">
              Astrological &amp; Life Path Number {luckyNumber}
            </h2>
            <div className="mt-4 space-y-3">
              <p className="text-sm leading-relaxed text-nv-text-secondary">{numerology}</p>
              {emotionalTraits.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-nv-text-muted">Associated Virtues:</span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {emotionalTraits.map((trait) => (
                      <span key={trait} className="rounded-full border border-nv-border bg-nv-surface px-3 py-1 text-xs font-semibold text-nv-text shadow-sm">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Pronunciation Matrix */}
          <section className="card p-6 sm:p-8">
            <span className="eyebrow">Spoken Phonetics</span>
            <h2 className="mt-1 font-display text-xl font-bold text-nv-text sm:text-2xl">
              How to Pronounce {nameData.name}
            </h2>
            <div className="mt-4 space-y-3">
              {nameData.pronunciation?.english && (
                <div className="rounded-xl border border-nv-border bg-nv-subtle/60 p-3">
                  <div className="text-xs text-nv-text-muted">English pronunciation</div>
                  <div className="mt-1 font-mono text-base font-bold text-nv-text">{nameData.pronunciation.english}</div>
                </div>
              )}
              {nameData.pronunciation?.ipa && (
                <div className="rounded-xl border border-nv-border bg-nv-subtle/60 p-3">
                  <div className="text-xs text-nv-text-muted">International Phonetic Alphabet (IPA)</div>
                  <div className="mt-1 font-mono text-base font-bold text-nv-text">{nameData.pronunciation.ipa}</div>
                </div>
              )}
              {nameData.pronunciation?.urdu && (
                <div className="rounded-xl border border-nv-border bg-nv-subtle/60 p-3">
                  <div className="text-xs text-nv-text-muted">Urdu pronunciation</div>
                  <div className="mt-1 text-base font-bold text-nv-text" dir="rtl">{nameData.pronunciation.urdu}</div>
                </div>
              )}
              {nameData.pronunciation?.hindi && (
                <div className="rounded-xl border border-nv-border bg-nv-subtle/60 p-3">
                  <div className="text-xs text-nv-text-muted">Hindi pronunciation</div>
                  <div className="mt-1 text-base font-bold text-nv-text">{nameData.pronunciation.hindi}</div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Celebrity & Real Life Story Section */}
        {(celebrities.length > 0 || nameData.name_in_real_life) && (
          <section className="card p-6 sm:p-8">
            <span className="eyebrow">Real World Prominence</span>
            <h2 className="mt-1 font-display text-2xl font-bold text-nv-text sm:text-3xl">
              Notable Figures &amp; Real-Life Namesakes
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {celebrities.length > 0 && (
                <div className="rounded-2xl border border-nv-border bg-nv-subtle/40 p-5">
                  <div className="text-xs font-bold uppercase tracking-wider text-nv-text-muted mb-3">
                    Famous Personalities
                  </div>
                  <ul className="space-y-2.5">
                    {celebrities.map((c, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm font-semibold text-nv-text">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-nv-accent text-white text-[10px]">✓</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {nameData.name_in_real_life && (
                <div className="rounded-2xl border border-nv-border bg-nv-subtle/40 p-5">
                  <div className="text-xs font-bold uppercase tracking-wider text-nv-text-muted mb-2">
                    Inspiration Story &bull; {nameData.name_in_real_life.location || 'Global'}
                  </div>
                  <div className="font-display text-base font-bold text-nv-text">
                    {nameData.name_in_real_life.person_name}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-nv-text-secondary italic">
                    &ldquo;{nameData.name_in_real_life.story}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Spiritual Symbolism & Cultural Impact */}
        {(nameData.spiritual_symbolism || nameData.cultural_impact) && (
          <section className="card p-6 sm:p-8">
            <span className="eyebrow">Sacred Archetypes</span>
            <h2 className="mt-1 font-display text-2xl font-bold text-nv-text sm:text-3xl">
              Spiritual Symbolism &amp; Cultural Impact
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-nv-text-secondary sm:text-base">
              {nameData.spiritual_symbolism && <p>{cleanText(nameData.spiritual_symbolism)}</p>}
              {nameData.cultural_impact && <p>{cleanText(nameData.cultural_impact)}</p>}
            </div>
          </section>
        )}

        {/* Popularity by Region Table */}
        {regionData.length > 0 && (
          <section className="card p-6 sm:p-8">
            <span className="eyebrow">Global Registry Data</span>
            <h2 className="mt-1 font-display text-2xl font-bold text-nv-text sm:text-3xl">
              Popularity of {nameData.name} by Region
            </h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-nv-border text-nv-text-muted text-xs uppercase tracking-wider">
                    <th className="pb-3 font-bold">Region</th>
                    <th className="pb-3 font-bold">Country Code</th>
                    <th className="pb-3 font-bold">Search Score</th>
                    <th className="pb-3 font-bold">Registry Year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-nv-border/50 text-nv-text-secondary">
                  {regionData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-nv-subtle/40 transition">
                      <td className="py-3 font-semibold text-nv-text">{item.region}</td>
                      <td className="py-3 font-mono">{item.country_code || '—'}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-nv-text">{item.score ?? '—'}</span>
                          {item.score && (
                            <div className="h-1.5 w-16 rounded-full bg-nv-border overflow-hidden">
                              <div className="h-full bg-nv-accent" style={{ width: `${item.score}%` }} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 font-mono">{item.year ?? '2026'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Spelling Variations & Similar Names */}
        {(variations.length > 0 || resolvedSimilarNames.length > 0 || resolvedRelatedNames.length > 0) && (
          <section className="card p-6 sm:p-8">
            <span className="eyebrow">Etymological Relatives</span>
            <h2 className="mt-1 font-display text-2xl font-bold text-nv-text sm:text-3xl">
              Names Related to {nameData.name}
            </h2>

            {variations.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-nv-text-muted">
                  Spelling Variations
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {variations.map((v) => (
                    <span key={v} className="rounded-full border border-nv-border bg-nv-surface px-4 py-1.5 text-xs font-semibold text-nv-text">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {resolvedSimilarNames.length > 0 && (
              <div className="mt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-nv-text-muted">
                  Similar Sounding Names
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {resolvedSimilarNames.map((s, idx) =>
                    s.href ? (
                      <Link
                        key={idx}
                        href={s.href}
                        className="rounded-full border border-nv-border bg-nv-surface px-3.5 py-1.5 text-xs font-semibold text-nv-accent transition hover:bg-nv-accent-subtle"
                      >
                        {s.name}
                      </Link>
                    ) : (
                      <span key={idx} className="rounded-full border border-nv-border bg-nv-surface px-3.5 py-1.5 text-xs font-semibold text-nv-text-secondary">
                        {s.name}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            {resolvedRelatedNames.length > 0 && (
              <div className="mt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-nv-text-muted">
                  Thematically Linked Names
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {resolvedRelatedNames.map((s, idx) =>
                    s.href ? (
                      <Link
                        key={idx}
                        href={s.href}
                        className="rounded-full border border-nv-border bg-nv-surface px-3.5 py-1.5 text-xs font-semibold text-nv-accent transition hover:bg-nv-accent-subtle"
                      >
                        {s.name}
                      </Link>
                    ) : (
                      <span key={idx} className="rounded-full border border-nv-border bg-nv-surface px-3.5 py-1.5 text-xs font-semibold text-nv-text-secondary">
                        {s.name}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Comprehensive FAQs Section */}
        {richFaqs.length > 0 && (
          <section className="card p-6 sm:p-8">
            <span className="eyebrow">Frequently Asked Questions</span>
            <h2 className="mt-1 font-display text-2xl font-bold text-nv-text sm:text-3xl">
              Common Questions About {nameData.name}
            </h2>
            <div className="mt-5 space-y-3">
              {richFaqs.map((item, idx) => (
                <details
                  key={idx}
                  className="group rounded-2xl border border-nv-border bg-nv-surface transition hover:border-nv-accent/40"
                  open={idx === 0}
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 font-semibold text-nv-text hover:text-nv-accent transition">
                    <span className="flex-1 font-display text-base sm:text-lg">{item.q}</span>
                    <span className="text-nv-text-muted transition-transform duration-200 group-open:rotate-180">
                      &darr;
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm sm:text-base leading-relaxed text-nv-text-secondary border-t border-nv-border/40 pt-3">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Sibling & Cross Navigation Links */}
        <div className="flex flex-wrap justify-center gap-2 pt-6">
          <Link href={`/names/${finalReligion}/letter/${letterSegment}`} className="btn-ghost text-xs">
            {relLabel} names starting with {firstLetter.toUpperCase()}
          </Link>
          <Link href={`/names/${finalReligion}`} className="btn-ghost text-xs">
            All {relLabel.toLowerCase()} names
          </Link>
          {genderKey && (
            <Link href={`/${finalReligion}-${genderKey === 'boy' ? 'boy' : 'girl'}-names`} className="btn-ghost text-xs">
              {relLabel} {genderKey === 'boy' ? 'Boy' : 'Girl'} names
            </Link>
          )}
          {originSlug && (
            <Link href={`/origins/${originSlug}`} className="btn-ghost text-xs">
              {ORIGIN_LABELS[originSlug] || origin} names
            </Link>
          )}
          <Link href="/search" className="btn-ghost text-xs">
            Search all 42,000+ names
          </Link>
        </div>
      </div>
    </div>
  );
}
