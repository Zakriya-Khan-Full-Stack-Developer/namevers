import Link from 'next/link';
import AdSlot from '../../components/AdSlot.jsx';

export const metadata = {
  title: 'My Saved Names | NameVerse',
  description: 'Your personal shortlist of baby names.',
  robots: {
    index: false,
    follow: true,
  },
};

export const revalidate = 2592000; // 30 days
export default function MyNamesPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-nv-text sm:text-4xl">My Saved Names</h1>
        <p className="mt-4 text-nv-text-secondary">Your personal shortlist of baby names.</p>

        <AdSlot placement="my-names-top" />
        <div className="mt-6 rounded-2xl border border-nv-border bg-nv-surface p-6">
          <p className="text-sm text-nv-text-secondary">
            This feature is under development. In the meantime, browse{' '}
            <Link href="/names" className="font-semibold text-nv-accent hover:underline">
              all names
            </Link>{' '}
            to explore baby names across traditions.
          </p>
        </div>
      </div>
    </div>
  );
}
