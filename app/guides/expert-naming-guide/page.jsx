import Link from 'next/link';
import AdSlot from '../../../components/AdSlot.jsx';

export const metadata = {
  title: 'Expert Naming Guide | NameVerse',
  description: 'Decision framework and expert guidance for choosing the perfect baby name.',
  robots: {
    index: false,
    follow: true,
  },
};

export const revalidate = 2592000; // 30 days

export default function ExpertNamingGuidePage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-nv-text sm:text-4xl">Expert Naming Guide</h1>
        <p className="mt-4 text-nv-text-secondary">A decision framework for choosing the perfect baby name.</p>

        <AdSlot placement="guide-top" />
        <div className="mt-6 rounded-2xl border border-nv-border bg-nv-surface p-6">
          <p className="text-sm text-nv-text-secondary">
            This guide is under active development by our editorial team. Browse{' '}
            <Link href="/names" className="font-semibold text-nv-accent hover:underline">
              all names
            </Link>{' '}
            or explore our{' '}
            <Link href="/blog" className="font-semibold text-nv-accent hover:underline">
              editorial guides
            </Link>{' '}
            to continue your research.
          </p>
        </div>
      </div>
    </div>
  );
}
