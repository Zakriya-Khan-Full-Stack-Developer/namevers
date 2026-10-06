import Link from 'next/link';
import PageJsonLd from '../../components/PageJsonLd.jsx';
import AdSlot from '../../components/AdSlot.jsx';

export const metadata = {
  title: 'About NameVerse — Our Mission & Editorial Standards',
  description:
    'NameVerse helps parents find meaningful baby names across Islamic, Hindu, Christian and global traditions. Learn about our mission, data and editorial standards.',
  alternates: {
    canonical: 'https://nameverse.site/about',
  },
};

export const revalidate = 2592000; // 30 days

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About NameVerse',
  description:
    'NameVerse helps parents find meaningful baby names across Islamic, Hindu, Christian and global traditions.',
  url: 'https://nameverse.site/about',
  publisher: {
    '@type': 'Organization',
    name: 'NameVerse',
    url: 'https://nameverse.site',
  },
};

export default function AboutPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <PageJsonLd data={aboutJsonLd} />
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <span className="eyebrow">About us</span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-nv-text sm:text-5xl">
            About NameVerse
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-nv-text-secondary">
            NameVerse exists to make one of life&apos;s most personal decisions — naming a child — easier,
            more informed and more respectful of culture and faith.
          </p>
        </header>

        <AdSlot placement="about-top" />

        <div className="space-y-6">
          <section className="card p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-nv-text">Our Mission</h2>
            <p className="mt-3 text-sm leading-relaxed text-nv-text-secondary sm:text-base">
              A name carries meaning, heritage and identity. We built NameVerse so parents can search
              42,000+ names across Islamic, Hindu, Christian and Italian traditions with verified
              meanings, origins, pronunciation guidance and cultural context — all in one fast,
              free, mobile-friendly place.
            </p>
          </section>

          <section className="card p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-nv-text">What Makes Us Different</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-nv-text-secondary sm:text-base">
              <li className="flex gap-3">
                <span className="text-nv-success font-bold">&#10003;</span>
                <span>Verified meanings with linguistic and cultural context, not one-line auto-translations.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-nv-success font-bold">&#10003;</span>
                <span>Multi-tradition coverage: Arabic, Urdu, Persian, Sanskrit, Hebrew, Greek, Latin and more.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-nv-success font-bold">&#10003;</span>
                <span>Rich name profiles: lucky numbers, numerology, pronunciation, scriptural references and related names.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-nv-success font-bold">&#10003;</span>
                <span>No paywalls or accounts required — search and browsing are open to every family.</span>
              </li>
            </ul>
          </section>

          <section className="card p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-nv-text">Editorial Standards</h2>
            <p className="mt-3 text-sm leading-relaxed text-nv-text-secondary sm:text-base">
              Entries are reviewed for linguistic origin, common usage and faith-aware interpretation
              before they appear in search results and curated lists. When traditions differ on a
              meaning or pronunciation, we note the variation rather than picking a side. If you spot
              an error, tell us via our{' '}
              <Link href="/contact" className="font-semibold text-nv-accent hover:underline">
                contact page
              </Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
