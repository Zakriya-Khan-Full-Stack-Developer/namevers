// ─────────────────────────────────────────────────────────────────────────────
// NameVerse — Canonical Name Normalizer
//
// THE PROBLEM THIS SOLVES
// The dataset contains TWO incompatible record schemas:
//
//   Schema A (~36% of records) — deeply nested, evidence-oriented:
//     core_meaning.short_meaning, origin.primary_origin, identity.gender,
//     etymology.etymology_explanation, translations.{urdu,hindi,arabic,...},
//     faq[].question/.answer, cultural_context, historical_context, ...
//
//   Schema B (~64% of records) — flat, editorial-oriented:
//     short_meaning, origin (string), gender (string), long_meaning,
//     lucky_number, pronunciation.english, name_variations,
//     similar_sounding_names, popularity_by_region, in_arabic, ...
//
// The name detail page read FLAT fields (nameData.origin, nameData.short_meaning)
// which exist in NEITHER schema for Schema-A records and only partially for
// Schema-B records. Result: thousands of pages rendered with an empty meaning,
// empty origin and empty etymology — the textbook definition of thin content,
// and the reason Google filed them under "Crawled — currently not indexed".
//
// This module flattens BOTH schemas into ONE canonical shape so every page can
// render genuinely unique, substantive content from its own record.
// ─────────────────────────────────────────────────────────────────────────────

import { normalizeGender, religionLabel } from './name-utils.js';

// ── small helpers ────────────────────────────────────────────────────────────

