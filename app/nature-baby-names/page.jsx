import Link from 'next/link';
import { getCluster, NATURE_NAMES, resolveNames, coverage } from '../../lib/data/us-names.js';
import { buildUsPageSchema } from '../../lib/data/us-schema.js';
import { EDITORIAL_FAQ } from '../../lib/data/editorial.js';
import UsPageShell from '../../components/UsPageShell.jsx';
import NameChip from '../../components/NameChip.jsx';

export const revalidate = 2592000; // 30 days

const SITE_URL = 'https://nameverse.site';
const cluster = getCluster('nature-baby-names');
const PAGE_URL = `${SITE_URL}/${cluster.slug}`;

const TITLE = 'Nature Baby Names \u2014 Botanical, Celestial and Earth Names';
const DESCRIPTION =
  'Nature baby names drawn from plants, trees, weather, landscapes and the night sky, with verified meanings and origins. Includes botanical, celestial and earth-name groups.';

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
    q: 'What are nature baby names?',
    a: 'Nature names are drawn from the natural world \u2014 plants, trees, flowers, weather, landscapes, seasons and celestial bodies. They range from long-established names such as Rose, Hazel and Iris to modern choices such as Wren, Juniper and Atlas.',
  },
  {
    q: 'Are nature names suitable for boys and girls?',
    a: 'Many are used across genders. Botanical names skew toward girls in current US usage, while landscape and celestial names skew toward boys, but the split is not fixed and several names \u2014 Rowan, Sage, River, Wren \u2014 are genuinely neutral.',
  },
  {
    q: 'Do nature names have meanings beyond the obvious?',
    a: 'Often, yes. Many plant and tree names carry symbolic associations that predate their use as names, and several have separate documented meanings in different traditions. Our profiles record the meaning we hold for each name rather than assuming the literal plant name is the whole story.',
  },
  {
    q: 'Which nature names are rising fastest?',
    a: 'Short, soft botanical names and celestial names have moved fastest \u2014 Wren, Juniper, Nova, Luna, Aurora. Longer botanical names such as Magnolia and Camellia remain comparatively rare, which makes them the better choice if you want a nature name that is not already common.',
  },
  ...EDITORIAL_FAQ.slice(0, 2),
];

const BREADCRUMB = [{ name: 'Nature Baby Names', href: '/nature-baby-names' }];

export default function NatureBabyNamesPage() {
  const resolved = resolveNames(NATURE_NAMES);
  const cov = coverage(NATURE_NAMES);

  const schema = buildUsPageSchema({
    url: PAGE_URL,
    cluster,
    description: DESCRIPTION,
    breadcrumb: BREADCRUMB,
    items: resolved.map((r) => ({ name: r.name, url: r.href, description: r.meaning || undefined })),
    faqs: FAQS,
    sourceKeys: ['ssa', 'babycenter', 'nameberry'],
  });

  return (
    <UsPageShell
      cluster={cluster}
      intro="Nature baby names drawn from plants, trees, weather, landscapes and the night sky. Every name below links to its verified meaning and origin where we hold a profile, so you can check what a name actually means rather than assuming the literal reading."
      breadcrumb={BREADCRUMB}
      faqs={FAQS}
      schema={schema}
      sources={['ssa', 'babycenter', 'nameberry']}
      cta={
        <>
          <h2 className="font-display text-xl font-bold text-nv-text sm:text-2xl">
            Find a nature name that is not already common
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-nv-text-secondary">
            The best-known nature names are now crowded. Our unique names page filters for picks that
            sit outside the US top 100.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/unique-baby-names" className="btn-primary">
              Browse unique names
            </Link>
            <Link href="/names-by-meaning" className="btn-ghost">
              Browse by meaning
            </Link>
          </div>
        </>
      }
    >
      <section aria-labelledby="list-heading">
        <h2
          id="list-heading"
          className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl"
        >
          Nature names by group
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-nv-text-secondary">
          {cov.linked} of these {cov.total} names have a full profile in our database. Solid chips link
          to the profile; dashed chips are names we list but do not yet hold a verified record for.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {resolved.map((item) => (
            <NameChip key={item.name} item={item} />
          ))}
        </div>
      </section>

      <section className="mt-14" aria-labelledby="groups-heading">
        <h2
          id="groups-heading"
          className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl"
        >
          Four families of nature name
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="inset-panel">
            <h3 className="text-sm font-bold text-nv-text">Botanical</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-nv-text-secondary">
              Flowers, plants and trees \u2014 Rose, Iris, Hazel, Juniper, Magnolia, Rowan. The oldest
              and most established group, with the deepest symbolic associations.
            </p>
          </div>
          <div className="inset-panel">
            <h3 className="text-sm font-bold text-nv-text">Celestial</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-nv-text-secondary">
              Stars, moons and constellations \u2014 Luna, Nova, Aurora, Stella, Orion, Lyra. The
              fastest-growing group, and the one with the strongest mythological layer.
            </p>
          </div>
          <div className="inset-panel">
            <h3 className="text-sm font-bold text-nv-text">Landscape</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-nv-text-secondary">
              Terrain and place \u2014 Sierra, Savannah, Aspen, Ridge, Heath, Dale. Often the most
              neutral group, and the least likely to be read as a plant name.
            </p>
          </div>
          <div className="inset-panel">
            <h3 className="text-sm font-bold text-nv-text">Elemental</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-nv-text-secondary">
              Weather, seasons and materials \u2014 Winter, Summer, Ember, Onyx, Jade, Pearl. Short,
              strong and usually unisex.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="choosing-heading">
        <h2
          id="choosing-heading"
          className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl"
        >
          Choosing a nature name
        </h2>
        <div className="prose-nv mt-4 max-w-3xl">
          <p>
            Nature names have an unusual property: their literal meaning is visible to everyone. That
            makes them easy to explain and hard to hide. A child named Juniper will be asked about the
            tree; a child named Atlas will be asked about the myth. Neither is a problem, but it is a
            different experience from a name whose meaning is buried in etymology.
          </p>
          <p>
            The second thing to weigh is how crowded the group has become. Botanical and celestial names
            have moved into the mainstream quickly, and several of the most attractive options are now
            common. If rarity matters, the productive zone is the longer botanical names and the less
            familiar constellations \u2014 Magnolia, Camellia, Zinnia, Corvus, Aquila.
          </p>
          <p>
            Finally, check the name&rsquo;s documented meaning rather than assuming it. Several nature
            names carry a traditional meaning that differs from the literal reading, and a few have
            distinct meanings in different traditions. Our{' '}
            <Link href="/names-by-meaning" className="font-semibold text-nv-accent hover:underline">
              names by meaning
            </Link>{' '}
            pages let you search on the meaning rather than the sound.
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
            { href: '/unique-baby-names', label: 'Unique baby names', note: 'Outside the top 100' },
            { href: '/vintage-baby-names', label: 'Vintage baby names', note: 'Classics returning' },
            { href: '/gender-neutral-names', label: 'Gender-neutral names', note: 'Used across genders' },
            { href: '/short-baby-names', label: 'Short baby names', note: 'One and two syllables' },
            { href: '/top-baby-names-2026', label: 'Top names 2026', note: 'Current rankings' },
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
