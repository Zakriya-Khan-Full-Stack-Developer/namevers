import Link from 'next/link';

// A curated name rendered as a chip.
//
// Links to the real profile when we hold one; otherwise renders as plain text.
// This is the mechanism that keeps curated lists honest: a name we have no
// verified profile for is still shown (it is real, and the reader may want it)
// but it never becomes a link to a page that does not exist.
export default function NameChip({ item }) {
  if (!item || !item.name) return null;

  if (item.href) {
    return (
      <Link
        href={item.href}
        className="chip"
        title={item.meaning ? `${item.name} \u2014 ${item.meaning}` : item.name}
      >
        {item.name}
      </Link>
    );
  }

  return (
    <span
      className="chip cursor-default border-dashed text-nv-text-muted"
      title="Profile in progress"
    >
      {item.name}
    </span>
  );
}