function isObj(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

/** First value that is a non-empty string / non-empty array / non-null object. */
function first(...vals) {
  for (const v of vals) {
    if (v === undefined || v === null) continue;
    if (typeof v === 'string' && v.trim() === '') continue;
    if (Array.isArray(v) && v.length === 0) continue;
    if (isObj(v) && Object.keys(v).length === 0) continue;
    return v;
  }
  return null;
}

/** Coerce anything into a clean string ('' when unusable). */
function str(v) {
  if (v === undefined || v === null) return '';
  if (typeof v === 'string') return v.trim();
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return v.map(str).filter(Boolean).join(', ');
  if (isObj(v)) return str(first(v.text, v.value, v.name, v.meaning, v.description, v.note));
  return '';
}

/** Coerce anything into a clean array of strings. */
function arr(v) {
  if (v === undefined || v === null) return [];
  if (Array.isArray(v)) return v.map(str).filter(Boolean);
  if (typeof v === 'string') {
    const t = v.trim();
    if (!t) return [];
    return t.includes(',') ? t.split(',').map((s) => s.trim()).filter(Boolean) : [t];
  }
  if (isObj(v)) {
    const inner = first(v.traits, v.items, v.list, v.values, v.verified, v.known_linguistic_history);
    if (inner) return arr(inner);
    const s = str(v);
    return s ? [s] : [];
  }
  return [];
}

/** Deduplicate while preserving order, case-insensitively. */
function uniq(list) {
  const seen = new Set();
  const out = [];
  for (const item of list) {
    const key = String(item).toLowerCase().trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

/** Strip mojibake / repeated punctuation that appears in some source records. */
function clean(s) {
  const t = str(s).replace(/\?{2,}/g, ' ').replace(/\s{2,}/g, ' ').trim();
  return t.includes('\uFFFD') ? '' : t;
}

// ── SEO block ────────────────────────────────────────────────────────────────
// Both schemas nest the real payload one level down: seo.seo.{title,...}
// A few records expose it flat. Handle all three shapes.
function readSeo(raw) {
  const candidates = [raw.seo?.seo, raw.seo, raw.seo_content, raw.seoContent];
  const out = { secondary_keywords: [] };
  for (const c of candidates) {
    if (!isObj(c)) continue;
    out.title = out.title || clean(c.title);
    out.meta_description = out.meta_description || clean(c.meta_description || c.metaDescription);
    out.h1 = out.h1 || clean(c.h1);
    out.focus_keyword = out.focus_keyword || clean(c.focus_keyword);
    out.description_paragraph = out.description_paragraph || clean(c.description_paragraph);
    out.secondary_keywords = out.secondary_keywords.length
      ? out.secondary_keywords
      : arr(c.secondary_keywords);
    out.intro = out.intro || clean(c.intro);
    out.meaning_section = out.meaning_section || clean(c.meaning_section);
    out.origin_section = out.origin_section || clean(c.origin_section);
    out.islam_section = out.islam_section || clean(c.islam_section);
    out.cultural_section = out.cultural_section || clean(c.cultural_section);
    out.pronunciation_section = out.pronunciation_section || clean(c.pronunciation_section);
  }
  out.secondary_keywords = out.secondary_keywords || [];
  return out;
}

// ── FAQ block ────────────────────────────────────────────────────────────────
// Schema A: faq[].{question, answer}   Schema B: seo.faq[].{q, a}
function readFaqs(raw) {
  const pools = [raw.faq, raw.seo?.faq, raw.seo?.seo?.faq, raw.faqs, raw.richFaqs];
  const out = [];
  for (const pool of pools) {
    if (!Array.isArray(pool)) continue;
    for (const item of pool) {
      if (!isObj(item)) continue;
      const q = clean(first(item.question, item.q, item.title));
      const a = clean(first(item.answer, item.a, item.text, item.response));
      if (q && a) out.push({ q, a });
    }
  }
  // dedupe by question
  const seen = new Set();
  return out.filter((f) => {
    const k = f.q.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// ── Translations / world scripts ─────────────────────────────────────────────
// Schema A: translations.{english,urdu,hindi,arabic,persian,pashto,...}
// Schema B: in_arabic / in_urdu / in_hindi / in_sanskrit / in_tamil / ...
const SCRIPT_LANGS = [
  { key: 'arabic', label: 'Arabic', rtl: true },
  { key: 'urdu', label: 'Urdu', rtl: true },
  { key: 'persian', label: 'Persian', rtl: true },
  { key: 'pashto', label: 'Pashto', rtl: true },
  { key: 'hebrew', label: 'Hebrew', rtl: true },
  { key: 'hindi', label: 'Hindi', rtl: false },
  { key: 'sanskrit', label: 'Sanskrit', rtl: false },
  { key: 'tamil', label: 'Tamil', rtl: false },
  { key: 'telugu', label: 'Telugu', rtl: false },
  { key: 'bengali', label: 'Bengali', rtl: false },
  { key: 'marathi', label: 'Marathi', rtl: false },
  { key: 'greek', label: 'Greek', rtl: false },
  { key: 'latin', label: 'Latin', rtl: false },
  { key: 'english', label: 'English', rtl: false },
];

function readScripts(raw) {
  const out = [];
  for (const lang of SCRIPT_LANGS) {
    const src = first(raw.translations?.[lang.key], raw[`in_${lang.key}`]);
    if (!src) continue;
    const name = clean(first(isObj(src) ? src.name : src, isObj(src) ? src.script : null));
    const meaning = clean(isObj(src) ? first(src.meaning, src.short_meaning) : null);
    const longMeaning = clean(isObj(src) ? first(src.long_meaning, src.description) : null);
    if (!name && !meaning) continue;
    out.push({ ...lang, name, meaning, longMeaning });
  }
  return out;
}

// ── Pronunciation ────────────────────────────────────────────────────────────
function readPronunciation(raw) {
  const p = isObj(raw.pronunciation) ? raw.pronunciation : {};
  return {
    english: clean(first(p.english, p.romanized, p.romanization, raw.pronunciation_english)),
    ipa: clean(p.ipa),
    urdu: clean(p.urdu),
    hindi: clean(p.hindi),
    persian: clean(p.persian),
    pashto: clean(p.pashto),
    arabic: clean(p.arabic),
    note: clean(first(p.approximation_note, p.note)),
  };
}

// ── Origin ───────────────────────────────────────────────────────────────────
function readOrigin(raw) {
  const o = raw.origin;
  if (typeof o === 'string') {
    return { label: clean(o), explanation: '', transmission: [] };
  }
  if (isObj(o)) {
    return {
      label: clean(first(o.primary_origin, o.origin, o.label, o.name)),
      explanation: clean(first(o.origin_explanation, o.explanation, o.note)),
      transmission: arr(first(o.cultural_transmission, o.transmission)),
    };
  }
  return { label: '', explanation: '', transmission: [] };
}

// ── Religion / scripture context ─────────────────────────────────────────────
function readReligionContext(raw) {
  const r = isObj(raw.religion) ? raw.religion : {};
  const q = isObj(r.quranic_status) ? r.quranic_status : {};
  const h = isObj(r.hadith_status) ? r.hadith_status : {};
  const p = isObj(r.prophetic_status) ? r.prophetic_status : {};
  const c = isObj(r.companion_status) ? r.companion_status : {};

  const biblical = isObj(raw.biblical_reference) ? raw.biblical_reference : {};
  const saint = isObj(raw.saint_reference) ? raw.saint_reference : {};
  const islamic = isObj(raw.islamic_reference) ? raw.islamic_reference : {};
  const vedic = isObj(raw.vedic_reference) ? raw.vedic_reference : {};

  return {
    association: clean(first(r.primary_association, r.religion)),
    status: clean(r.religious_status),
    explanation: clean(r.religious_explanation),
    isQuranic: q.is_quranic_name === true || islamic.is_quranic === true,
    quranicRef: clean(first(q.quranic_reference, islamic.surah)),
    quranicNote: clean(first(q.note, islamic.note)),
    isHadith: h.direct_reference === true,
    hadithRef: clean(h.reference),
    isProphetic: p.prophet_association === true,
    propheticRef: clean(p.reference),
    isCompanion: c.known_companion_association === true,
    companionRef: clean(c.reference),
    isBiblical: biblical.is_biblical === true,
    biblicalScripture: clean(first(biblical.origin_scripture, biblical.scripture)),
    biblicalVerse: clean(biblical.verse_reference),
    isSaint: saint.is_saint_name === true || Boolean(saint.saint_name),
    saintName: clean(saint.saint_name),
    isVedic: Boolean(vedic.reference || vedic.note || vedic.is_vedic),
    vedicRef: clean(first(vedic.reference, vedic.note)),
    namingContext: clean(raw.islamic_naming_context?.context),
    namingInterpretation: clean(raw.islamic_naming_context?.interpretation),
  };
}

// ── Cultural / historical ────────────────────────────────────────────────────
function readCultural(raw) {
  const c = isObj(raw.cultural_context) ? raw.cultural_context : {};
  return {
    associations: arr(first(c.primary_cultural_associations, c.associations)),
    meaning: clean(first(c.cultural_meaning, c.meaning)),
    personalInterpretation: clean(c.personal_name_interpretation),
    symbolism: clean(first(raw.spiritual_symbolism, c.symbolism)),
    impact: clean(first(raw.cultural_impact, c.impact)),
  };
}

function readHistorical(raw) {
  const h = isObj(raw.historical_context) ? raw.historical_context : {};
  const refs = Array.isArray(raw.historical_references) ? raw.historical_references : [];
  const history = uniq([
    ...arr(h.known_linguistic_history),
    ...refs.map((r) => clean(first(isObj(r) ? first(r.reference, r.text, r.description) : r))),
  ]);
  return {
    history,
    person: clean(first(h.historical_person_association, h.person)),
    event: clean(first(h.historical_event_association, h.event)),
    note: clean(h.editorial_note),
  };
}

// ── Numerology / lucky attributes ────────────────────────────────────────────
function readNumerology(raw) {
  const n = isObj(raw.numerology) ? raw.numerology : {};
  const l = isObj(raw.lucky_attributes) ? raw.lucky_attributes : {};
  return {
    luckyNumber: first(raw.lucky_number, n.lucky_number, l.lucky_number),
    lifePath: first(raw.life_path_number, n.life_path_number, l.life_path_number),
    meaning: clean(first(raw.numerology_meaning, n.numerology_meaning)),
    luckyDay: clean(first(raw.lucky_day, l.lucky_day)),
    luckyColors: arr(first(raw.lucky_colors, l.lucky_colors)),
    luckyStone: clean(first(raw.lucky_stone, l.lucky_stone)),
  };
}

// ── Popularity ───────────────────────────────────────────────────────────────
function readPopularity(raw) {
  const p = isObj(raw.popularity) ? raw.popularity : {};
  const regions = Array.isArray(raw.popularity_by_region) ? raw.popularity_by_region : [];
  const modern = isObj(raw.modern_usage) ? raw.modern_usage : {};
  return {
    score: first(raw.popularity_score, p.overall_score),
    regions: regions
      .filter(isObj)
      .map((r) => ({
        region: clean(first(r.region, r.name, r.country)),
        code: clean(first(r.country_code, r.code)),
        score: first(r.score, r.value),
        year: first(r.year, r.registry_year),
      }))
      .filter((r) => r.region),
    usageRegions: arr(first(modern.usage_regions, modern.regions)),
  };
}

// ── Namesakes / real life ────────────────────────────────────────────────────
function readNamesakes(raw) {
  const c = raw.celebrity_usage;
  let celebrities = [];
  if (Array.isArray(c)) celebrities = arr(c);
  else if (isObj(c)) celebrities = arr(first(c.verified, c.names, c.list));

  const story = isObj(raw.name_in_real_life)
    ? raw.name_in_real_life
    : isObj(raw.name_story)
    ? raw.name_story
    : null;

  return {
    celebrities: uniq(celebrities),
    story: story
      ? {
          person: clean(first(story.person_name, story.person, story.title)),
          location: clean(story.location),
          text: clean(first(story.story, story.text, story.description)),
        }
      : null,
  };
}

// ── Etymology ────────────────────────────────────────────────────────────────
function readEtymology(raw) {
  const e = isObj(raw.etymology) ? raw.etymology : {};
  return {
    language: clean(first(e.primary_language, e.language)),
    lexicalForm: clean(first(e.lexical_form, e.script_form)),
    transliteration: clean(first(e.transliteration, e.romanization)),
    rootStatus: clean(e.root_status),
    explanation: clean(first(e.etymology_explanation, e.explanation)),
    meanings: arr(e.etymological_meaning),
    warning: clean(e.false_etymology_warning),
  };
}

// ── Main normalizer ──────────────────────────────────────────────────────────
export function normalizeNameRecord(raw, religion, slug) {
  if (!isObj(raw)) return null;

  const name = clean(first(raw.name, raw.identity?.display_name, raw.identity?.normalized_name));
  if (!name) return null;

  const cm = isObj(raw.core_meaning) ? raw.core_meaning : {};
  const identity = isObj(raw.identity) ? raw.identity : {};
  const lang = raw.language;
  const seo = readSeo(raw);
  const origin = readOrigin(raw);
  const etymology = readEtymology(raw);
  const pronunciation = readPronunciation(raw);
  const numerology = readNumerology(raw);
  const popularity = readPopularity(raw);
  const cultural = readCultural(raw);
  const historical = readHistorical(raw);
  const religionCtx = readReligionContext(raw);
  const namesakes = readNamesakes(raw);
  const scripts = readScripts(raw);

  // Meaning — the single most important field, and the one that was empty.
  const shortMeaning = clean(
    first(
      raw.short_meaning,
      cm.short_meaning,
      cm.primary_meaning,
      raw.meaning,
      cm.literal_meaning,
      raw.semantic_field?.primary_semantic_domain,
      raw.personality_associations?.traits?.[0]
    )
  );

  const longMeaning = clean(
    first(
      raw.long_meaning,
      cm.meaning_explanation,
      raw.seo_content?.intro,
      seo.description_paragraph,
      etymology.explanation,
      raw.spiritual_meaning?.meaning,
      raw.spiritual_meaning
    )
  );

  // Gender — Schema B wraps it in parentheses, e.g. "(Male)".
  const rawGender = clean(first(raw.gender, identity.gender));
  const genderKey = normalizeGender(rawGender.replace(/[()]/g, ''));

  // Language list
  let languages = [];
  if (Array.isArray(lang)) languages = arr(lang);
  else if (isObj(lang)) languages = uniq([clean(lang.primary), ...arr(lang.associated_languages)]);
  else if (typeof lang === 'string') languages = arr(lang);
  const languageNotes = isObj(lang?.language_notes) ? lang.language_notes : {};

  // Variants
  const variants = uniq([
    ...arr(raw.name_variations),
    ...arr(raw.name_variants?.romanized_variants),
    ...arr(identity.alternate_spellings),
  ]);
  const scriptVariants = uniq(arr(raw.name_variants?.script_variants));

  // Similar / related names
  const similar = uniq([
    ...arr(raw.similar_sounding_names),
    ...arr(raw.semantic_field?.related_concepts),
  ]);
  const related = uniq(arr(first(raw.related_names, raw.name_variants?.related_names)));

  // Traits
  const emotionalTraits = uniq([
    ...arr(raw.emotional_traits),
    ...arr(raw.personality_associations?.traits),
  ]);
  const hiddenTraits = uniq([
    ...arr(raw.hidden_personality_traits),
    ...arr(raw.hidden_personality_traits?.traits),
  ]);

  const spiritualMeaning = clean(
    first(
      typeof raw.spiritual_meaning === 'string' ? raw.spiritual_meaning : null,
      raw.spiritual_meaning?.meaning,
      raw.spiritual_significance
    )
  );

  return {
    // identity
    name,
    slug: clean(first(raw.slug, slug)),
    religion,
    religionLabel: religionLabel(religion),
    gender: rawGender,
    genderKey,
    nameType: clean(identity.name_type),
    nameStatus: clean(identity.name_status),

    // meaning
    shortMeaning,
    longMeaning,
    literalMeaning: clean(first(cm.literal_meaning, cm.primary_meaning)),
    extendedMeaning: clean(cm.extended_meaning),
    secondaryMeanings: arr(cm.secondary_meanings),
    meaningConfidence: clean(cm.meaning_confidence),
    semanticDomain: clean(raw.semantic_field?.primary_semantic_domain),
    semanticRelationship: clean(raw.semantic_field?.semantic_relationship),

    // origin & etymology
    origin: origin.label,
    originExplanation: origin.explanation,
    culturalTransmission: origin.transmission,
    etymology,

    // language
    languages,
    languageNotes,
    scripts,
    pronunciation,
    variants,
    scriptVariants,
    similar,
    related,

    // numerology
    ...numerology,

    // popularity
    popularityScore: popularity.score,
    popularityRegions: popularity.regions,
    usageRegions: popularity.usageRegions,

    // culture & history
    cultural,
    historical,
    religionCtx,
    spiritualMeaning,
    namesakes,

    // traits
    emotionalTraits,
    hiddenTraits,

    // faqs & seo
    faqs: readFaqs(raw),
    seo,
    structuredData: isObj(raw.structured_data) ? raw.structured_data : null,

    // provenance
    evidence: arr(raw.evidence?.core_claims?.map((c) => clean(isObj(c) ? c.claim : c))),
    contentQuality: isObj(raw.content_quality) ? raw.content_quality : null,
    updatedAt: clean(raw.updated_at || raw.timestamps?.updated_at),

    // raw passthrough for anything the template still needs
    _raw: raw,
  };
}

export default { normalizeNameRecord };
