export interface Glyph {
  id: string;
  hieroglyph: string;
  transliteration: string;
  meaning: string;
  gardiner: string;
  category: 'uniliteral' | 'biliteral' | 'triliteral' | 'determinative' | 'vocabulary' | 'phrase';
  imageUrl?: string;
  notes?: string;
  sound?: string;
  phonogram?: boolean;
  logogram?: boolean;
}

export interface ReadingPassage {
  id: string;
  title: string;
  hieroglyph: string;
  transliteration: string;
  translation: string;
  source: string;
  notes: string;
}

export interface NameEtymology {
  name: string;
  hieroglyph: string;
  meaning: string;
  breakdown: string;
  historical: string;
}

export const uniliterals: Glyph[] = [
  { id: 'G1', hieroglyph: '𓄿', transliteration: 'ꜣ', meaning: 'aleph (vulture)', gardiner: 'G1', category: 'uniliteral', sound: 'glottal stop', phonogram: true },
  { id: 'M17', hieroglyph: '𓇋', transliteration: 'ỉ', meaning: 'yod (flowering reed)', gardiner: 'M17', category: 'uniliteral', sound: 'i/ee', phonogram: true },
  { id: 'M17A', hieroglyph: '𓇌', transliteration: 'y', meaning: 'double reed (pair of reeds)', gardiner: 'M17A', category: 'uniliteral', sound: 'y', phonogram: true },
  { id: 'D36', hieroglyph: '𓂝', transliteration: 'ˁ', meaning: 'ayin (arm)', gardiner: 'D36', category: 'uniliteral', sound: 'guttural a', phonogram: true },
  { id: 'G43', hieroglyph: '𓅱', transliteration: 'w', meaning: 'quail chick', gardiner: 'G43', category: 'uniliteral', sound: 'w/u', phonogram: true },
  { id: 'D58', hieroglyph: '𓃀', transliteration: 'b', meaning: 'foot/leg', gardiner: 'D58', category: 'uniliteral', sound: 'b', phonogram: true },
  { id: 'Q3', hieroglyph: '𓊪', transliteration: 'p', meaning: 'stool/mat', gardiner: 'Q3', category: 'uniliteral', sound: 'p', phonogram: true },
  { id: 'I9', hieroglyph: '𓆑', transliteration: 'f', meaning: 'horned viper', gardiner: 'I9', category: 'uniliteral', sound: 'f', phonogram: true },
  { id: 'G17', hieroglyph: '𓅓', transliteration: 'm', meaning: 'owl', gardiner: 'G17', category: 'uniliteral', sound: 'm', phonogram: true },
  { id: 'N35', hieroglyph: '𓈖', transliteration: 'n', meaning: 'water ripple', gardiner: 'N35', category: 'uniliteral', sound: 'n', phonogram: true },
  { id: 'D21', hieroglyph: '𓂋', transliteration: 'r', meaning: 'mouth', gardiner: 'D21', category: 'uniliteral', sound: 'r', phonogram: true },
  { id: 'O4', hieroglyph: '𓉔', transliteration: 'h', meaning: 'reed shelter/courtyard', gardiner: 'O4', category: 'uniliteral', sound: 'h', phonogram: true },
  { id: 'V28', hieroglyph: '𓎛', transliteration: 'ḥ', meaning: 'twisted wick', gardiner: 'V28', category: 'uniliteral', sound: 'emphatic h', phonogram: true },
  { id: 'Aa1', hieroglyph: '𓐍', transliteration: 'ḫ', meaning: 'placenta / unknown object', gardiner: 'Aa1', category: 'uniliteral', sound: 'kh (loch)', phonogram: true },
  { id: 'F32', hieroglyph: '𓄡', transliteration: 'ẖ', meaning: 'animal belly & tail', gardiner: 'F32', category: 'uniliteral', sound: 'soft kh', phonogram: true },
  { id: 'O34', hieroglyph: '𓊃', transliteration: 'z/s', meaning: 'door bolt', gardiner: 'O34', category: 'uniliteral', sound: 'z/s', phonogram: true },
  { id: 'S29', hieroglyph: '𓋴', transliteration: 's', meaning: 'folded cloth', gardiner: 'S29', category: 'uniliteral', sound: 's', phonogram: true },
  { id: 'N37', hieroglyph: '𓈙', transliteration: 'š', meaning: 'garden pool', gardiner: 'N37', category: 'uniliteral', sound: 'sh', phonogram: true },
  { id: 'N29', hieroglyph: '𓈈', transliteration: 'ḳ', meaning: 'hill slope', gardiner: 'N29', category: 'uniliteral', sound: 'emphatic k', phonogram: true },
  { id: 'V31', hieroglyph: '𓎡', transliteration: 'k', meaning: 'basket with handle', gardiner: 'V31', category: 'uniliteral', sound: 'k', phonogram: true },
  { id: 'W11', hieroglyph: '𓎼', transliteration: 'g', meaning: 'jar stand', gardiner: 'W11', category: 'uniliteral', sound: 'g', phonogram: true },
  { id: 'X1', hieroglyph: '𓏏', transliteration: 't', meaning: 'bread loaf', gardiner: 'X1', category: 'uniliteral', sound: 't', phonogram: true },
  { id: 'V13', hieroglyph: '𓍿', transliteration: 'ṯ', meaning: 'tethering rope', gardiner: 'V13', category: 'uniliteral', sound: 'tj/ch', phonogram: true },
  { id: 'D46', hieroglyph: '𓂧', transliteration: 'd', meaning: 'hand', gardiner: 'D46', category: 'uniliteral', sound: 'd', phonogram: true },
  { id: 'I10', hieroglyph: '𓆓', transliteration: 'ḏ', meaning: 'cobra', gardiner: 'I10', category: 'uniliteral', sound: 'dj', phonogram: true },
];

