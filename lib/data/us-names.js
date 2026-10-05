// ─────────────────────────────────────────────────────────────────────────────
// US (Tier 1) search-demand data + keyword map.
//
// Two rules govern everything in this file:
//
//   1. NO FABRICATED STATISTICS. Every ranking and every state figure below is
//      transcribed from a named, linked source (see lib/data/editorial.js).
//      Where two sources disagree we keep both and let the page explain the
//      difference — that reconciliation is itself a quality signal.
//
//   2. NO DEAD LINKS. Curated name lists are resolved against the real
//      13,801-record manifest at render time. A name we hold a profile for
//      becomes an internal link; a name we do not becomes plain text. We never
//      emit a link to a page that does not exist.
// ─────────────────────────────────────────────────────────────────────────────

import { getManifest } from './names-data.js';

// ── Official national top 10 (SSA, most recent release) ──────────────────────
// Source: https://www.ssa.gov/oact/babynames/index.html
export const SSA_TOP_10 = {
  boys: ['Liam', 'Noah', 'Oliver', 'Theodore', 'Henry', 'James', 'Elijah', 'Mateo', 'William', 'Lucas'],
  girls: ['Olivia', 'Charlotte', 'Emma', 'Amelia', 'Sophia', 'Mia', 'Isabella', 'Evelyn', 'Sofia', 'Eliana'],
};

// ── Independent 2026 ranking table (BabyCenter), ranks 1–40 ──────────────────
// Source: https://www.babycenter.com/baby-names/most-popular/top-baby-names-2026
// Kept separate from the SSA list on purpose: the two orderings differ, and the
// page explains why rather than silently picking one.
export const BABYCENTER_2026 = {
  boys: [
    'Noah', 'Liam', 'Oliver', 'Elijah', 'Mateo', 'Lucas', 'Elias', 'Levi', 'Ezra', 'Leo',
    'Asher', 'Luca', 'Henry', 'Hudson', 'Theodore', 'James', 'Sebastian', 'Samuel', 'Waylon', 'Daniel',
    'Josiah', 'Theo', 'Cooper', 'Wyatt', 'Gabriel', 'Maverick', 'Jack', 'Julian', 'Benjamin', 'Grayson',
    'Santiago', 'Michael', 'Rowan', 'Mason', 'Luke', 'Muhammad', 'Isaiah', 'Alexander', 'Roman', 'Ethan',
  ],
  girls: [
    'Olivia', 'Eliana', 'Amelia', 'Charlotte', 'Sophia', 'Isabella', 'Emma', 'Aurora', 'Evelyn', 'Mia',
    'Ellie', 'Lily', 'Violet', 'Sofia', 'Hazel', 'Ava', 'Aria', 'Luna', 'Ella', 'Willow',
    'Nova', 'Harper', 'Eleanor', 'Gianna', 'Scarlett', 'Layla', 'Lucy', 'Isla', 'Elena', 'Iris',
    'Penelope', 'Ivy', 'Lainey', 'Elizabeth', 'Nora', 'Delilah', 'Chloe', 'Valentina', 'Camila', 'Paisley',
  ],
};

