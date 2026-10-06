import Link from 'next/link';
import {
  getCluster,
  SSA_TOP_10,
  BABYCENTER_2026,
  resolveNames,
} from '../../lib/data/us-names.js';
import { buildUsPageSchema } from '../../lib/data/us-schema.js';
import { EDITORIAL_FAQ } from '../../lib/data/editorial.js';
import UsPageShell from '../../components/UsPageShell.jsx';
import RankedNameList from '../../components/RankedNameList.jsx';

export const revalidate = 2592000; // 30 days

const SITE_URL = 'https://nameverse.site';
const cluster = getCluster('popular-names-2026');
const PAGE_URL = `${SITE_URL}/${cluster.slug}`;

const TITLE = 'Most Popular Baby Names of 2026 \u2014 US Rankings';
const DESCRIPTION =
  'The most popular baby names of 2026 in the United States, ranked from Social Security Administration birth-record data and cross-checked against BabyCenter. Boys and girls, with meanings and origins.';

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

const FAQS = [
  {
    q: 'What is the most popular baby name of 2026?',
    a: 'Olivia is the most popular girl name and Liam the most popular boy name in the most recent Social Security Administration national ranking, which is compiled from US birth records. BabyCenter\u2019s independent 2026 table also places Olivia first for girls, and ranks Noah first for boys \u2014 a difference explained in the section above.',
  },
  {
    q: 'How is this ranking calculated?',
    a: 'The Social Security Administration counts every name given to at least five babies in a year, using birth records filed for Social Security numbers. Names are ranked by the number of babies given that name, not by survey or search volume. We reproduce that ordering and do not re-rank it.',
  },
  {
    q: 'Why do different websites show different top names?',
    a: 'Because they use different datasets. The SSA list is a census of birth records and is the authoritative source. BabyCenter\u2019s list is built from names registered by parents on its platform, which skews toward a younger, more online audience. Both are shown here so you can see where they agree and where they diverge.',
  },
  {
    q: 'Are these the most popular names in every US state?',
    a: 'No. National rankings hide significant regional variation. Our baby names by state page shows the top boy and girl name in all 50 states and the District of Columbia, along with how each state\u2019s top name changed from the previous year.',
  },
  ...EDITORIAL_FAQ.slice(0, 2),
];

const BREADCRUMB = [{ name: 'Popular Names 2026', href: '/popular-names-2026' }];

