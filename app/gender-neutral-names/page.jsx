import Link from 'next/link';
import { getManifest } from '../../lib/data/names-data.js';
import { getCluster, GENDER_NEUTRAL_NAMES, resolveNames } from '../../lib/data/us-names.js';
import { buildUsPageSchema } from '../../lib/data/us-schema.js';
import { EDITORIAL_FAQ } from '../../lib/data/editorial.js';
import UsPageShell from '../../components/UsPageShell.jsx';
import NameChip from '../../components/NameChip.jsx';
import NameCard from '../../components/NameCard.jsx';

export const revalidate = 2592000; // 30 days

const SITE_URL = 'https://nameverse.site';
const cluster = getCluster('gender-neutral-names');
const PAGE_URL = `${SITE_URL}/${cluster.slug}`;

const TITLE = 'Gender-Neutral Baby Names \u2014 Unisex Picks for 2026';
const DESCRIPTION =
  'Gender-neutral baby names used across genders, with verified meanings and origins. Includes the unisex names in our database plus guidance on how usage shifts between boys and girls over time.';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    type: 'article',
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

// Names our own database records as unisex, ranked by documentation depth.
function selectUnisex(limit = 24) {
  const manifest = getManifest();
  const out = [];
  for (const rel of Object.keys(manifest)) {
    for (const item of manifest[rel] || []) {
      if (!item.slug || !item.meaning) continue;
      if (String(item.gender || '').toLowerCase() !== 'unisex') continue;
      out.push({ ...item, religion: rel });
    }
  }
  out.sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0));
  return out.slice(0, limit);
}

const FAQS = [
  {
    q: 'What is a gender-neutral baby name?',
    a: 'A gender-neutral name is one that is given to boys and girls in meaningful numbers, rather than being strongly associated with one. Some names are neutral by origin, others become neutral over time as usage shifts \u2014 which is why neutrality is a moving property rather than a fixed category.',
  },
  {
    q: 'Do gender-neutral names stay neutral?',
    a: 'Not always. Names often drift toward one gender once they become popular for that gender, and a name that is balanced today can be strongly one-sided a decade later. Checking current usage rather than relying on a name\u2019s reputation is the only reliable approach.',
  },
  {
    q: 'Are unisex names a modern invention?',
    a: 'No. Many names now treated as neutral have centuries of use behind them, and in several traditions names were never gender-marked in the first place. What is modern is the deliberate choice of a neutral name, not the names themselves.',
  },
  {
    q: 'How many gender-neutral names does NameVerse list?',
    a: 'Our database records several hundred names as unisex across the four traditions we cover. The selection on this page shows the best-documented of them; the full set is available through the names directory filtered by unisex usage.',
  },
  ...EDITORIAL_FAQ.slice(0, 2),
];

const BREADCRUMB = [{ name: 'Gender-Neutral Names', href: '/gender-neutral-names' }];

export default function GenderNeutralNamesPage() {
  const curated = resolveNames(GENDER_NEUTRAL_NAMES);
  const unisex = selectUnisex(24);

  const schema = buildUsPageSchema({
    url: PAGE_URL,
    cluster,
    description: DESCRIPTION,
    breadcrumb: BREADCRUMB,
    items: unisex.map((u) => ({
      name: u.name,
      url: `/names/${u.religion}/${u.slug}`,
      description: u.meaning || undefined,
    })),
    faqs: FAQS,
  });

  return (
    <UsPageShell
      cluster={cluster}
      intro="Gender-neutral baby names used across genders, with verified meanings and origins. This page combines a curated list of widely-used unisex names with the names our own database records as unisex, so you can see both the popular choices and the documented ones."
      breadcrumb={BREADCRUMB}
      faqs={FAQS}
      schema={schema}
      cta={
        <>
          <h2 className="font-display text-xl font-bold text-nv-text sm:text-2xl">
            Check how a name is actually used
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-nv-text-secondary">
            Neutrality shifts over time. Every profile shows recorded gender usage alongside the
            meaning and origin, so you can judge the name as it is used now.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/search" className="btn-primary">
              Search unisex names
            </Link>
            <Link href="/names" className="btn-ghost">
              Browse the directory
            </Link>
          </div>
        </>
      }
    >
      <section aria-labelledby="curated-heading">
        <h2
          id="curated-heading"
          className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl"
        >
          Widely-used gender-neutral names
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-nv-text-secondary">
          Names that are given to boys and girls in comparable numbers. Solid chips link to a full
          profile; dashed chips are names we list but do not yet hold a verified profile for.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {curated.map((item) => (
            <NameChip key={item.name} item={item} />
          ))}
        </div>
      </section>

      <section className="mt-14" aria-labelledby="documented-heading">
        <h2
          id="documented-heading"
          className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl"
        >
          Unisex names in our database
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-nv-text-secondary">
          These are the names our own records classify as unisex, ordered by how thoroughly documented
          they are. Each one has a verified meaning, origin and pronunciation guide.
        </p>
        <div className="mt-6 grid gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {unisex.map((item) => (
            <NameCard key={`${item.religion}-${item.slug}`} item={item} showReligion />
          ))}
        </div>
      </section>

      <section className="mt-14" aria-labelledby="shifts-heading">
        <h2
          id="shifts-heading"
          className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl"
        >
          How names drift between genders
        </h2>
        <div className="prose-nv mt-4 max-w-3xl">
          <p>
            Gender association is not a property a name has; it is a pattern in how people use it, and
            patterns move. A name can be evenly split for a generation and then tip decisively one way
            once it becomes fashionable for that gender. The reverse happens too, though less often.
          </p>
          <p>
            This matters practically. If you choose a neutral name because you want it to stay neutral,
            the useful question is not &ldquo;is this name unisex?&rdquo; but &ldquo;which direction is
            its usage moving?&rdquo; A name that is 60/40 today and drifting is a different choice from
            one that has held near 50/50 for decades.
          </p>
          <p>
            The second thing worth knowing is that neutrality is cultural, not universal. A name that is
            firmly one gender in one language can be neutral in another, and families naming across two
            traditions often find that the same name reads differently in each. Our{' '}
            <Link href="/names-by-origin" className="font-semibold text-nv-accent hover:underline">
              names by origin
            </Link>{' '}
            pages are the fastest way to check that.
          </p>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="more-heading">
        <h2
          id="more-heading"
          className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl"
        >
          Related lists
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: '/short-baby-names', label: 'Short baby names', note: 'One and two syllables' },
            { href: '/unique-baby-names', label: 'Unique baby names', note: 'Outside the top 100' },
            { href: '/nature-baby-names', label: 'Nature baby names', note: 'Botanical and celestial' },
            { href: '/top-baby-names-2026', label: 'Top names 2026', note: 'Current rankings' },
            { href: '/names-by-meaning', label: 'Names by meaning', note: 'Search by what it means' },
            { href: '/names', label: 'All 13,801 names', note: 'Full directory' },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="card card-hover p-4">
              <span className="block text-sm font-bold text-nv-text">{l.label}</span>
              <span className="mt-0.5 block text-xs text-nv-text-muted">{l.note}</span>
            </Link>
          ))}
        </div>
      </section>
    </UsPageShell>
  );
}