export const determinatives: Glyph[] = [
  { id: 'A1', hieroglyph: '𓀀', transliteration: '', meaning: 'seated man', gardiner: 'A1', category: 'determinative', notes: 'man, person, occupation' },
  { id: 'B1', hieroglyph: '𓁐', transliteration: '', meaning: 'seated woman', gardiner: 'B1', category: 'determinative', notes: 'woman, female' },
  { id: 'A2', hieroglyph: '𓀁', transliteration: '', meaning: 'man with hand to mouth', gardiner: 'A2', category: 'determinative', notes: 'speak, think, eat' },
  { id: 'A17', hieroglyph: '𓀜', transliteration: '', meaning: 'child sitting', gardiner: 'A17', category: 'determinative', notes: 'child, youth' },
  { id: 'A40', hieroglyph: '𓀙', transliteration: '', meaning: 'seated god', gardiner: 'A40', category: 'determinative', notes: 'god, king' },
  { id: 'G7', hieroglyph: '𓅨', transliteration: '', meaning: 'falcon on standard', gardiner: 'G7', category: 'determinative', notes: 'divine, god' },
  { id: 'C1', hieroglyph: '𓁶', transliteration: '', meaning: 'god with sun disk', gardiner: 'C1', category: 'determinative', notes: 'Re, sun god' },
  { id: 'O1', hieroglyph: '𓉐', transliteration: 'pr', meaning: 'house', gardiner: 'O1', category: 'determinative', notes: 'house, building, place' },
  { id: 'N5', hieroglyph: '𓇳', transliteration: 'rˁ', meaning: 'sun (Re)', gardiner: 'N5', category: 'determinative', notes: 'sun, day, time', logogram: true },
  { id: 'N14', hieroglyph: '𓆸', transliteration: '', meaning: 'star', gardiner: 'N14', category: 'determinative', notes: 'star, constellation, hour' },
  { id: 'N1', hieroglyph: '𓇯', transliteration: 'pt', meaning: 'sky', gardiner: 'N1', category: 'determinative', notes: 'sky, heaven, above' },
  { id: 'N33', hieroglyph: '𓈙', transliteration: '', meaning: 'grain of sand', gardiner: 'N33', category: 'determinative', notes: 'metal, mineral, sand' },
  { id: 'M3', hieroglyph: '𓆇', transliteration: '', meaning: 'branch', gardiner: 'M3', category: 'determinative', notes: 'wood, tree' },
  { id: 'D54', hieroglyph: '𓂻', transliteration: '', meaning: 'walking legs', gardiner: 'D54', category: 'determinative', notes: 'movement, walk, go' },
  { id: 'M2', hieroglyph: '𓇐', transliteration: '', meaning: 'herb/plant', gardiner: 'M2', category: 'determinative', notes: 'plant, flower' },
  { id: 'I1', hieroglyph: '𓆙', transliteration: '', meaning: 'lizard', gardiner: 'I1', category: 'determinative', notes: 'reptile' },
  { id: 'W22', hieroglyph: '𓏌', transliteration: '', meaning: 'beer jug', gardiner: 'W22', category: 'determinative', notes: 'pot, vessel, liquid' },
  { id: 'F13', hieroglyph: '𓄮', transliteration: 'wp', meaning: 'horns', gardiner: 'F13', category: 'determinative', notes: 'horn, brow, open' },
  { id: 'D2', hieroglyph: '𓁶', transliteration: 'ḥr', meaning: 'face', gardiner: 'D2', category: 'determinative', notes: 'face, upon' },
  { id: 'Y1', hieroglyph: '𓏛', transliteration: '', meaning: 'papyrus roll', gardiner: 'Y1', category: 'determinative', notes: 'writing, abstract concept' },
];

