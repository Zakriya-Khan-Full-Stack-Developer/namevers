import Link from 'next/link';
import {
  AUTHOR,
  REVIEWER,
  METHODOLOGY,
  SOURCES,
  LAST_UPDATED,
  LAST_UPDATED_LABEL,
  PUBLISHER,
} from '../../lib/data/editorial.js';
import { buildBreadcrumb, buildArticle } from '../../lib/data/us-schema.js';
import JsonLd from '../../components/JsonLd.jsx';
import AdSlot from '../../components/AdSlot.jsx';

export const revalidate = 2592000; // 30 days

const SITE_URL = 'https://nameverse.site';
const PAGE_URL = `${SITE_URL}/editorial-policy`;

const TITLE = 'Editorial Policy \u2014 How We Research and Verify Names';
const DESCRIPTION =
  'How NameVerse compiles, verifies and corrects its baby name data: our sources, our review process, our corrections policy, and how we handle belief-based content such as numerology.';

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
};

const BREADCRUMB = [{ name: 'Editorial Policy', href: '/editorial-policy' }];

const SECTIONS = [
  {
    id: 'who',
    h2: 'Who writes NameVerse',
    body: [
      `${AUTHOR.name} is responsible for the name data published on this site. ${AUTHOR.credentials}`,
      'We are a data and reference publisher, not a medical, legal or religious authority. Where a name has a religious or cultural meaning, we report what the sources record rather than interpreting it ourselves.',
    ],
  },
  {
    id: 'sources',
    h2: 'Our sources',
    body: [
      'Every figure we publish is traceable to a named source. National and state rankings come from the Social Security Administration, which compiles them from US birth records. We cross-check those rankings against independent published tables and show both where they differ.',
      'Individual name profiles are built from our own structured database. Each record carries a meaning, an origin, gender usage, script forms and pronunciation. We do not publish a profile until it carries a documented meaning and origin.',
    ],
  },
  {
    id: 'verification',
    h2: 'How we verify',
    body: [
      'Name records are checked against published naming references before publication. Where a name has more than one documented meaning, we record the one with the strongest sourcing and note the alternative rather than choosing silently.',
      'Our build process runs an automated content check on every deployment. It samples records and fails the build if the composed content is not unique, or if coverage of meaning and origin fields drops below threshold. This prevents thin or duplicated pages from reaching the index.',
    ],
  },
  {
    id: 'belief',
    h2: 'Belief-based content',
    body: [
      'Numerology, lucky numbers, lucky days, lucky stones and letter symbolism are traditional belief-based associations. We label them as such throughout the site and never present them as linguistic or scientific fact.',
      'Meaning, origin, gender usage and pronunciation are the fields we treat as factual and verify. If you see a claim on this site that is not labelled as traditional, it is a claim we are prepared to source.',
    ],
  },
  {
    id: 'corrections',
    h2: 'Corrections',
    body: [
      'Errors are corrected at the source record, which updates every page that draws on it. If you spot an error, write to us and we will investigate it against the sources above.',
      'Substantive corrections are noted on this page. We do not silently rewrite published content.',
    ],
  },
  {
    id: 'ai',
    h2: 'Use of automation',
    body: [
      'We use automation to compose prose from structured records and to check content quality at build time. We do not use automation to invent facts, and we do not publish generated content that is not grounded in a record we hold.',
      'Every page on this site is derived from data we can point to. Where we hold no data for a name, we say so rather than filling the gap.',
    ],
  },
];

export default function EditorialPolicyPage() {
  const schema = [
    buildBreadcrumb([{ name: 'Home', href: '/' }, ...BREADCRUMB]),
    buildArticle({
      url: PAGE_URL,
      headline: TITLE,
      description: DESCRIPTION,
      sourceKeys: Object.keys(SOURCES),
    }),
  ];

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <JsonLd blocks={schema} />

        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-nv-text-muted">
            <li>
              <Link href="/" className="transition hover:text-nv-accent">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="font-semibold text-nv-text-secondary">
                Editorial Policy
              </span>
            </li>
          </ol>
        </nav>

        <header className="mb-10">
          <span className="eyebrow">Trust &amp; transparency</span>
          <h1 className="mt-2 text-balance font-display text-3xl font-bold tracking-tight text-nv-text sm:text-5xl">
            Editorial Policy
          </h1>
          <p className="mt-4 text-pretty text-sm leading-relaxed text-nv-text-secondary sm:text-base">
            How we compile, verify and correct the name data published on NameVerse \u2014 and where the
            limits of that data are.
          </p>
          <p className="mt-4 text-xs text-nv-text-muted">
            Last updated <time dateTime={LAST_UPDATED}>{LAST_UPDATED_LABEL}</time>
          </p>
        </header>

        <AdSlot placement="editorial-policy-top" />

        <div className="space-y-10">
          {SECTIONS.map((s) => (
            <section key={s.id} aria-labelledby={`${s.id}-heading`}>
              <h2
                id={`${s.id}-heading`}
                className="font-display text-xl font-bold tracking-tight text-nv-text sm:text-2xl"
              >
                {s.h2}
              </h2>
              <div className="prose-nv mt-3">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}

          <section aria-labelledby="method-heading">
            <h2
              id="method-heading"
              className="font-display text-xl font-bold tracking-tight text-nv-text sm:text-2xl"
            >
              {METHODOLOGY.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-nv-text-secondary">{METHODOLOGY.intro}</p>
            <div className="mt-5 space-y-4">
              {METHODOLOGY.steps.map((step) => (
                <div key={step.title} className="inset-panel">
                  <h3 className="text-sm font-bold text-nv-text">{step.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-nv-text-secondary">{step.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="sources-heading">
            <h2
              id="sources-heading"
              className="font-display text-xl font-bold tracking-tight text-nv-text sm:text-2xl"
            >
              Sources we cite
            </h2>
            <ul className="mt-4 space-y-3">
              {Object.values(SOURCES).map((s) => (
                <li key={s.url} className="text-sm leading-relaxed">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-nv-accent hover:underline"
                  >
                    {s.name}
                  </a>
                  <span className="text-nv-text-muted">
                    {' '}
                    &mdash; {s.publisher}. {s.note}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="contact-heading">
            <h2
              id="contact-heading"
              className="font-display text-xl font-bold tracking-tight text-nv-text sm:text-2xl"
            >
              Contact
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-nv-text-secondary">
              Corrections and questions go to{' '}
              <a
                href={`mailto:${PUBLISHER.email}`}
                className="font-semibold text-nv-accent hover:underline"
              >
                {PUBLISHER.email}
              </a>
              . We aim to respond to data corrections within five working days.
            </p>
            {REVIEWER.name && (
              <p className="mt-3 text-sm leading-relaxed text-nv-text-secondary">
                Content on this site is reviewed by {REVIEWER.name}. {REVIEWER.credentials}
              </p>
            )}
          </section>
        </div>

        <div className="mt-12 rounded-bento border border-nv-accent/30 bg-nv-accent-subtle/50 p-6">
          <h2 className="font-display text-lg font-bold text-nv-text">Start exploring</h2>
          <p className="mt-2 text-sm text-nv-text-secondary">
            Browse the full directory, or start from a curated list.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/names" className="btn-primary">
              All 13,801 names
            </Link>
            <Link href="/popular-names-2026" className="btn-ghost">
              Most popular 2026
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
