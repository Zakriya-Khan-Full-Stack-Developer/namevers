// ──────────────────────────────────────────────────────────────────────────────
// NameVerse — Indexability Gate
//
// WHY THIS EXISTS
// A meaningful share of the Islamic records (973 of 5,180) are honest stubs: the
// dataset explicitly states that no verified meaning or origin could be
// established for the form. Their content reads:
//
//   "No confident lexical sense is asserted."
//   "No verified linguistic origin was established for this form."
//   "The form could not be matched to a Tier-A/B source, so no gloss is asserted."
//
// Those are the RIGHT editorial position — inventing a meaning would be worse.
// But they are not indexable pages. Every one of them renders the same
// negative-assertion prose, so as a group they are near-duplicates of each
// other, and submitting them to Google is precisely what produces
// "Crawled — currently not indexed" at scale and drags down the domain's
// quality signal.
//
// THE RULE
// A page is indexable only when the record asserts a REAL meaning AND a REAL
// origin. Records whose meaning or origin is a negative assertion are served
// `noindex, follow` and excluded from the sitemap. They remain reachable and
// useful to a reader who lands on them, and they still pass link equity
// onward — they simply do not compete in the index.
//
// This module is the single source of truth for that decision. It is imported
// by the manifest generator, the sitemap route, the detail page and the
// uniqueness gate, so all four can never disagree.
// ──────────────────────────────────────────────────────────────────────────────

// Phrases the dataset uses to say "we could not verify this". Matched
// case-insensitively against the meaning and origin fields.
const NEGATIVE_ASSERTIONS = [
  /no confident lexical sense/i,
  /no meaning is asserted/i,
  /no gloss is asserted/i,
  /no verified linguistic origin/i,
  /no verified/i,
  /not established/i,
  /could not be matched/i,
  /could not be verified/i,
  /no documented/i,
  /no editorial story/i,
  /not available for this form/i,
  /no ipa transcription is asserted/i,
  /no confident/i,
  /no arabic/i,
  /no evidence/i,
  /unverified/i,
];

/** True when a string is a negative assertion rather than a real value. */
export function isNegativeAssertion(value) {
  const s = String(value || '');
  if (!s) return false;
  return NEGATIVE_ASSERTIONS.some((re) => re.test(s));
}

/**
 * Decide whether a record yields an indexable page.
 * Accepts either a normalized record or a manifest entry.
 */
export function isIndexableRecord(rec) {
  if (!rec) return false;
  const meaning = rec.shortMeaning || rec.meaning || '';
  const origin = rec.origin || '';
  const longMeaning = rec.longMeaning || '';

  if (!meaning || !origin) return false;
  if (isNegativeAssertion(meaning)) return false;
  if (isNegativeAssertion(origin)) return false;
  if (isNegativeAssertion(longMeaning)) return false;

  // A page also needs some substance beyond the two headline fields.
  const hasBody =
    Boolean(longMeaning) ||
    (Array.isArray(rec.meaningSection) && rec.meaningSection.length > 0) ||
    (Array.isArray(rec.faqs) && rec.faqs.length > 0);
  return hasBody;
}

export default { isIndexableRecord, isNegativeAssertion };