// ── State-level top names ────────────────────────────────────────────────────
// Source: SSA state dataset, as tabulated in the cited reference. 50 states + DC.
// `boy`/`girl` are the most recent year; `prevBoy`/`prevGirl` the year before,
// which lets each state row show a real year-over-year movement.
export const STATE_TOP_NAMES = [
  { state: 'Alabama', abbr: 'AL', boy: 'John', girl: 'Charlotte', prevBoy: 'William', prevGirl: 'Charlotte' },
  { state: 'Alaska', abbr: 'AK', boy: 'Noah', girl: 'Charlotte', prevBoy: 'Oliver', prevGirl: 'Amelia' },
  { state: 'Arizona', abbr: 'AZ', boy: 'Liam', girl: 'Olivia', prevBoy: 'Liam', prevGirl: 'Olivia' },
  { state: 'Arkansas', abbr: 'AR', boy: 'Liam', girl: 'Charlotte', prevBoy: 'Liam', prevGirl: 'Olivia' },
  { state: 'California', abbr: 'CA', boy: 'Liam', girl: 'Olivia', prevBoy: 'Liam', prevGirl: 'Mia' },
  { state: 'Colorado', abbr: 'CO', boy: 'Liam', girl: 'Charlotte', prevBoy: 'Liam', prevGirl: 'Olivia' },
  { state: 'Connecticut', abbr: 'CT', boy: 'Noah', girl: 'Charlotte', prevBoy: 'Liam', prevGirl: 'Mia' },
  { state: 'Delaware', abbr: 'DE', boy: 'Noah', girl: 'Mia', prevBoy: 'Liam', prevGirl: 'Charlotte' },
  { state: 'District of Columbia', abbr: 'DC', boy: 'Noah', girl: 'Emma', prevBoy: 'James', prevGirl: 'Charlotte' },
  { state: 'Florida', abbr: 'FL', boy: 'Liam', girl: 'Olivia', prevBoy: 'Liam', prevGirl: 'Olivia' },
  { state: 'Georgia', abbr: 'GA', boy: 'Liam', girl: 'Amelia', prevBoy: 'Liam', prevGirl: 'Charlotte' },
  { state: 'Hawaii', abbr: 'HI', boy: 'Elijah', girl: 'Isla', prevBoy: 'Noah', prevGirl: 'Olivia' },
  { state: 'Idaho', abbr: 'ID', boy: 'Oliver', girl: 'Charlotte', prevBoy: 'Oliver', prevGirl: 'Charlotte' },
  { state: 'Illinois', abbr: 'IL', boy: 'Liam', girl: 'Olivia', prevBoy: 'Liam', prevGirl: 'Olivia' },
  { state: 'Indiana', abbr: 'IN', boy: 'Oliver', girl: 'Charlotte', prevBoy: 'Oliver', prevGirl: 'Charlotte' },
  { state: 'Iowa', abbr: 'IA', boy: 'Oliver', girl: 'Charlotte', prevBoy: 'Oliver', prevGirl: 'Charlotte' },
  { state: 'Kansas', abbr: 'KS', boy: 'Theodore', girl: 'Charlotte', prevBoy: 'Oliver', prevGirl: 'Charlotte' },
  { state: 'Kentucky', abbr: 'KY', boy: 'Oliver', girl: 'Amelia', prevBoy: 'Liam', prevGirl: 'Charlotte' },
  { state: 'Louisiana', abbr: 'LA', boy: 'Noah', girl: 'Amelia', prevBoy: 'Liam', prevGirl: 'Olivia' },
  { state: 'Maine', abbr: 'ME', boy: 'Theodore', girl: 'Charlotte', prevBoy: 'Oliver', prevGirl: 'Charlotte' },
  { state: 'Maryland', abbr: 'MD', boy: 'Liam', girl: 'Ailany', prevBoy: 'Liam', prevGirl: 'Olivia' },
  { state: 'Massachusetts', abbr: 'MA', boy: 'Noah', girl: 'Charlotte', prevBoy: 'Noah', prevGirl: 'Olivia' },
  { state: 'Michigan', abbr: 'MI', boy: 'Theodore', girl: 'Charlotte', prevBoy: 'Noah', prevGirl: 'Charlotte' },
  { state: 'Minnesota', abbr: 'MN', boy: 'Theodore', girl: 'Charlotte', prevBoy: 'Liam', prevGirl: 'Charlotte' },
  { state: 'Mississippi', abbr: 'MS', boy: 'James', girl: 'Amelia', prevBoy: 'William', prevGirl: 'Ava' },
  { state: 'Missouri', abbr: 'MO', boy: 'Oliver', girl: 'Charlotte', prevBoy: 'Oliver', prevGirl: 'Amelia' },
  { state: 'Montana', abbr: 'MT', boy: 'Oliver', girl: 'Charlotte', prevBoy: 'Oliver', prevGirl: 'Lainey' },
  { state: 'Nebraska', abbr: 'NE', boy: 'Liam', girl: 'Charlotte', prevBoy: 'Oliver', prevGirl: 'Charlotte' },
  { state: 'Nevada', abbr: 'NV', boy: 'Liam', girl: 'Olivia', prevBoy: 'Liam', prevGirl: 'Olivia' },
  { state: 'New Hampshire', abbr: 'NH', boy: 'Theodore', girl: 'Charlotte', prevBoy: 'Theodore', prevGirl: 'Charlotte' },
  { state: 'New Jersey', abbr: 'NJ', boy: 'Liam', girl: 'Emma', prevBoy: 'Liam', prevGirl: 'Mia' },
  { state: 'New Mexico', abbr: 'NM', boy: 'Noah', girl: 'Mia', prevBoy: 'Noah', prevGirl: 'Mia' },
  { state: 'New York', abbr: 'NY', boy: 'Noah', girl: 'Emma', prevBoy: 'Liam', prevGirl: 'Mia' },
  { state: 'North Carolina', abbr: 'NC', boy: 'Noah', girl: 'Amelia', prevBoy: 'Liam', prevGirl: 'Olivia' },
  { state: 'North Dakota', abbr: 'ND', boy: 'Liam', girl: 'Charlotte', prevBoy: 'Oliver', prevGirl: 'Evelyn' },
  { state: 'Ohio', abbr: 'OH', boy: 'Oliver', girl: 'Charlotte', prevBoy: 'Oliver', prevGirl: 'Charlotte' },
  { state: 'Oklahoma', abbr: 'OK', boy: 'Liam', girl: 'Olivia', prevBoy: 'Liam', prevGirl: 'Olivia' },
  { state: 'Oregon', abbr: 'OR', boy: 'Oliver', girl: 'Charlotte', prevBoy: 'Oliver', prevGirl: 'Olivia' },
  { state: 'Pennsylvania', abbr: 'PA', boy: 'Noah', girl: 'Charlotte', prevBoy: 'Noah', prevGirl: 'Olivia' },
  { state: 'Rhode Island', abbr: 'RI', boy: 'Noah', girl: 'Charlotte', prevBoy: 'Liam', prevGirl: 'Charlotte' },
  { state: 'South Carolina', abbr: 'SC', boy: 'Noah', girl: 'Charlotte', prevBoy: 'Noah', prevGirl: 'Charlotte' },
  { state: 'South Dakota', abbr: 'SD', boy: 'Oliver', girl: 'Lainey', prevBoy: 'Liam', prevGirl: 'Amelia' },
  { state: 'Tennessee', abbr: 'TN', boy: 'Noah', girl: 'Charlotte', prevBoy: 'Liam', prevGirl: 'Amelia' },
  { state: 'Texas', abbr: 'TX', boy: 'Liam', girl: 'Emma', prevBoy: 'Liam', prevGirl: 'Olivia' },
  { state: 'Utah', abbr: 'UT', boy: 'Oliver', girl: 'Emma', prevBoy: 'Oliver', prevGirl: 'Olivia' },
  { state: 'Vermont', abbr: 'VT', boy: 'Oliver', girl: 'Charlotte', prevBoy: 'Oliver', prevGirl: 'Amelia' },
  { state: 'Virginia', abbr: 'VA', boy: 'Liam', girl: 'Charlotte', prevBoy: 'Liam', prevGirl: 'Charlotte' },
  { state: 'Washington', abbr: 'WA', boy: 'Noah', girl: 'Olivia', prevBoy: 'Oliver', prevGirl: 'Olivia' },
  { state: 'West Virginia', abbr: 'WV', boy: 'Waylon', girl: 'Charlotte', prevBoy: 'Oliver', prevGirl: 'Amelia' },
  { state: 'Wisconsin', abbr: 'WI', boy: 'Oliver', girl: 'Charlotte', prevBoy: 'Oliver', prevGirl: 'Charlotte' },
  { state: 'Wyoming', abbr: 'WY', boy: 'Theodore', girl: 'Aurora', prevBoy: 'Oliver', prevGirl: 'Emma' },
];