export const biliteralsAndTriliterals: Glyph[] = [
  { id: 'N35-G1', hieroglyph: '𓈖𓄿', transliteration: 'nꜣ', meaning: 'the (plural)', gardiner: 'N35+G1', category: 'biliteral', notes: 'plural definite article' },
  { id: 'M23-X1', hieroglyph: '𓋔', transliteration: 'nswt', meaning: 'king of Upper Egypt', gardiner: 'M23', category: 'vocabulary', notes: 'nswt-bỉt = king of Upper & Lower Egypt' },
  { id: 'N35-N35', hieroglyph: '𓇒', transliteration: 'nn', meaning: 'not (negation)', gardiner: 'N35+N35', category: 'biliteral', notes: 'nn = not, negation' },
  { id: 'M40', hieroglyph: '𓇰', transliteration: 'ỉs', meaning: 'tomb, old', gardiner: 'M40', category: 'biliteral', notes: 'bundle of reeds' },
  { id: 'W24', hieroglyph: '𓎦', transliteration: 'nw', meaning: 'pot, of (genitive)', gardiner: 'W24', category: 'biliteral', notes: 'pot/vessel' },
  { id: 'E34', hieroglyph: '𓃲', transliteration: 'wn', meaning: 'open', gardiner: 'E34', category: 'biliteral', notes: 'hare' },
  { id: 'F35', hieroglyph: '𓄤', transliteration: 'nfr', meaning: 'beautiful, good, perfect', gardiner: 'F35', category: 'triliteral', notes: 'heart & windpipe', logogram: true },
  { id: 'R8', hieroglyph: '𓊹', transliteration: 'nṯr', meaning: 'god', gardiner: 'R8', category: 'triliteral', notes: 'cloth wound on pole, divine' },
  { id: 'S34', hieroglyph: '𓋹', transliteration: 'ˁnḫ', meaning: 'life, live', gardiner: 'S34', category: 'triliteral', notes: 'ankh symbol, life' },
  { id: 'N5-Z1', hieroglyph: '𓇳', transliteration: 'rˁ', meaning: 'sun, day, Re (sun god)', gardiner: 'N5', category: 'triliteral', notes: 'sun disk' },
];

