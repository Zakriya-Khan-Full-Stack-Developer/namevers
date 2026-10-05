// Renders one or more JSON-LD blocks. Accepts a single object or an array;
// null/undefined entries are dropped so callers can pass conditionals inline
// (e.g. `faqSchema` only when the page actually has FAQs).
export default function JsonLd({ blocks }) {
  const list = (Array.isArray(blocks) ? blocks : [blocks]).filter(Boolean);
  if (!list.length) return null;

  return (
    <>
      {list.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