// ── Curated thematic lists ───────────────────────────────────────────────────
// These are editorial selections, not statistics. Each is resolved against the
// manifest at render time, so the linked subset is always real.

export const VINTAGE_NAMES = [
  'Eleanor', 'Clara', 'Alice', 'Nora', 'Evelyn', 'Hazel', 'Violet', 'Ruby', 'Rose', 'Grace',
  'Charlotte', 'Amelia', 'Margaret', 'Frances', 'Ruth', 'Esther', 'Sylvia', 'Josephine', 'Genevieve',
  'Lillian', 'Beatrice', 'Dorothy', 'Mabel', 'Florence', 'Edith', 'Agnes', 'Harriet', 'Winifred',
  'Clementine', 'Matilda', 'Penelope', 'Delilah', 'Ophelia', 'Cordelia', 'Theodora', 'Cecilia',
  'Theodore', 'Henry', 'Walter', 'Arthur', 'Oliver', 'Leo', 'Jack', 'George', 'Frank', 'Louis',
  'Samuel', 'Benjamin', 'Vincent', 'Augustus', 'Edmund', 'Alfred', 'Ernest', 'Stanley', 'Harold',
  'Milton', 'Clifford', 'Reginald', 'Percival', 'Archibald', 'Bartholomew', 'Cornelius', 'Ezekiel',
  'Gideon', 'Josiah', 'Silas', 'Amos', 'Elias', 'Levi', 'Ezra', 'Asher', 'Abel', 'Enoch', 'Isaiah',
  'Jeremiah', 'Nathaniel', 'Reuben', 'Simeon', 'Thaddeus', 'Tobias', 'Zachariah', 'Felix', 'August',
  'Eloise', 'Iris', 'Maeve', 'Willa', 'Juniper', 'Marlowe', 'Sylvie', 'Rosalind', 'Imogen', 'Adeline',
];

