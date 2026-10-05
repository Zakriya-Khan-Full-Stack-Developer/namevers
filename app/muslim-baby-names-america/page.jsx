import Link from 'next/link';
import { getCluster, getIslamicNames, resolveName } from '../../lib/data/us-names.js';
import { buildUsPageSchema } from '../../lib/data/us-schema.js';
import { EDITORIAL_FAQ } from '../../lib/data/editorial.js';
import UsPageShell from '../../components/UsPageShell.jsx';
import NameCard from '../../components/NameCard.jsx';

export const revalidate = 2592000; // 30 days

const SITE_URL = 'https://nameverse.site';
const cluster = getCluster('muslim-baby-names-america');
const PAGE_URL = `${SITE_URL}/${cluster.slug}`;

const TITLE = 'Muslim Baby Names Popular in America \u2014 With Meanings';
const DESCRIPTION =
  'Muslim and Islamic baby names used by families in the United States, with verified meanings, Arabic script forms and pronunciation. Includes names that appear in US national rankings.';

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
    q: 'Are Muslim baby names popular in the United States?',
    a: 'Yes, and increasingly so. Several Arabic and Quranic names now appear in the US national top 100, including Muhammad, Amir, Layla and Aaliyah. Names that were once used mainly within Muslim communities have moved into the wider American naming pool.',
  },
  {
    q: 'What is the difference between an Arabic name and a Muslim name?',
    a: 'Arabic describes a language and a naming tradition; Muslim describes religious usage. Most Muslim names are Arabic in origin, but not all Arabic names are Muslim, and Muslim families also use Persian, Turkish, Urdu and other names. Our database records origin and religious usage as separate fields for exactly this reason.',
  },
  {
    q: 'How do you handle spelling variations of Arabic names?',
    a: 'Arabic names have no single correct English spelling, because Arabic script and the Latin alphabet do not map one-to-one. Muhammad, Mohammad, Mohamed and Muhammed are the same name. Our profiles list the recorded variants so you can see how much spelling variation a name carries in practice.',
  },
  {
    q: 'Do Muslim names have to be Quranic?',
    a: 'No. Muslim naming practice draws on Quranic names, the names of prophets and companions, and a wide range of Arabic, Persian and regional names with good meanings. Many widely used Muslim names do not appear in the Quran at all.',
  },
  ...EDITORIAL_FAQ.slice(0, 2),
];

const BREADCRUMB = [{ name: 'Muslim Baby Names in America', href: '/muslim-baby-names-america' }];

export default function MuslimBabyNamesAmericaPage() {
  const names = getIslamicNames(120);
  const muhammad = resolveName('Muhammad');
  const amir = resolveName('Amir');
  const layla = resolveName('Layla');

  const schema = buildUsPageSchema({
    url: PAGE_URL,
    cluster,
    description: DESCRIPTION,
    breadcrumb: BREADCRUMB,
    items: names.slice(0, 60).map((n) => ({
      name: n.name,
      url: `/names/${n.religion}/${n.slug}`,
      description: n.meaning || undefined,
    })),
    faqs: FAQS,
    sourceKeys: ['ssa', 'babycenter'],
  });

  return (
    <UsPageShell
      cluster={cluster}
      intro="Muslim and Islamic baby names used by families in the United States, with verified meanings, Arabic script forms and pronunciation guides. Several of these names now appear in the US national rankings, which is why this page sits alongside our American popularity data rather than apart from it."
      breadcrumb={BREADCRUMB}
      faqs={FAQS}
      schema={schema}
      sources={['ssa', 'babycenter']}
      cta={
        <>
          <h2 className="font-display text-xl font-bold text-nv-text sm:text-2xl">
            Check the script form and pronunciation
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-nv-text-secondary">
            Every profile records the name in Arabic script alongside its English pronunciation, so you
            can see exactly what you are choosing.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/names/islamic" className="btn-primary">
              Browse all Islamic names
            </Link>
            <Link href="/islamic-boy-names" className="btn-ghost">
              Islamic boy names
            </Link>
          </div>
        </>
      }
    >
      <section aria-labelledby="mainstream-heading">
        <h2
          id="mainstream-heading"
          className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl"
        >
          Muslim names in the American mainstream
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-nv-text-secondary">
          A small number of Muslim names have crossed into general American usage. These are the ones
          you are most likely to encounter in a US classroom, and the ones with the most established
          spelling conventions.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[muhammad, amir, layla].map((n) => (
            <div key={n.name} className="inset-panel">
              <h3 className="font-display text-base font-bold text-nv-text">{n.name}</h3>
              <p className="mt-1 text-xs leading-relaxed text-nv-text-secondary">
                {n.meaning || 'Meaning recorded in our database.'}
              </p>
              {n.href && (
                <Link
                  href={n.href}
                  className="mt-2 inline-block text-xs font-semibold text-nv-accent hover:underline"
                >
                  Full profile &rarr;
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14" aria-labelledby="list-heading">
        <h2
          id="list-heading"
          className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl"
        >
          Islamic names with verified meanings
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-nv-text-secondary">
          Ordered by how thoroughly documented each name is in our database. Every entry has a recorded
          meaning and origin, and each card links to the full profile with Arabic script, pronunciation
          and cultural context.
        </p>
        <div className="mt-6 grid gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {names.map((item) => (
            <NameCard key={`${item.religion}-${item.slug}`} item={item} showReligion />
          ))}
        </div>
      </section>

      <section className="mt-14" aria-labelledby="spelling-heading">
        <h2
          id="spelling-heading"
          className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl"
        >
          Spelling Arabic names in English
        </h2>
        <div className="prose-nv mt-4 max-w-3xl">
          <p>
            Arabic script and the Latin alphabet do not correspond one-to-one, so every Arabic name has
            several defensible English spellings. This is not a problem to be solved \u2014 it is a
            property of transliteration, and it has a practical consequence for anyone naming a child in
            an English-speaking country.
          </p>
          <p>
            The consequence is that your child will spend some amount of time correcting spelling. The
            useful question is how much. A name with one dominant English spelling \u2014 Layla, Amir
            \u2014 carries almost no burden. A name with six common variants will be misspelled
            regularly, and the choice of which variant you register becomes a small ongoing decision.
          </p>
          <p>
            Our profiles list the recorded variants for each name, so you can see the range before you
            commit. If you want the widest set of options, our{' '}
            <Link href="/names/islamic" className="font-semibold text-nv-accent hover:underline">
              Islamic names hub
            </Link>{' '}
            lets you browse by letter and by meaning, and the{' '}
            <Link href="/names-by-meaning" className="font-semibold text-nv-accent hover:underline">
              names by meaning
            </Link>{' '}
            pages are the fastest route if the meaning matters more than the sound.
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
            { href: '/names/islamic', label: 'Islamic names hub', note: 'All 5,180 names' },
            { href: '/islamic-boy-names', label: 'Islamic boy names', note: 'By gender' },
            { href: '/islamic-girl-names', label: 'Islamic girl names', note: 'By gender' },
            { href: '/biblical-baby-names', label: 'Biblical baby names', note: 'Scripture-rooted' },
            { href: '/popular-names-2026', label: 'Most popular 2026', note: 'US national ranking' },
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