export const vocabulary: Glyph[] = [
  { id: 'v_nfr', hieroglyph: '𓄤', transliteration: 'nfr', meaning: 'good, beautiful, perfect', gardiner: 'F35', category: 'vocabulary', notes: 'one of the most common adjectives' },
  { id: 'v_ankh', hieroglyph: '𓋹', transliteration: 'ˁnḫ', meaning: 'life, to live', gardiner: 'S34', category: 'vocabulary', notes: 'the ankh symbol' },
  { id: 'v_ntr', hieroglyph: '𓊹', transliteration: 'nṯr', meaning: 'god', gardiner: 'R8', category: 'vocabulary', notes: 'divine being' },
  { id: 'v_ra', hieroglyph: '𓇳', transliteration: 'rˁ', meaning: 'sun, Re (sun god)', gardiner: 'N5', category: 'vocabulary' },
  { id: 'v_pr', hieroglyph: '𓉐', transliteration: 'pr', meaning: 'house, palace', gardiner: 'O1', category: 'vocabulary', notes: 'also means "to go out"' },
  { id: 'v_sn', hieroglyph: '𓌢', transliteration: 'sn', meaning: 'brother', gardiner: 'T22', category: 'vocabulary', notes: 'arrowhead sign' },
  { id: 'v_snt', hieroglyph: '𓌢𓏏', transliteration: 'snt', meaning: 'sister', gardiner: 'T22+X1', category: 'vocabulary', notes: 'sn + t (feminine ending)' },
  { id: 'v_mwt', hieroglyph: '𓅐', transliteration: 'mwt', meaning: 'mother', gardiner: 'G14', category: 'vocabulary', notes: 'vulture' },
  { id: 'v_it', hieroglyph: '𓇋𓏏𓆭', transliteration: 'ỉt', meaning: 'father', gardiner: 'M17+X1+M1', category: 'vocabulary' },
  { id: 'v_sa', hieroglyph: '𓅭', transliteration: 'sꜣ', meaning: 'son', gardiner: 'G39', category: 'vocabulary', notes: 'duck' },
  { id: 'v_sat', hieroglyph: '𓅭𓏏', transliteration: 'sꜣt', meaning: 'daughter', gardiner: 'G39+X1', category: 'vocabulary' },
  { id: 'v_nb', hieroglyph: '𓎟', transliteration: 'nb', meaning: 'lord, master, all', gardiner: 'V30', category: 'vocabulary', notes: 'basket' },
  { id: 'v_nbt', hieroglyph: '𓎟𓏏', transliteration: 'nbt', meaning: 'lady, mistress', gardiner: 'V30+X1', category: 'vocabulary' },
  { id: 'v_djed', hieroglyph: '𓊽', transliteration: 'ḏd', meaning: 'stability, to speak/say', gardiner: 'R11', category: 'vocabulary', notes: 'djed pillar = stability' },
  { id: 'v_djet', hieroglyph: '𓆓𓏏', transliteration: 'ḏt', meaning: 'eternity, forever', gardiner: 'I10+X1', category: 'vocabulary', notes: 'cobra + bread' },
  { id: 'v_heh', hieroglyph: '𓎛𓎛', transliteration: 'ḥḥ', meaning: 'million, eternity', gardiner: 'V28+V28', category: 'vocabulary', notes: 'two twisted wicks' },
  { id: 'v_heqa', hieroglyph: '𓋾', transliteration: 'ḥḳꜣ', meaning: 'ruler, to rule', gardiner: 'S38', category: 'vocabulary', notes: 'crook = rule' },
  { id: 'v_kemet', hieroglyph: '𓆎𓅓𓏏𓊖', transliteration: 'kmt', meaning: 'Egypt (Black Land)', gardiner: 'I6+G17+X1+O49', category: 'vocabulary', notes: 'the ancient name for Egypt' },
  { id: 'v_desheret', hieroglyph: '𓂧𓈙𓂋𓏏', transliteration: 'dšrt', meaning: 'Red Land (desert)', gardiner: 'D46+N37+D21+X1', category: 'vocabulary' },
  { id: 'v_nswt', hieroglyph: '𓇓', transliteration: 'nswt', meaning: 'king', gardiner: 'M23', category: 'vocabulary', notes: 'sedge plant = king of Upper Egypt' },
  { id: 'v_bity', hieroglyph: '𓆤', transliteration: 'bỉty', meaning: 'king of Lower Egypt', gardiner: 'L2', category: 'vocabulary', notes: 'bee symbol' },
  { id: 'v_nswtbity', hieroglyph: '𓇓𓆤', transliteration: 'nswt-bỉty', meaning: 'King of Upper & Lower Egypt', gardiner: 'M23+L2', category: 'vocabulary', notes: 'dual kingship title' },
  { id: 'v_per_aa', hieroglyph: '𓉐𓉻', transliteration: 'pr-ˁꜣ', meaning: 'Pharaoh (Great House)', gardiner: 'O1+O29', category: 'vocabulary', notes: 'lit. "great house" → Pharaoh' },
  { id: 'v_sa_ra', hieroglyph: '𓅭𓇳', transliteration: 'sꜣ rˁ', meaning: 'Son of Re', gardiner: 'G39+N5', category: 'vocabulary', notes: 'royal title' },
  { id: 'v_heb', hieroglyph: '𓎱', transliteration: 'ḥb', meaning: 'festival, feast', gardiner: 'W3', category: 'vocabulary' },
  { id: 'v_im', hieroglyph: '𓇋𓅓', transliteration: 'ỉm', meaning: 'in, there, therein', gardiner: 'M17+G17', category: 'vocabulary' },
  { id: 'v_hen', hieroglyph: '𓉔𓈖', transliteration: 'ḥnˁ', meaning: 'together with, and', gardiner: 'O4+N35', category: 'vocabulary' },
  { id: 'v_ir', hieroglyph: '𓁹', transliteration: 'ỉr', meaning: 'to do, to make; as for', gardiner: 'D4', category: 'vocabulary', notes: 'eye' },
  { id: 'v_her', hieroglyph: '𓁷', transliteration: 'ḥr', meaning: 'upon, on; face', gardiner: 'D2', category: 'vocabulary', notes: 'face = upon' },
  { id: 'v_m', hieroglyph: '𓅓', transliteration: 'm', meaning: 'in, as, with, from', gardiner: 'G17', category: 'vocabulary', notes: 'owl = preposition "in"' },
  { id: 'v_r', hieroglyph: '𓂋', transliteration: 'r', meaning: 'to, toward, at, mouth', gardiner: 'D21', category: 'vocabulary', notes: 'mouth = preposition "to"' },
  { id: 'v_di', hieroglyph: '𓂞', transliteration: 'dỉ/rḏỉ', meaning: 'to give', gardiner: 'D37', category: 'vocabulary', notes: 'arm with bread' },
  { id: 'v_heb_sed', hieroglyph: '𓎱𓋴𓂧', transliteration: 'ḥb-sd', meaning: 'Sed festival (jubilee)', gardiner: 'W3+S29+D46', category: 'vocabulary' },
  { id: 'v_iwn', hieroglyph: '𓉺', transliteration: 'ỉwn', meaning: 'pillar, Heliopolis', gardiner: 'O28', category: 'vocabulary' },
  { id: 'v_maat', hieroglyph: '𓁧', transliteration: 'mꜣˁt', meaning: 'truth, justice, order', gardiner: 'C10', category: 'vocabulary', notes: 'goddess Maat' },
  { id: 'v_dj_ankh', hieroglyph: '𓏙𓋹', transliteration: 'dỉ ˁnḫ', meaning: 'given life', gardiner: 'X8+S34', category: 'phrase', notes: 'common funerary formula: "may he be given life"' },
  { id: 'v_ankh_wedja_seneb', hieroglyph: '𓋹𓍑𓋴', transliteration: 'ˁnḫ wḏꜣ snb', meaning: 'life, prosperity, health', gardiner: 'S34+U'      , category: 'phrase', notes: 'traditional blessing formula' },
  { id: 'v_ankh_djet', hieroglyph: '𓋹𓆓𓏏', transliteration: 'ˁnḫ ḏt', meaning: 'living forever, eternal life', gardiner: 'S34+I10+X1', category: 'phrase' },
  { id: 'v_hotep', hieroglyph: '𓊵', transliteration: 'ḥtp', meaning: 'peace, offering, to be content', gardiner: 'R4', category: 'vocabulary', notes: 'offering table' },
  { id: 'v_imhotep', hieroglyph: '𓇋𓅓𓊵', transliteration: 'ỉy-m-ḥtp', meaning: 'Imhotep ("He comes in peace")', gardiner: 'M17+G17+R4', category: 'vocabulary' },
  { id: 'v_wedjat', hieroglyph: '𓂀', transliteration: 'wḏꜣt', meaning: 'Eye of Horus (sound eye)', gardiner: 'D10', category: 'vocabulary', notes: 'eye of Horus, protection' },
  { id: 'v_ka', hieroglyph: '𓂓', transliteration: 'kꜣ', meaning: 'ka (life force/spirit)', gardiner: 'D28', category: 'vocabulary', notes: 'upraised arms' },
  { id: 'v_ba', hieroglyph: '𓅽', transliteration: 'bꜣ', meaning: 'ba (soul/personality)', gardiner: 'G53', category: 'vocabulary', notes: 'human-headed bird' },
  { id: 'v_akh', hieroglyph: '𓅜', transliteration: 'ꜣḫ', meaning: 'akh (transfigured spirit)', gardiner: 'G25', category: 'vocabulary', notes: 'crested ibis' },
];