export const NATURE_NAMES = [
  'Willow', 'Hazel', 'Ivy', 'Rose', 'Lily', 'Violet', 'Daisy', 'Poppy', 'Jasmine', 'Laurel',
  'Heather', 'Holly', 'Iris', 'Fern', 'Sage', 'Wren', 'Robin', 'Lark', 'Raven', 'Aspen',
  'Cedar', 'Rowan', 'Ash', 'Birch', 'Forrest', 'River', 'Brooks', 'Stone', 'Flint', 'Clay',
  'Sky', 'Rain', 'Storm', 'Winter', 'Summer', 'Autumn', 'Aurora', 'Luna', 'Nova', 'Stella',
  'Celeste', 'Marisol', 'Marina', 'Coral', 'Pearl', 'Opal', 'Ruby', 'Jade', 'Amber', 'Crystal',
  'Meadow', 'Prairie', 'Sierra', 'Savannah', 'Dakota', 'Cheyenne', 'Juniper', 'Magnolia', 'Camellia',
  'Azalea', 'Zinnia', 'Marigold', 'Clover', 'Sorrel', 'Tansy', 'Yarrow', 'Alder', 'Hawthorn',
  'Linden', 'Oakley', 'Sylvan', 'Heath', 'Dale', 'Glenn', 'Wade', 'Ford', 'Cliff', 'Ridge',
  'Slate', 'Onyx', 'Jasper', 'Ember', 'Blaze', 'Phoenix', 'Orion', 'Atlas', 'Leo', 'Sirius',
  'Vega', 'Lyra', 'Andromeda', 'Callisto', 'Selene', 'Helios', 'Zephyr', 'Aquila', 'Corvus', 'Cygnus',
];

