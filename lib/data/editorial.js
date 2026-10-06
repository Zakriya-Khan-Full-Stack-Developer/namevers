// ─────────────────────────────────────────────────────────────────────────────
// Editorial identity, sourcing and methodology.
//
// E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) is the
// single biggest lever on a reference site like this one. Google's quality
// raters look for four concrete things on a page, and this module supplies all
// four in one place so every US page renders them identically:
//
//   1. WHO wrote it        → AUTHOR / REVIEWER (a named entity, not "admin")
//   2. WHEN it changed     → LAST_UPDATED (a real date, not a build timestamp)
//   3. HOW the data is made→ METHODOLOGY (the actual pipeline, stated plainly)
//   4. WHERE facts come from→ SOURCES (named, linked, dated)
//
// ⚠️  OWNER ACTION REQUIRED — see REVIEWER below.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE_URL = 'https://nameverse.site';

// ── 1. Authorship ────────────────────────────────────────────────────────────
// The publishing entity. This is the organisation that stands behind the data.
export const PUBLISHER = {
  name: 'NameVerse',
  url: SITE_URL,
  logo: `${SITE_URL}/nameverse_logo_emblem.webp`,
  email: 'hello@nameverse.site',
};

// The byline shown on every editorial page.
//
// ⚠️  REPLACE THIS WITH A REAL, NAMED PERSON BEFORE LAUNCH.
// Google's E-E-A-T guidance is explicit that author expertise must be
// verifiable. A named editor with a linked bio page is the difference between
// a page that can rank for competitive US terms and one that cannot. The
// structure below is complete — only the identity fields need real values.
export const AUTHOR = {
  name: 'NameVerse Editorial Team',
  role: 'Naming research and data editorial',
  // A short, factual statement of what qualifies this byline to write about
  // names. Keep it concrete: what data is used, what the process is.
  credentials:
    'Compiles and verifies given-name data against national statistical registries and published naming references.',
  bioUrl: `${SITE_URL}/editorial-policy`,
  // Set to a real person's name once one is appointed. Until then the
  // organisation is the author, which is weaker but honest.
  isOrganisation: true,
};

// Optional expert reviewer. Leave `name` null to omit the reviewer line
// entirely — an empty reviewer slot is better than a fabricated one.
export const REVIEWER = {
  name: null, // e.g. 'Dr. A. Rahman, PhD Linguistics'
  credentials: null,
  bioUrl: null,
};

// ── 2. Freshness ─────────────────────────────────────────────────────────────
// A fixed, human-set date. Deliberately NOT `new Date()`: a build timestamp
// that changes on every deploy is a freshness signal Google learns to ignore,
// and it makes the "last updated" claim meaningless to a reader.
export const LAST_UPDATED = '2026-10-05';
export const LAST_UPDATED_LABEL = 'October 5, 2026';

// ── 3. Methodology ───────────────────────────────────────────────────────────
// Stated plainly, in the order the work actually happens. This is what
// separates a reference page from an aggregator.
export const METHODOLOGY = {
  title: 'How we compile and verify name data',
  intro:
    'Every figure on this page is traceable to a named source. We do not estimate, interpolate or round popularity data, and we do not publish a name profile until it carries a documented meaning and origin.',
  steps: [
    {
      title: 'National ranking data',
      body: 'Rankings are taken from the Social Security Administration national baby-name dataset, which is compiled from US birth records, and cross-checked against published 2026 ranking tables from BabyCenter. Where the two disagree we show both and say so.',
    },
    {
      title: 'Name profiles',
      body: 'Each of the 13,801 name profiles in the NameVerse database is built from a structured record containing meaning, origin, gender usage, script forms and pronunciation. Records missing a meaning or an origin are excluded from the index and from our sitemaps rather than published as thin pages.',
    },
    {
      title: 'Editorial review',
      body: 'Composed prose is generated from each record\u2019s own fields and then reviewed for accuracy. Belief-based associations \u2014 numerology, lucky numbers, letter symbolism \u2014 are labelled as traditional throughout and are never presented as linguistic fact.',
    },
    {
      title: 'Corrections',
      body: 'Errors are corrected at the source record, which updates every page that draws on it. Substantive corrections are noted on the editorial policy page.',
    },
  ],
};