export const readingPassages: ReadingPassage[] = [
  {
    id: 'r_cartouche_ramesses',
    title: 'Cartouche of Ramesses II',
    hieroglyph: '𓇳𓄊𓁧𓇳𓍉𓈖',
    transliteration: 'rˁ-ms-sw mry-ỉmn',
    translation: 'Ramesses, Beloved of Amun',
    source: 'Abu Simbel temple inscriptions',
    notes: 'Ra-mes-su = "Re is the one who bore him". The cartouche reads: Re (sun) + mes (born) + su (him) + beloved + Amun.',
  },
  {
    id: 'r_offering_formula',
    title: 'Standard Offering Formula',
    hieroglyph: '𓊵𓏏𓊪𓏲𓏛𓎟𓇿𓇿𓋹',
    transliteration: 'ḥtp-dỉ-nswt nb tꜣwy ˁnḫ',
    translation: 'An offering which the king gives; Lord of the Two Lands, living...',
    source: 'Common funerary stela formula',
    notes: 'ḥtp-dỉ-nswt = "a boon which the king gives" — the standard opening to funerary texts.',
  },
  {
    id: 'r_tutankhamun',
    title: 'Tutankhamun Cartouche',
    hieroglyph: '𓇋𓏠𓈖𓏏𓅱𓏏𓋹',
    transliteration: 'twt-ˁnḫ-ỉmn',
    translation: 'Tutankhamun ("Living image of Amun")',
    source: 'Tutankhamun tomb objects (KV62)',
    notes: 'His birth name: twt-ˁnḫ-ỉmn = "Living image of Amun". He was originally Tutankhaten ("Living image of Aten").',
  },
  {
    id: 'r_nefertiti',
    title: 'Name of Nefertiti',
    hieroglyph: '𓄤𓄤𓄤𓇋𓏏𓇋𓇋𓏏',
    transliteration: 'nfr-nfrw-ỉtn nfrt-ỉỉ.tỉ',
    translation: 'Nefertiti ("The beautiful one has come")',
    source: 'Amarna period inscriptions',
    notes: 'nfr = beautiful (3x for emphasis) + ỉỉ.tỉ = "has come". Her full name: Neferneferuaten Nefertiti.',
  },
];