export const SHORT_NAMES = [
  'Kai', 'Leo', 'Max', 'Eli', 'Ivy', 'Ava', 'Mia', 'Zoe', 'Rue', 'Lux',
  'Wren', 'Nico', 'Zia', 'Jax', 'Rex', 'Fox', 'Kit', 'Ash', 'Bo', 'Cy',
  'Dee', 'Ed', 'Gil', 'Hal', 'Ike', 'Jo', 'Kim', 'Lou', 'Mac', 'Ned',
  'Oli', 'Pat', 'Ray', 'Sam', 'Ted', 'Tom', 'Val', 'Wes', 'Zac', 'Ada',
  'Bea', 'Cleo', 'Dot', 'Eve', 'Fay', 'Gia', 'Hana', 'Ida', 'Joy', 'Kay',
  'Lia', 'May', 'Nia', 'Ora', 'Pia', 'Ria', 'Sue', 'Tia', 'Una', 'Via',
  'Wyn', 'Xena', 'Yara', 'Zara', 'Noa', 'Remi', 'Romy', 'Sena', 'Tova', 'Vera',
  'Willa', 'Anya', 'Bria', 'Cora', 'Dara', 'Elsa', 'Freya', 'Greta', 'Hilda', 'Ines',
  'Juno', 'Kira', 'Lena', 'Mira', 'Nina', 'Orla', 'Quinn', 'Rhea', 'Sela', 'Thea',
  'Uma', 'Vita', 'Zora', 'Ari', 'Ben', 'Cal', 'Dan', 'Gus', 'Hugo', 'Ira',
];

export const GENDER_NEUTRAL_NAMES = [
  'Quinn', 'Parker', 'Remi', 'Rowan', 'Avery', 'Riley', 'Jordan', 'Casey', 'Taylor', 'Morgan',
  'Jamie', 'Alex', 'Sam', 'Charlie', 'Emerson', 'Finley', 'Hayden', 'Kendall', 'Logan', 'Marlowe',
  'Micah', 'Noah', 'Oakley', 'Phoenix', 'Reagan', 'River', 'Rory', 'Sage', 'Sawyer', 'Shiloh',
  'Skyler', 'Sloane', 'Tatum', 'Blake', 'Cameron', 'Dakota', 'Drew', 'Ellis', 'Frankie', 'Greer',
  'Harper', 'Indigo', 'Jules', 'Kai', 'Lennon', 'Marley', 'Monroe', 'Nico', 'Onyx', 'Peyton',
  'Reese', 'Robin', 'Ryan', 'Spencer', 'Sydney', 'Toby', 'Wren', 'Zion', 'Arden', 'Blair',
  'Campbell', 'Devin', 'Easton', 'Fallon', 'Harbor', 'Justice', 'Kit', 'Lane', 'Merritt', 'Nova',
  'Ocean', 'Palmer', 'Quincy', 'Raine', 'Storm', 'True', 'Wynn', 'Zephyr', 'Ari', 'Bay',
  'Cedar', 'Dune', 'Eden', 'Fable', 'Gray', 'Haven', 'Ira', 'Juno', 'Koa', 'Lior',
];

// ── Manifest index + resolver ────────────────────────────────────────────────
// Built once per server instance. Maps a lowercased name to its real profile.
let _index = null;

export function getNameIndex() {
  if (_index) return _index;
  const manifest = getManifest();
  const map = new Map();
  for (const rel of Object.keys(manifest)) {
    for (const item of manifest[rel] || []) {
      if (!item.name || !item.slug) continue;
      const key = String(item.name).toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          name: item.name,
          slug: item.slug,
          religion: rel,
          meaning: item.meaning || '',
          origin: item.origin || '',
          gender: item.gender || '',
          popularity_score: item.popularity_score || 0,
        });
      }
    }
  }
  _index = map;
  return map;
}

// Resolve one name to a linkable record, or to a plain-text record when we hold
// no profile. Never returns a href that would 404.
export function resolveName(name) {
  const idx = getNameIndex();
  const hit = idx.get(String(name || '').toLowerCase());
  if (!hit) return { name, href: null, hasProfile: false };
  return {
    name: hit.name,
    href: `/names/${hit.religion}/${hit.slug}`,
    hasProfile: true,
    religion: hit.religion,
    meaning: hit.meaning,
    origin: hit.origin,
    gender: hit.gender,
  };
}

