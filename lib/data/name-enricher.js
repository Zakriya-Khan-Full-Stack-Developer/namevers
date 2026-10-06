// ─────────────────────────────────────────────────────────────────────────────
// NameVerse — Name Enrichment & Render Model
//
// Consumes the canonical record produced by name-normalizer.js and returns the
// complete render model the detail template needs.
//
// TWO JOBS
//  1. FILL GAPS — some records omit numerology, syllable counts or FAQs. Those
//     are derived deterministically from the name itself so no page renders a
//     hole.
//  2. GUARANTEE UNIQUENESS — every generated sentence is composed from THIS
//     record's own fields (meaning, origin, script, pronunciation, numerology,
//     cultural context). Two different names therefore cannot produce the same
//     paragraph, which is what keeps 13,801 pages out of Google's
//     "Crawled — currently not indexed" bucket.
//
// HONESTY RULE
//  The source dataset explicitly marks numerology and letter-based personality
//  systems as belief-based / symbolic rather than linguistic fact. Derived
//  content is therefore always labelled as traditional or interpretive, never
//  presented as etymology.
// ─────────────────────────────────────────────────────────────────────────────

import { genderLabel } from './name-utils.js';
import { buildContentModel } from './name-content.js';

// ── Pythagorean numerology ───────────────────────────────────────────────────
const PYTHAGOREAN_MAP = {
  a: 1, j: 1, s: 1, b: 2, k: 2, t: 2, c: 3, l: 3, u: 3, d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5, f: 6, o: 6, x: 6, g: 7, p: 7, y: 7, h: 8, q: 8, z: 8,
  i: 9, r: 9,
};

const NUMEROLOGY_PROFILES = {
  1: { traits: 'leadership, independence and initiative', day: 'Sunday', colors: ['Gold', 'Amber', 'Sunflower Yellow'], stone: 'Ruby', planet: 'Sun', desc: 'Vibration 1 is associated with pioneering energy, self-direction and an original creative vision.' },
  2: { traits: 'harmony, empathy and diplomacy', day: 'Monday', colors: ['Silver', 'Pearl White', 'Cream'], stone: 'Moonstone', planet: 'Moon', desc: 'Vibration 2 is associated with gentleness, cooperation and emotional intelligence.' },
  3: { traits: 'joy, creativity and expression', day: 'Thursday', colors: ['Royal Blue', 'Purple', 'Rose Violet'], stone: 'Yellow Sapphire', planet: 'Jupiter', desc: 'Vibration 3 is associated with creative vitality, warmth and expressive communication.' },
  4: { traits: 'stability, loyalty and discipline', day: 'Sunday', colors: ['Electric Blue', 'Slate Grey', 'Khaki'], stone: 'Garnet', planet: 'Uranus', desc: 'Vibration 4 is associated with reliability, methodical care and enduring foundations.' },
  5: { traits: 'freedom, adaptability and curiosity', day: 'Wednesday', colors: ['Emerald Green', 'Turquoise', 'Silver'], stone: 'Emerald', planet: 'Mercury', desc: 'Vibration 5 is associated with versatile intellect, curiosity and a progressive spirit.' },
  6: { traits: 'love, nurturing and responsibility', day: 'Friday', colors: ['Sky Blue', 'Pastel Pink', 'Lavender'], stone: 'Opal', planet: 'Venus', desc: 'Vibration 6 is associated with care-taking, domestic harmony and generosity.' },
  7: { traits: 'wisdom, introspection and discernment', day: 'Monday', colors: ['Sea Green', 'Aquamarine', 'Soft White'], stone: 'Aquamarine', planet: 'Neptune', desc: 'Vibration 7 is associated with contemplation, analytical insight and inner truth.' },
  8: { traits: 'strength, abundance and resilience', day: 'Saturday', colors: ['Midnight Blue', 'Charcoal', 'Deep Purple'], stone: 'Blue Sapphire', planet: 'Saturn', desc: 'Vibration 8 is associated with material mastery, authority and endurance through effort.' },
  9: { traits: 'humanitarianism, nobility and universal love', day: 'Tuesday', colors: ['Crimson Red', 'Scarlet', 'Coral'], stone: 'Red Coral', planet: 'Mars', desc: 'Vibration 9 is associated with selflessness, noble ideals and broad compassion.' },
  11: { traits: 'vision, spiritual illumination and intuition', day: 'Sunday', colors: ['Silver', 'Violet', 'Pure White'], stone: 'Clear Quartz', planet: 'Moon / Neptune', desc: 'Master Number 11 is associated with heightened intuition and spiritual magnetism.' },
  22: { traits: 'practical genius, global impact and vision', day: 'Saturday', colors: ['Gold', 'Deep Bronze', 'Forest Green'], stone: 'Topaz', planet: 'Saturn / Uranus', desc: 'Master Number 22 is associated with translating vision into lasting structures.' },
};