export const nameEtymologies: NameEtymology[] = [
  {
    name: 'Ramesses',
    hieroglyph: '𓇳𓄊𓁧𓇳𓍉𓈖',
    meaning: 'Born of Re / Re is the one who bore him',
    breakdown: 'rˁ (Re/sun) + ms (born/bore) + sw (him) → "Re bore him"',
    historical: 'Name of 11 pharaohs of the 19th and 20th dynasties. Ramesses II "the Great" ruled 1279-1213 BCE, one of Egypt\'s longest-reigning and most powerful pharaohs.',
  },
  {
    name: 'Tutankhamun',
    hieroglyph: '𓇋𓏠𓈖𓏏𓅱𓏏𓋹',
    meaning: 'Living image of Amun',
    breakdown: 'twt (image/likeness) + ˁnḫ (living) + ỉmn (Amun) → "Living image of Amun"',
    historical: 'Born Tutankhaten ("Living image of Aten"), changed his name when he restored the old religion. Famous for his intact tomb discovered in 1922.',
  },
  {
    name: 'Nefertiti',
    hieroglyph: '𓄤𓄤𓄤𓇋𓏏𓇋𓇋𓏏',
    meaning: 'The beautiful one has come',
    breakdown: 'nfr (beautiful) + nfrw (beauty plural) + ỉtn (Aten) + nfrt (beautiful one) + ỉỉ.tỉ (has come) → "The beautiful one has come"',
    historical: 'Great Royal Wife of Akhenaten. Famous for the iconic bust found at Amarna. May have ruled as pharaoh in her own right after Akhenaten\'s death.',
  },
  {
    name: 'Thutmose',
    hieroglyph: '𓅝𓄟𓋴',
    meaning: 'Born of Thoth',
    breakdown: 'ḏḥwty (Thoth) + ms (born) → "Born of Thoth"',
    historical: 'Name of four pharaohs of the 18th dynasty. Thutmose III (1479-1425 BCE) was one of Egypt\'s greatest warrior pharaohs, creating the largest empire Egypt had ever seen.',
  },
  {
    name: 'Imhotep',
    hieroglyph: '𓇋𓅓𓊵',
    meaning: 'He comes in peace',
    breakdown: 'ỉy (comes) + m (in) + ḥtp (peace) → "He who comes in peace"',
    historical: 'Chancellor to Djoser (3rd dynasty), architect of the Step Pyramid at Saqqara — the first pyramid. Later deified as god of medicine and wisdom.',
  },
  {
    name: 'Amenhotep',
    hieroglyph: '𓇋𓏠𓈖𓊵',
    meaning: 'Amun is satisfied / Amun is content',
    breakdown: 'ỉmn (Amun) + ḥtp (peace, satisfied) → "Amun is satisfied"',
    historical: 'Name of four pharaohs of the 18th dynasty. Amenhotep III ruled during Egypt\'s artistic golden age. Amenhotep IV became Akhenaten.',
  },
  {
    name: 'Hatshepsut',
    hieroglyph: '𓄚𓏏𓈙𓊪𓋴𓏏',
    meaning: 'Foremost of noble women',
    breakdown: 'ḥꜣt (foremost) + špswt (noble women) → "Foremost of noble ladies"',
    historical: 'One of Egypt\'s few female pharaohs (18th dynasty). Ruled as regent then as pharaoh, depicted herself with male regalia. Built the stunning mortuary temple at Deir el-Bahari.',
  },
  {
    name: 'Senusret',
    hieroglyph: '𓄊𓋴𓂋𓏏',
    meaning: 'Man of the goddess Wosret / Man of the powerful one',
    breakdown: 's (man) + n (of) + wsrt (Wosret/powerful one) → "Man of Wosret"',
    historical: 'Name of three pharaohs of the 12th dynasty (Middle Kingdom). Senusret III restructured Egyptian government and expanded into Nubia.',
  },
];

import wordlandRaw from './wordland.json';

interface WordLandEntry {
  id: string;
  transliteration: string;
  meaning: string;
  imageUrl: string;
}

export const wordlandVocab: Glyph[] = (wordlandRaw as WordLandEntry[]).map(e => ({
  id: e.id,
  hieroglyph: '',
  transliteration: e.transliteration,
  meaning: e.meaning,
  gardiner: '',
  category: 'vocabulary' as const,
  imageUrl: `https://d1syy4fa7evm13.cloudfront.net/images/${e.imageUrl.split('/').pop()}`,
}));
