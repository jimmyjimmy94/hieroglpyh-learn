export interface CardState {
  id: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: number;
  lastReview: number | null;
  reviewed: number;
  correct: number;
}

interface ScheduledCard {
  id: string;
  due: boolean;
  card: CardState;
}

const STORAGE_KEY = 'hieroglyph_srs';

export function loadCards(): Record<string, CardState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* corrupted data, start fresh */ }
  return {};
}

export function saveCards(cards: Record<string, CardState>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

export function initCard(id: string): CardState {
  return {
    id,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: Date.now(),
    lastReview: null,
    reviewed: 0,
    correct: 0,
  };
}

export function getDueCards(
  glyphIds: string[],
  cards: Record<string, CardState>,
  limit: number = 20,
): ScheduledCard[] {
  const now = Date.now();
  const all: ScheduledCard[] = glyphIds.map(id => {
    const card = cards[id] || initCard(id);
    return { id, due: card.nextReview <= now, card };
  });

  const due = all.filter(c => c.due);
  const sorted = [...due].sort((a, b) => a.card.nextReview - b.card.nextReview);
  return sorted.slice(0, limit);
}

export function gradeCard(
  card: CardState,
  quality: 0 | 1 | 2 | 3 | 4 | 5,
): CardState {
  const c = { ...card };
  c.lastReview = Date.now();
  c.reviewed++;
  c.nextReview = Date.now();

  if (quality >= 3) {
    c.correct++;
    if (c.repetitions === 0) {
      c.interval = 1;
    } else if (c.repetitions === 1) {
      c.interval = 3;
    } else if (c.repetitions === 2) {
      c.interval = 7;
    } else {
      c.interval = Math.round(c.interval * c.easeFactor);
    }
    c.repetitions++;
  } else {
    c.repetitions = 0;
    c.interval = 1;
  }

  c.easeFactor = Math.max(
    1.3,
    c.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
  );

  const intervalMs = c.interval * 24 * 60 * 60 * 1000;
  c.nextReview = Date.now() + intervalMs;

  return c;
}