// ── Letter symbolism (traditional, not linguistic) ───────────────────────────
const LETTER_SYMBOLISM = {
  a: ['Authentic in word and intention', 'Ambitious with an upright compass', 'Affectionate and deeply caring'],
  b: ['Brave in defence of others', 'Benevolent and generous at heart', 'A bringer of lasting peace'],
  c: ['Compassionate toward all beings', 'Courageous under pressure', 'Creative and thoughtfully expressive'],
  d: ['Dedicated to truth and duty', 'Discerning, with keen insight', 'A dependable anchor for loved ones'],
  e: ['Empathetic and gently sensitive', 'Enthusiastic and full of vigour', 'Elevated in spirit and morals'],
  f: ['Faithful to promises and values', 'Forgiving and broad in understanding', 'Friendly and welcoming'],
  g: ['Gracious in triumph and adversity', 'Generous with wisdom and care', 'A gentle guardian of harmony'],
  h: ['Honourable in conduct and speech', 'Humble despite real talent', 'A harmonising presence at home'],
  i: ['Inspiring, with a clear vision', 'Intelligent and intellectually curious', 'Intuitive and perceptive'],
  j: ['Just and fair in judgement', 'A joyful presence that lifts others', 'Judicious with time and resources'],
  k: ['Kind-hearted without expectation', 'A knowledgeable truth-seeker', 'A keen observer of life'],
  l: ['Loyal through every season', 'Loving and tender in affection', 'Luminous in thought and deed'],
  m: ['Merciful toward the vulnerable', 'Mindful of moral obligation', 'Magnanimous in forgiveness'],
  n: ['Noble in character', 'A nurturing guardian of family', 'A natural peacemaker'],
  o: ['Optimistic and full of hope', 'Open-hearted to newcomers', 'Orderly and principled in duty'],
  p: ['Patient through hardship', 'A peaceful sanctuary for others', 'Pious with deep reverence'],
  q: ['Quick-witted and discerning', 'Quietly steadfast in conviction', 'Questing for noble wisdom'],
  r: ['Resilient and unbroken in trial', 'Righteous in principle', 'Radiant with natural warmth'],
  s: ['Sincere in all relationships', 'Spiritual and connected to truth', 'Strong-willed on righteous paths'],
  t: ['Truthful even when it is difficult', 'A trustworthy confidant', 'Thoughtful in every decision'],
  u: ['Understanding of human frailty', 'Upright in ethics', 'Uplifting to those who struggle'],
  v: ['Valiant in protecting principle', 'Virtuous and clean of heart', 'A visionary thinker'],
  w: ['Wise beyond their years', 'Warm and hospitable', 'Worthy of high trust and esteem'],
  x: ['Exceptional in focus and resolve', 'An exemplary role model', 'Expressive in noble artistry'],
  y: ['Yearning for sacred wisdom', 'Yielding to righteous counsel', 'Youthful in enthusiasm'],
  z: ['Zealous for good deeds', 'At the zenith of integrity', 'Zestful in approach to life'],
};

// ── derivations ──────────────────────────────────────────────────────────────

export function calculateNumerologyNumber(name) {
  const letters = String(name || '').toLowerCase().replace(/[^a-z]/g, '');
  if (!letters) return 1;
  let sum = 0;
  for (const ch of letters) sum += PYTHAGOREAN_MAP[ch] || 0;
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split('').reduce((a, d) => a + parseInt(d, 10), 0);
  }
  return sum || 1;
}

export function estimateSyllables(name) {
  const word = String(name || '').toLowerCase().trim();
  if (word.length <= 3) return 1;
  const cleaned = word.replace(/(?:[^laeiouy]|ed|es|e)$/, '').replace(/^y/, '');
  const matches = cleaned.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

function buildAcrostic(name) {
  const letters = String(name || '').trim().toUpperCase();
  const used = {};
  const out = [];
  for (const ch of letters) {
    const lower = ch.toLowerCase();
    const options = LETTER_SYMBOLISM[lower];
    if (!options) continue;
    const idx = used[lower] || 0;
    out.push({ letter: ch, trait: options[idx % options.length] });
    used[lower] = idx + 1;
  }
  return out;
}

// ── main ─────────────────────────────────────────────────────────────────────
export function enrichNameProfile(record) {
  if (!record || !record.name) return record;

  const r = { ...record };

  // Numerology — fill only what the record does not already carry.
  const derivedNumber = calculateNumerologyNumber(r.name);
  if (!r.luckyNumber) r.luckyNumber = derivedNumber;
  const profile = NUMEROLOGY_PROFILES[r.luckyNumber] || NUMEROLOGY_PROFILES[1];
  r.numerologyDerived = !record.luckyNumber;
  if (!r.lifePath) r.lifePath = (r.luckyNumber % 9) || 9;
  if (!r.luckyDay) r.luckyDay = profile.day;
  if (!r.luckyColors.length) r.luckyColors = profile.colors;
  if (!r.luckyStone) r.luckyStone = profile.stone;
  if (!r.numerologyMeaning) r.numerologyMeaning = profile.desc;
  r.numerologyTraits = profile.traits;
  r.numerologyPlanet = profile.planet;

  // Phonetic anatomy
  r.syllables = estimateSyllables(r.name);
  r.letterCount = r.name.replace(/\s+/g, '').length;
  r.firstLetter = r.name.trim().charAt(0).toUpperCase();
  r.lastLetter = (r.name || '').trim().slice(-1).toUpperCase();

  // Letter symbolism (traditional)
  r.acrostic = buildAcrostic(r.name);

  // Everything else — composed prose, varied headings, per-record FAQs,
  // long-tail keywords, section order and the uniqueness signature — is
  // produced by the content engine. It is seeded from the record's own
  // identity, so the output is stable across builds but differs per name.
  return buildContentModel(r);
}

export default { enrichNameProfile, calculateNumerologyNumber, estimateSyllables };