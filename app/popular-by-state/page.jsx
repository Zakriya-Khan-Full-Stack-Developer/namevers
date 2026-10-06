import Link from 'next/link';
import AdSlot from '../../components/AdSlot.jsx';

export const metadata = {
  title: 'Popular Baby Names by State | NameVerse',
  description: 'Explore baby name popularity trends across US states.',
  robots: {
    index: false,
    follow: true,
  },
};

export const revalidate = 2592000; // 30 days

export default function PopularByStatePage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-nv-text sm:text-4xl">Popular Baby Names by State</h1>
        <p className="mt-4 text-nv-text-secondary">Explore baby name popularity trends across states.</p>

        <AdSlot placement="popular-by-state-top" />
        <div className="mt-6 rounded-2xl border border-nv-border bg-nv-surface p-6">
          <p className="text-sm text-nv-text-secondary">
            This page is currently being compiled with the latest 2026 census data. In the meantime, browse our{' '}
            <Link href="/names" className="font-semibold text-nv-accent hover:underline">
              full names directory
            </Link>{' '}
            or check{' '}
            <Link href="/trending-names" className="font-semibold text-nv-accent hover:underline">
              trending names
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