// ── 4. Sources ───────────────────────────────────────────────────────────────
// Named, linked, dated. Rendered as a visible list AND as schema.org `citation`
// on the Article node, so the sourcing is machine-readable too.
export const SOURCES = {
  ssa: {
    name: 'Social Security Administration \u2014 Popular Baby Names',
    publisher: 'US Social Security Administration',
    url: 'https://www.ssa.gov/oact/babynames/',
    note: 'National name rankings compiled from US birth records.',
  },
  ssaTop: {
    name: 'SSA \u2014 Top 10 Baby Names',
    publisher: 'US Social Security Administration',
    url: 'https://www.ssa.gov/oact/babynames/index.html',
    note: 'Official national top-10 ranking, most recent release.',
  },
  babycenter: {
    name: 'BabyCenter \u2014 Most Popular Baby Names of 2026',
    publisher: 'BabyCenter',
    url: 'https://www.babycenter.com/baby-names/most-popular/top-baby-names-2026',
    note: 'Independent 2026 ranking table, used to cross-check SSA ordering.',
  },
  wikipedia: {
    name: 'Most popular given names by state in the United States',
    publisher: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/List_of_most_popular_given_names_by_state_in_the_United_States',
    note: 'State-level top-10 tables derived from the SSA state dataset.',
  },
  nameberry: {
    name: 'Nameberry \u2014 Baby Names 2026',
    publisher: 'Nameberry',
    url: 'https://nameberry.com',
    note: 'Used for trend direction and rising-name signals only, never for rankings.',
  },
};

// Convenience: the sources most US pages cite.
export const DEFAULT_SOURCE_KEYS = ['ssa', 'ssaTop', 'babycenter'];

export function resolveSources(keys = DEFAULT_SOURCE_KEYS) {
  return keys.map((k) => SOURCES[k]).filter(Boolean);
}

// ── Shared FAQ copy ──────────────────────────────────────────────────────────
// Reused across US pages so the answers stay consistent and citable.
export const EDITORIAL_FAQ = [
  {
    q: 'Where does NameVerse get its baby name data?',
    a: 'National rankings come from the Social Security Administration baby-name dataset, which is compiled from US birth records, and are cross-checked against BabyCenter\u2019s published 2026 ranking tables. Individual name profiles are built from NameVerse\u2019s own structured database of 13,801 records covering meaning, origin, gender usage, script forms and pronunciation.',
  },
  {
    q: 'How often is this page updated?',
    a: `This page is reviewed and updated when new national ranking data is released, and at minimum once per ranking cycle. The date shown at the top of the page is the date of the last substantive editorial review, not the date the page was last rebuilt.`,
  },
  {
    q: 'Are the lucky numbers and numerology on NameVerse factual?',
    a: 'No, and we label them clearly. Numerology, lucky numbers, lucky days and letter symbolism are traditional belief-based associations. They are presented as cultural context, never as linguistic or scientific fact. Meaning, origin and pronunciation are the fields we treat as factual and verify.',
  },
  {
    q: 'Why do some popular names not have a NameVerse profile?',
    a: 'We only publish a name profile when we hold a documented meaning and origin for it. Names that appear in national rankings but are not yet in our verified database are listed on our ranking pages without a profile link, rather than published as an empty page.',
  },
];

export default {
  PUBLISHER,
  AUTHOR,
  REVIEWER,
  LAST_UPDATED,
  LAST_UPDATED_LABEL,
  METHODOLOGY,
  SOURCES,
  DEFAULT_SOURCE_KEYS,
  resolveSources,
  EDITORIAL_FAQ,
};
