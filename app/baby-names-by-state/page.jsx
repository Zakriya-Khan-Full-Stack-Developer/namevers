import Link from 'next/link';
import { getCluster, STATE_TOP_NAMES, resolveName } from '../../lib/data/us-names.js';
import { buildUsPageSchema } from '../../lib/data/us-schema.js';
import { EDITORIAL_FAQ } from '../../lib/data/editorial.js';
import UsPageShell from '../../components/UsPageShell.jsx';
import StateTable from '../../components/StateTable.jsx';

export const revalidate = 2592000; // 30 days

const SITE_URL = 'https://nameverse.site';
const cluster = getCluster('baby-names-by-state');
const PAGE_URL = `${SITE_URL}/${cluster.slug}`;

const TITLE = 'Most Popular Baby Names by State \u2014 All 50 States';
const DESCRIPTION =
  'The most popular baby names in every US state and the District of Columbia, with the top boy and girl name for each and how it changed from the previous year. Sourced from Social Security Administration state data.';

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

// Derived from the real table rather than asserted, so the numbers on the page
// and the numbers in the prose can never drift apart.
function analyseStates() {
  const boyCounts = new Map();
  const girlCounts = new Map();
  let boyChanges = 0;
  let girlChanges = 0;

  for (const row of STATE_TOP_NAMES) {
    boyCounts.set(row.boy, (boyCounts.get(row.boy) || 0) + 1);
    girlCounts.set(row.girl, (girlCounts.get(row.girl) || 0) + 1);
    if (row.prevBoy && row.prevBoy !== row.boy) boyChanges += 1;
    if (row.prevGirl && row.prevGirl !== row.girl) girlChanges += 1;
  }

  const top = (map) =>
    [...map.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));

  return {
    total: STATE_TOP_NAMES.length,
    boyChanges,
    girlChanges,
    topBoys: top(boyCounts),
    topGirls: top(girlCounts),
  };
}

const FAQS = [
  {
    q: 'What is the most popular baby name in the United States by state?',
    a: 'It depends on the state. Oliver and Liam dominate the boys\u2019 lists, while Charlotte and Olivia dominate the girls\u2019. The table on this page shows the exact top boy and girl name for all 50 states and the District of Columbia.',
  },
  {
    q: 'Do the most popular names differ by state?',
    a: 'Yes, and the differences are larger than the national rankings suggest. Some states have a top name that does not appear in the national top 10 at all, and a handful of states have held the same top name for years while others change annually.',
  },
  {
    q: 'Where does state-level baby name data come from?',
    a: 'The Social Security Administration publishes state-level name data derived from birth records, covering each state and the District of Columbia. It is the same underlying dataset as the national ranking, broken down geographically.',
  },
  {
    q: 'Why do some states share the same top name?',
    a: 'Because the most popular names are popular almost everywhere. A small number of names account for a large share of births nationally, so many states converge on the same top choice. The interesting variation is in the states that break away from that pattern.',
  },
  ...EDITORIAL_FAQ.slice(0, 2),
];

const BREADCRUMB = [{ name: 'Baby Names by State', href: '/baby-names-by-state' }];

