import Link from 'next/link';

// State-by-state top names table.
//
// Each cell links to the name's profile when we hold one. The "change" column
// compares the current top name against the previous year's, which is the part
// of this dataset readers actually come for — a static list of state winners is
// available everywhere, the movement is not.
export default function StateTable({ rows, resolve }) {
  if (!rows || !rows.length) return null;

  function Cell({ name }) {
    const r = resolve(name);
    if (r.href) {
      return (
        <Link href={r.href} className="font-semibold text-nv-accent hover:underline">
          {name}
        </Link>
      );
    }
    return <span className="font-semibold text-nv-text">{name}</span>;
  }

  function Movement({ current, previous }) {
    if (!previous || previous === current) {
      return <span className="text-xs text-nv-text-muted">held</span>;
    }
    return (
      <span className="text-xs text-nv-text-secondary">
        <span className="text-nv-text-muted">{previous}</span> &rarr;{' '}
        <span className="font-semibold text-nv-text">{current}</span>
      </span>
    );
  }

  return (
    <div className="overflow-x-auto rounded-card border border-nv-border bg-nv-surface">
      <table className="data-table min-w-[640px]">
        <caption className="sr-only">
          Most popular baby names by US state, with the previous year&rsquo;s top name for comparison.
        </caption>
        <thead>
          <tr>
            <th scope="col" className="px-4 pt-4">State</th>
            <th scope="col" className="px-4 pt-4">Top boy name</th>
            <th scope="col" className="px-4 pt-4">Top girl name</th>
            <th scope="col" className="px-4 pt-4">Change from last year</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.abbr} className="border-t border-nv-border">
              <th scope="row" className="px-4 py-3 text-left text-sm font-bold text-nv-text">
                {row.state}
                <span className="ml-1.5 text-xs font-normal text-nv-text-muted">{row.abbr}</span>
              </th>
              <td className="px-4 py-3">
                <Cell name={row.boy} />
              </td>
              <td className="px-4 py-3">
                <Cell name={row.girl} />
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-0.5">
                  <Movement current={row.boy} previous={row.prevBoy} />
                  <Movement current={row.girl} previous={row.prevGirl} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
