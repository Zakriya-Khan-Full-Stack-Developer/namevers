import Link from 'next/link';
import PageJsonLd from '../../components/PageJsonLd.jsx';
import AdSlot from '../../components/AdSlot.jsx';

export const metadata = {
  title: 'Contact NameVerse — Feedback, Corrections & Suggestions',
  description:
    'Contact the NameVerse team: report a name meaning correction, suggest a topic, or share feedback. We read every message.',
  alternates: {
    canonical: 'https://nameverse.site/contact',
  },
};

export const revalidate = 2592000; // 30 days

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact NameVerse',
  description: 'Contact the NameVerse team for feedback, corrections, and suggestions.',
  url: 'https://nameverse.site/contact',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'hello@nameverse.site',
    areaServed: 'Worldwide',
  },
};

export default function ContactPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <PageJsonLd data={contactJsonLd} />
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <span className="eyebrow">Contact</span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-nv-text sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-nv-text-secondary">
            Spotted an error in a meaning or origin? Want to suggest a name or a guide topic?
            We read every message.
          </p>
        </header>

        <AdSlot placement="contact-top" />

        <div className="grid gap-5 sm:grid-cols-2">
          <section className="card p-6">
            <h2 className="font-display text-lg font-bold text-nv-text">Corrections</h2>
            <p className="mt-2 text-sm leading-relaxed text-nv-text-secondary">
              Meaning, origin or pronunciation errors are our top priority. Include the name and what looks wrong.
            </p>
            <a href="mailto:corrections@nameverse.site" className="mt-4 inline-block text-sm font-semibold text-nv-accent hover:underline">
              corrections@nameverse.site
            </a>
          </section>

          <section className="card p-6">
            <h2 className="font-display text-lg font-bold text-nv-text">General Feedback</h2>
            <p className="mt-2 text-sm leading-relaxed text-nv-text-secondary">
              Ideas, feature requests and guide topic suggestions help shape what we build next.
            </p>
            <a href="mailto:hello@nameverse.site" className="mt-4 inline-block text-sm font-semibold text-nv-accent hover:underline">
              hello@nameverse.site
            </a>
          </section>

          <section className="card p-6">
            <h2 className="font-display text-lg font-bold text-nv-text">Privacy</h2>
            <p className="mt-2 text-sm leading-relaxed text-nv-text-secondary">
              Questions about how we handle data — see our{' '}
              <Link href="/privacy" className="text-nv-accent hover:underline">
                privacy policy
              </Link>{' '}
              or write to us.
            </p>
            <a href="mailto:privacy@nameverse.site" className="mt-4 inline-block text-sm font-semibold text-nv-accent hover:underline">
              privacy@nameverse.site
            </a>
          </section>

          <section className="card p-6">
            <h2 className="font-display text-lg font-bold text-nv-text">Legal</h2>
            <p className="mt-2 text-sm leading-relaxed text-nv-text-secondary">
              Licensing, attribution and other legal matters.
            </p>
            <a href="mailto:legal@nameverse.site" className="mt-4 inline-block text-sm font-semibold text-nv-accent hover:underline">
              legal@nameverse.site
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