export default function BabyNamesByStatePage() {
  const stats = analyseStates();

  const schema = buildUsPageSchema({
    url: PAGE_URL,
    cluster,
    description: DESCRIPTION,
    breadcrumb: BREADCRUMB,
    items: STATE_TOP_NAMES.map((r) => ({
      name: `${r.state}: ${r.boy} and ${r.girl}`,
      description: `Top boy name ${r.boy}, top girl name ${r.girl}.`,
    })),
    faqs: FAQS,
    sourceKeys: ['ssa', 'wikipedia', 'ssaTop'],
  });

  return (
    <UsPageShell
      cluster={cluster}
      intro="The most popular baby names in every US state and the District of Columbia, with the top boy and girl name for each and how it moved from the previous year. National rankings hide most of this variation — the state view is where the real differences show up."
      breadcrumb={BREADCRUMB}
      faqs={FAQS}
      schema={schema}
      sources={['ssa', 'wikipedia', 'ssaTop']}
      cta={
        <>
          <h2 className="font-display text-xl font-bold text-nv-text sm:text-2xl">
            Found a name you like?
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-nv-text-secondary">
            Every name in the table links to its full profile where we hold one — meaning, origin,
            pronunciation and cultural context.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/search" className="btn-primary">
              Search all names
            </Link>
            <Link href="/popular-names-2026" className="btn-ghost">
              See the national ranking
            </Link>
          </div>
        </>
      }
    >
      <section aria-labelledby="table-heading">
        <h2
          id="table-heading"
          className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl"
        >
          Top names in all 50 states and DC
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-nv-text-secondary">
          The &ldquo;change from last year&rdquo; column compares each state&rsquo;s current top name
          against the previous year&rsquo;s. &ldquo;Held&rdquo; means the state&rsquo;s top name did not
          change.
        </p>
        <div className="mt-6">
          <StateTable rows={STATE_TOP_NAMES} resolve={resolveName} />
        </div>
      </section>

      <section className="mt-14" aria-labelledby="patterns-heading">
        <h2
          id="patterns-heading"
          className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl"
        >
          What the state data shows
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="inset-panel">
            <h3 className="text-sm font-bold text-nv-text">A few names dominate</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-nv-text-secondary">
              Across {stats.total} states and DC, only a handful of names take the top spot. The most
              common top boy name is <strong>{stats.topBoys[0]?.name}</strong> ({stats.topBoys[0]?.count}{' '}
              states) and the most common top girl name is{' '}
              <strong>{stats.topGirls[0]?.name}</strong> ({stats.topGirls[0]?.count} states).
            </p>
          </div>
          <div className="inset-panel">
            <h3 className="text-sm font-bold text-nv-text">Girls&rsquo; lists move more</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-nv-text-secondary">
              {stats.girlChanges} of {stats.total} states changed their top girl name from the previous
              year, against {stats.boyChanges} for boys. Girls&rsquo; naming is measurably more volatile
              at the top of the list.
            </p>
          </div>
          <div className="inset-panel">
            <h3 className="text-sm font-bold text-nv-text">Regional character survives</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-nv-text-secondary">
              Some states hold a top name that is not in the national top 10 at all. Those outliers are
              the most useful part of this dataset \u2014 they show where local naming culture is still
              distinct from the national average.
            </p>
          </div>
          <div className="inset-panel">
            <h3 className="text-sm font-bold text-nv-text">Stability is the norm</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-nv-text-secondary">
              Most states keep the same top name year over year. A change at the top is a slow signal,
              not a sudden one \u2014 which is why a name that is climbing is usually visible in the
              wider top 100 long before it reaches number one.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="read-heading">
        <h2
          id="read-heading"
          className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl"
        >
          How to use state data when choosing a name
        </h2>
        <div className="prose-nv mt-4 max-w-3xl">
          <p>
            State data answers a question the national ranking cannot: how common will this name be
            where my child actually grows up? A name sitting at rank 40 nationally can be rank 5 in one
            state, and the difference is large enough to change the experience of having that name.
          </p>
          <p>
            The practical approach is to check the state you expect to raise your child in, then look at
            the wider top 100 for that state rather than only the number-one name. The top name tells
            you what is most common; the shape of the list tells you what is coming.
          </p>
          <p>
            One caveat worth stating plainly: state data is published with a lag, and it reflects births
            rather than current preferences. If you are naming a child now, the state list shows you the
            cohort your child will join, not the choices parents are making this month. For the leading
            indicator, our{' '}
            <Link href="/popular-names-2026" className="font-semibold text-nv-accent hover:underline">
              2026 popularity analysis
            </Link>{' '}
            is the better starting point.
          </p>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="more-heading">
        <h2
          id="more-heading"
          className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl"
        >
          Related pages
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: '/popular-names-2026', label: 'Most popular names 2026', note: 'National ranking' },
            { href: '/top-baby-names-2026', label: 'Top baby names 2026', note: 'Boys and girls' },
            { href: '/unique-baby-names', label: 'Unique baby names', note: 'Outside the top 100' },
            { href: '/vintage-baby-names', label: 'Vintage baby names', note: 'Classics returning' },
            { href: '/names', label: 'All 13,801 names', note: 'Full directory' },
            { href: '/names-by-origin', label: 'Names by origin', note: 'Browse by language' },
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