export function resolveNames(names) {
  return (names || []).map(resolveName);
}

// How many of a curated list we can actually link. Used by the build verifier
// and shown on the page as an honest coverage figure.
export function coverage(names) {
  const resolved = resolveNames(names);
  const linked = resolved.filter((r) => r.hasProfile).length;
  return { total: resolved.length, linked, resolved };
}

// ── Dataset-backed selections ────────────────────────────────────────────────
// These pull straight from the verified manifest, so every result is linkable.

export function getBiblicalNames(limit = 120) {
  const manifest = getManifest();
  const out = [];
  for (const rel of Object.keys(manifest)) {
    for (const item of manifest[rel] || []) {
      if (!item.slug || !item.meaning) continue;
      const origin = String(item.origin || '');
      const isBiblical = /biblical/i.test(origin);
      if (isBiblical) out.push({ ...item, religion: rel });
    }
  }
  out.sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0));
  return out.slice(0, limit);
}

export function getIslamicNames(limit = 120) {
  const manifest = getManifest();
  const items = (manifest.islamic || []).filter((i) => i.slug && i.meaning);
  const sorted = [...items].sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0));
  return sorted.slice(0, limit).map((i) => ({ ...i, religion: 'islamic' }));
}

// ── Keyword map ──────────────────────────────────────────────────────────────
// The strategy artifact: every US page, its target slug, its intent, and the
// keyword set it is built to rank for.
export const US_CLUSTERS = [
  {
    slug: 'popular-names-2026',
    h1: 'Most Popular Baby Names of 2026',
    primary: 'most popular baby names 2026',
    intent: 'Informational',
    longTails: [
      'most popular baby names 2026',
      'popular baby names 2026 usa',
      'what are the most popular baby names this year',
      'top baby names 2026 ssa',
      'most common baby names 2026',
    ],
    lsi: ['national ranking', 'birth records', 'SSA data', 'name popularity', 'year-over-year'],
    schema: ['CollectionPage', 'ItemList', 'FAQPage', 'BreadcrumbList', 'Article'],
  },
  {
    slug: 'top-baby-names-2026',
    h1: 'Top Baby Names of 2026 — Boys and Girls',
    primary: 'top baby names 2026',
    intent: 'Informational',
    longTails: [
      'top baby names 2026',
      'top 100 baby names 2026',
      'top boy names 2026',
      'top girl names 2026',
      'most popular boy names in america',
      'most popular girl names in america',
    ],
    lsi: ['ranked list', 'boys', 'girls', 'national top 10', 'ranking table'],
    schema: ['CollectionPage', 'ItemList', 'FAQPage', 'BreadcrumbList', 'Article'],
  },
  {
    slug: 'unique-baby-names',
    h1: 'Unique Baby Names — Rare Picks With Real Meaning',
    primary: 'unique baby names',
    intent: 'Commercial',
    longTails: [
      'unique baby names 2026',
      'rare baby names',
      'uncommon baby names',
      'unique boy names',
      'unique girl names',
      'baby names nobody else has',
    ],
    lsi: ['rarity', 'distinctive', 'uncommon', 'shortlist', 'meaning'],
    schema: ['CollectionPage', 'ItemList', 'FAQPage', 'BreadcrumbList', 'Article'],
  },
  {
    slug: 'gender-neutral-names',
    h1: 'Gender-Neutral Baby Names',
    primary: 'gender neutral baby names',
    intent: 'Commercial',
    longTails: [
      'gender neutral baby names',
      'unisex baby names 2026',
      'gender neutral names for boys and girls',
      'nonbinary baby names',
      'androgynous names',
    ],
    lsi: ['unisex', 'androgynous', 'gender-inclusive', 'cross-gender usage'],
    schema: ['CollectionPage', 'ItemList', 'FAQPage', 'BreadcrumbList', 'Article'],
  },
  {
    slug: 'baby-names-by-state',
    h1: 'Most Popular Baby Names by State',
    primary: 'baby names by state',
    intent: 'Informational',
    longTails: [
      'most popular baby names by state',
      'popular baby names in my state',
      'top baby names by state 2026',
      'most popular boy names by state',
      'most popular girl names by state',
    ],
    lsi: ['state-level data', 'regional variation', 'SSA state dataset', 'year-over-year'],
    schema: ['CollectionPage', 'ItemList', 'FAQPage', 'BreadcrumbList', 'Article'],
  },
  {
    slug: 'vintage-baby-names',
    h1: 'Vintage Baby Names Making a Comeback',
    primary: 'vintage baby names',
    intent: 'Commercial',
    longTails: [
      'vintage baby names',
      'old fashioned baby names',
      'vintage baby names making a comeback',
      'classic baby names 2026',
      'heirloom baby names',
      'antique baby names',
    ],
    lsi: ['revival', 'heritage', 'nostalgia', 'classic', 'generational'],
    schema: ['CollectionPage', 'ItemList', 'FAQPage', 'BreadcrumbList', 'Article'],
  },
  {
    slug: 'biblical-baby-names',
    h1: 'Biblical Baby Names for Boys and Girls',
    primary: 'biblical baby names',
    intent: 'Commercial',
    longTails: [
      'biblical baby names',
      'biblical names for boys',
      'biblical names for girls',
      'bible names and meanings',
      'hebrew bible baby names',
    ],
    lsi: ['scripture', 'Hebrew', 'Old Testament', 'New Testament', 'meaning'],
    schema: ['CollectionPage', 'ItemList', 'FAQPage', 'BreadcrumbList', 'Article'],
  },
  {
    slug: 'muslim-baby-names-america',
    h1: 'Muslim Baby Names Popular in America',
    primary: 'muslim baby names in america',
    intent: 'Commercial',
    longTails: [
      'muslim baby names in america',
      'islamic baby names usa',
      'popular muslim boy names in america',
      'popular muslim girl names in america',
      'arabic baby names in the us',
    ],
    lsi: ['Arabic', 'Quranic', 'transliteration', 'American usage', 'meaning'],
    schema: ['CollectionPage', 'ItemList', 'FAQPage', 'BreadcrumbList', 'Article'],
  },
  {
    slug: 'nature-baby-names',
    h1: 'Nature Baby Names',
    primary: 'nature baby names',
    intent: 'Commercial',
    longTails: [
      'nature baby names',
      'nature inspired baby names 2026',
      'flower baby names',
      'tree baby names',
      'celestial baby names',
      'earth baby names',
    ],
    lsi: ['botanical', 'celestial', 'landscape', 'seasonal', 'natural world'],
    schema: ['CollectionPage', 'ItemList', 'FAQPage', 'BreadcrumbList', 'Article'],
  },
  {
    slug: 'short-baby-names',
    h1: 'Short Baby Names — One and Two Syllables',
    primary: 'short baby names',
    intent: 'Commercial',
    longTails: [
      'short baby names',
      'one syllable baby names',
      'short boy names',
      'short girl names',
      '3 letter baby names',
      'minimalist baby names',
    ],
    lsi: ['syllable count', 'minimalist', 'easy to spell', 'modern'],
    schema: ['CollectionPage', 'ItemList', 'FAQPage', 'BreadcrumbList', 'Article'],
  },
];

export function getCluster(slug) {
  return US_CLUSTERS.find((c) => c.slug === slug) || null;
}

export default {
  SSA_TOP_10,
  BABYCENTER_2026,
  STATE_TOP_NAMES,
  VINTAGE_NAMES,
  NATURE_NAMES,
  SHORT_NAMES,
  GENDER_NEUTRAL_NAMES,
  US_CLUSTERS,
  getCluster,
  getNameIndex,
  resolveName,
  resolveNames,
  coverage,
  getBiblicalNames,
  getIslamicNames,
};
