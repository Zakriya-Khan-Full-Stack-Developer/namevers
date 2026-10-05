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
const cluster = getCluster('top-baby-names-2026');
const PAGE_URL = `${SITE_URL}/${cluster.slug}`;

const TITLE = 'Top Baby Names of 2026 \u2014 Boys and Girls';
const DESCRIPTION =
  'The top baby names of 2026 for boys and girls in the United States, ranked from Social Security Administration data. Full top 40 lists with meanings, origins and pronunciation for every name.';

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
    q: 'What are the top baby names of 2026?',
    a: 'For girls, Olivia leads the most recent Social Security Administration national ranking, followed by Charlotte, Emma, Amelia and Sophia. For boys, Liam leads, followed by Noah, Oliver, Theodore and Henry. The full top 40 for each is listed on this page.',
  },
  {
    q: 'What is the most popular boy name in America?',
    a: 'Liam is the most popular boy name in the United States in the most recent official ranking, compiled from Social Security Administration birth records. Noah is second. BabyCenter\u2019s independent 2026 table reverses those two, which is a difference in dataset rather than a disagreement about the underlying data.',
  },
  {
    q: 'What is the most popular girl name in America?',
    a: 'Olivia is the most popular girl name in the United States, and it has held the top position for several consecutive years. Charlotte, Emma, Amelia and Sophia complete the top five in the official ranking.',
  },
  {
    q: 'How many baby names are in the top 100?',
    a: 'The Social Security Administration publishes a top 1,000 for each gender each year, counting every name given to at least five babies. The top 100 accounts for a large share of all births, which is why the same names recur across states.',
  },
  ...EDITORIAL_FAQ.slice(0, 2),
];

const BREADCRUMB = [{ name: 'Top Baby Names 2026', href: '/top-baby-names-2026' }];

export default function TopBabyNames2026Page() {
  const ssaBoys = resolveNames(SSA_TOP_10.boys);
  const ssaGirls = resolveNames(SSA_TOP_10.girls);
  const bcBoys = resolveNames(BABYCENTER_2026.boys);
  const bcGirls = resolveNames(BABYCENTER_2026.girls);

  const schema = buildUsPageSchema({
    url: PAGE_URL,
    cluster,
    description: DESCRIPTION,
    breadcrumb: BREADCRUMB,
    items: [...ssaBoys, ...ssaGirls].map((r) => ({
      name: r.name,
      url: r.href,
      description: r.meaning || undefined,
    })),
    faqs: FAQS,
  });

  return (
    <UsPageShell
      cluster={cluster}
      intro="The top baby names of 2026 for boys and girls in the United States, ranked from Social Security Administration birth-record data. Each name links to its verified meaning, origin, pronunciation and cultural context."
      breadcrumb={BREADCRUMB}
      faqs={FAQS}
      schema={schema}
      cta={
        <>
          <h2 className="font-display text-xl font-bold text-nv-text sm:text-2xl">
            Find the name that fits your family
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-nv-text-secondary">
            Filter 13,801 names by tradition, gender, origin and meaning \u2014 or start from a curated
            shortlist.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/search" className="btn-primary">
              Search all names
            </Link>
            <Link href="/names-by-meaning" className="btn-ghost">
              Browse by meaning
            </Link>
          </div>
        </>
      }
    >
      <section aria-labelledby="boys-heading">
        <h2
          id="boys-heading"
          className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl"
        >
          Top boy names of 2026
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-nv-text-secondary">
          The official top 10 first, then the wider top 40 from BabyCenter&rsquo;s independent 2026 table.
          Ranks are the sources&rsquo; own \u2014 we do not re-rank.
        </p>

        <h3 className="mb-3 mt-6 font-display text-lg font-bold text-nv-text">
          Official top 10 boy names
        </h3>
        <RankedNameList items={ssaBoys} />

        <h3 className="mb-3 mt-10 font-display text-lg font-bold text-nv-text">
          Top 40 boy names, 2026
        </h3>
        <RankedNameList items={bcBoys} />
      </section>

      <section className="mt-14" aria-labelledby="girls-heading">
        <h2
          id="girls-heading"
          className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl"
        >
          Top girl names of 2026
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-nv-text-secondary">
          Olivia has held the top spot for several consecutive years. The wider list shows how much
          movement there is below the top five.
        </p>

        <h3 className="mb-3 mt-6 font-display text-lg font-bold text-nv-text">
          Official top 10 girl names
        </h3>
        <RankedNameList items={ssaGirls} />

        <h3 className="mb-3 mt-10 font-display text-lg font-bold text-nv-text">
          Top 40 girl names, 2026
        </h3>
        <RankedNameList items={bcGirls} />
      </section>

      <section className="mt-14" aria-labelledby="reading-heading">
        <h2
          id="reading-heading"
          className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl"
        >
          How to read a top-names list
        </h2>
        <div className="prose-nv mt-4 max-w-3xl">
          <p>
            A ranking tells you how many babies received a name, not how good the name is. The most
            useful thing a top-100 list does is tell you what your child will encounter at school. If
            three other children in the same year share the name, that is a social fact worth knowing
            before you commit.
          </p>
          <p>
            The second useful thing is the shape of the list. When the same sound pattern repeats across
            twenty entries \u2014 the open &lsquo;a&rsquo; ending for girls, the two-syllable vowel ending
            for boys \u2014 that is a trend with momentum, and a name that sits just outside the top 100
            today is often inside it within three years.
          </p>
          <p>
            If you want a name that is recognisable but not crowded, the productive zone is roughly ranks
            150 to 500: common enough that people can spell it, rare enough that your child will not be
            one of four. Our <Link href="/unique-baby-names" className="font-semibold text-nv-accent hover:underline">unique baby names</Link>{' '}
            page is built for exactly that search.
          </p>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="more-heading">
        <h2
          id="more-heading"
          className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl"
        >
          More 2026 name lists
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: '/popular-names-2026', label: 'Most popular names 2026', note: 'Full ranking analysis' },
            { href: '/baby-names-by-state', label: 'Names by state', note: 'Regional top names' },
            { href: '/vintage-baby-names', label: 'Vintage names', note: 'Classics returning' },
            { href: '/biblical-baby-names', label: 'Biblical names', note: 'Scripture-rooted picks' },
            { href: '/nature-baby-names', label: 'Nature names', note: 'Botanical and celestial' },
            { href: '/short-baby-names', label: 'Short names', note: 'One and two syllables' },
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