export default function PopularNames2026Page() {
  const ssaBoys = resolveNames(SSA_TOP_10.boys);
  const ssaGirls = resolveNames(SSA_TOP_10.girls);
  const bcBoys = resolveNames(BABYCENTER_2026.boys);
  const bcGirls = resolveNames(BABYCENTER_2026.girls);

  const schema = buildUsPageSchema({
    url: PAGE_URL,
    cluster,
    description: DESCRIPTION,
    breadcrumb: BREADCRUMB,
    items: [...bcBoys, ...bcGirls].map((r) => ({
      name: r.name,
      url: r.href,
      description: r.meaning || undefined,
    })),
    faqs: FAQS,
  });

  return (
    <UsPageShell
      cluster={cluster}
      intro="The most popular baby names of 2026 in the United States, ranked from Social Security Administration birth-record data and cross-checked against BabyCenter's independent 2026 table. Every name below is linked to its verified meaning, origin and pronunciation where we hold a profile."
      breadcrumb={BREADCRUMB}
      faqs={FAQS}
      schema={schema}
      cta={
        <>
          <h2 className="font-display text-xl font-bold text-nv-text sm:text-2xl">
            Looking for something less common?
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-nv-text-secondary">
            The top 100 names are given to hundreds of thousands of babies a year. If you want a name your
            child will not share, start with our rare and distinctive picks instead.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/unique-baby-names" className="btn-primary">
              Browse unique baby names
            </Link>
            <Link href="/search" className="btn-ghost">
              Search all 13,801 names
            </Link>
          </div>
        </>
      }
    >
      {/* ── H2: national top 10 ─────────────────────────────────────────── */}
      <section aria-labelledby="top10-heading">
        <h2
          id="top10-heading"
          className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl"
        >
          The national top 10
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-nv-text-secondary">
          The official Social Security Administration ranking, compiled from US birth records. This is the
          authoritative list \u2014 it counts every baby given each name, not a sample.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="mb-3 font-display text-lg font-bold text-nv-text">Top 10 boy names</h3>
            <RankedNameList items={ssaBoys} />
          </div>
          <div>
            <h3 className="mb-3 font-display text-lg font-bold text-nv-text">Top 10 girl names</h3>
            <RankedNameList items={ssaGirls} />
          </div>
        </div>
      </section>

      {/* ── H2: BabyCenter top 40 ───────────────────────────────────────── */}
      <section className="mt-14" aria-labelledby="top40-heading">
        <h2
          id="top40-heading"
          className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl"
        >
          The 2026 top 40, cross-checked
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-nv-text-secondary">
          BabyCenter publishes an independent 2026 ranking built from names registered by parents on its
          platform. It is a useful second opinion: it moves faster than the official census and often
          surfaces a name a year or two before it reaches the national top 10.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="mb-3 font-display text-lg font-bold text-nv-text">Top 40 boy names</h3>
            <RankedNameList items={bcBoys} />
          </div>
          <div>
            <h3 className="mb-3 font-display text-lg font-bold text-nv-text">Top 40 girl names</h3>
            <RankedNameList items={bcGirls} />
          </div>
        </div>
      </section>

      {/* ── H2: why the lists differ ────────────────────────────────────── */}
      <section className="mt-14" aria-labelledby="differ-heading">
        <h2
          id="differ-heading"
          className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl"
        >
          Why the two rankings disagree
        </h2>
        <div className="prose-nv mt-4 max-w-3xl">
          <p>
            The two lists above share most of their names but not their order, and the reason is
            methodological rather than a disagreement about facts. The Social Security Administration
            counts birth records \u2014 a complete census of names given in a year. BabyCenter counts names
            registered by parents who use its platform, which is a large but self-selecting group.
          </p>
          <p>
            The practical consequence is that the official list is the better answer to
            &ldquo;what is actually most common&rdquo;, while the platform list is the better answer to
            &ldquo;what are parents choosing right now&rdquo;. Where they diverge \u2014 most visibly at the
            top of the boys&rsquo; list, where the official ranking places <strong>Liam</strong> first and
            BabyCenter places <strong>Noah</strong> first \u2014 we show both rather than picking one and
            presenting it as settled.
          </p>
          <p>
            A third signal worth knowing about: search interest. Names like{' '}
            <strong>Artemis</strong> and <strong>Wren</strong> generate far more search traffic than their
            birth counts would suggest, because people look up names they are considering long before they
            commit. Search volume is a leading indicator; birth records are the lagging confirmation.
          </p>
        </div>
      </section>

      {/* ── H2: what the data shows ─────────────────────────────────────── */}
      <section className="mt-14" aria-labelledby="shows-heading">
        <h2
          id="shows-heading"
          className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl"
        >
          What the 2026 data shows
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="inset-panel">
            <h3 className="text-sm font-bold text-nv-text">Short names are winning</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-nv-text-secondary">
              Two-syllable names ending in a vowel dominate both lists \u2014 Liam, Noah, Mateo, Luca,
              Leo, Mia, Sofia, Luna. They are easy to spell, easy to pronounce across languages, and
              they shorten well.
            </p>
          </div>
          <div className="inset-panel">
            <h3 className="text-sm font-bold text-nv-text">Biblical names are mainstream again</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-nv-text-secondary">
              Elijah, Levi, Ezra, Asher, Isaiah, Josiah and Gabriel all sit inside the top 40 for boys.
              These are not niche choices any more \u2014 they are the centre of the list.
            </p>
          </div>
          <div className="inset-panel">
            <h3 className="text-sm font-bold text-nv-text">Vowel-heavy girls&rsquo; names lead</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-nv-text-secondary">
              Olivia, Amelia, Isabella, Aurora, Eliana and Aria share a soft, open sound. The
              &lsquo;a&rsquo; ending is the single strongest pattern in the girls&rsquo; top 40.
            </p>
          </div>
          <div className="inset-panel">
            <h3 className="text-sm font-bold text-nv-text">Spelling variants split the count</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-nv-text-secondary">
              Sofia and Sophia, Eliana and Elena, Camila and Emilia are separate entries in the official
              count. Combined, several of these pairs would rank higher than either spelling alone.
            </p>
          </div>
        </div>
      </section>

      {/* ── H2: explore further ─────────────────────────────────────────── */}
      <section className="mt-14" aria-labelledby="explore-heading">
        <h2
          id="explore-heading"
          className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl"
        >
          Explore the rankings further
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: '/top-baby-names-2026', label: 'Top baby names 2026', note: 'Boys and girls, ranked' },
            { href: '/baby-names-by-state', label: 'Names by state', note: 'All 50 states + DC' },
            { href: '/unique-baby-names', label: 'Unique baby names', note: 'Rare, meaningful picks' },
            { href: '/vintage-baby-names', label: 'Vintage baby names', note: 'Classics making a comeback' },
            { href: '/gender-neutral-names', label: 'Gender-neutral names', note: 'Used across genders' },
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
