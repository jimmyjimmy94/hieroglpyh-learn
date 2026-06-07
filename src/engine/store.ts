import { create } from 'zustand';
import { loadCards, saveCards, initCard, gradeCard, getDueCards } from '../engine/srs';
import type { CardState } from '../engine/srs';
import { uniliterals, determinatives, biliteralsAndTriliterals, vocabulary, wordlandVocab } from '../data/vocabulary';
import type { Glyph } from '../data/vocabulary';
import { recordPractice, loadStreak, getToday } from '../utils';
import type { StreakData } from '../utils';

export type PracticeMode = 'flashcard' | 'type' | 'quiz';
export type AppView = 'home' | 'practice' | 'reading' | 'names' | 'progress' | 'write';
export type Deck = 'uniliterals' | 'all' | 'vocabulary' | 'determinatives' | 'wordland';
export type Theme = 'light' | 'dark';

interface AppState {
  view: AppView;
  practiceMode: PracticeMode;
  deck: Deck;
  theme: Theme;
  cards: Record<string, CardState>;
  sessionQueue: Glyph[];
  sessionIndex: number;
  cardFlipped: boolean;
  sessionStats: { correct: number; total: number; startTime: number };
  streak: StreakData;
  onboarded: boolean;

  setView: (view: AppView) => void;
  setPracticeMode: (mode: PracticeMode) => void;
  setDeck: (deck: Deck) => void;
  toggleTheme: () => void;
  loadSRS: () => void;

  startSession: () => void;
  flipCard: () => void;
  rateCard: (quality: 0 | 1 | 2 | 3 | 4 | 5) => void;
  resetSession: () => void;
  recordActivity: () => void;

  getGlyphsForDeck: () => Glyph[];
  getDueCount: () => number;
  getSRSStats: () => { total: number; due: number; mature: number; reviewed: number; correct: number };
  getWeakWords: () => Glyph[];
  markOnboarded: () => void;
}

function getGlyphsForDeck(deck: Deck): Glyph[] {
  switch (deck) {
    case 'uniliterals': return uniliterals;
    case 'vocabulary': return [...vocabulary, ...biliteralsAndTriliterals];
    case 'determinatives': return determinatives;
    case 'wordland': return wordlandVocab;
    case 'all': return [...uniliterals, ...determinatives, ...biliteralsAndTriliterals, ...vocabulary];
  }
}

export const useStore = create<AppState>((set, get) => ({
  view: 'home',
  practiceMode: 'flashcard',
  deck: 'all',
  theme: (localStorage.getItem('hieroglyph_theme') as Theme) || 'light',
  cards: {},
  sessionQueue: [],
  sessionIndex: 0,
  cardFlipped: false,
  sessionStats: { correct: 0, total: 0, startTime: 0 },
  streak: { currentStreak: 0, lastPracticeDate: null, practiceDates: [] },
  onboarded: localStorage.getItem('hieroglyph_onboarded') === 'true',

  setView: (view) => set({ view }),
  setPracticeMode: (mode) => set({ practiceMode: mode }),
  setDeck: (deck) => set({ deck }),

  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('hieroglyph_theme', next);
    document.documentElement.setAttribute('data-theme', next);
    set({ theme: next });
  },

  markOnboarded: () => {
    localStorage.setItem('hieroglyph_onboarded', 'true');
    set({ onboarded: true });
  },

  loadSRS: () => {
    const cards = loadCards();
    const streak = loadStreak();
    const today = getToday();
    if (streak.lastPracticeDate) {
      const last = new Date(streak.lastPracticeDate);
      const now = new Date(today);
      const diffDays = Math.floor((now.getTime() - last.getTime()) / 86400000);
      if (diffDays > 1) {
        streak.currentStreak = 0;
      }
    }
    set({ cards, streak });
  },

  recordActivity: () => {
    const streak = recordPractice();
    set({ streak });
  },

  startSession: () => {
    const state = get();
    get().recordActivity();

    const glyphs = getGlyphsForDeck(state.deck);
    const cards = loadCards();
    const due = getDueCards(
      glyphs.map(g => g.id),
      cards,
      state.deck === 'all' ? 30 : 20,
    );

    let queue: Glyph[];
    if (due.length > 0) {
      queue = due
        .map(d => glyphs.find(g => g.id === d.id))
        .filter((g): g is Glyph => g !== undefined);
    } else {
      const shuffled = [...glyphs].sort(() => Math.random() - 0.5);
      queue = shuffled.slice(0, state.deck === 'all' ? 20 : 10);
    }
    queue = queue.sort(() => Math.random() - 0.5);

    set({
      sessionQueue: queue,
      sessionIndex: 0,
      cardFlipped: false,
      sessionStats: { correct: 0, total: queue.length, startTime: Date.now() },
    });
  },

  flipCard: () => set(s => ({ cardFlipped: !s.cardFlipped })),

  rateCard: (quality) => {
    const state = get();
    const currentGlyph = state.sessionQueue[state.sessionIndex];
    if (!currentGlyph) return;

    const card = state.cards[currentGlyph.id] || initCard(currentGlyph.id);
    const updated = gradeCard(card, quality);
    const newCards = { ...state.cards, [currentGlyph.id]: updated };
    saveCards(newCards);

    const isCorrect = quality >= 3;
    if (state.sessionIndex + 1 >= state.sessionQueue.length) {
      set({
        cards: newCards,
        sessionIndex: state.sessionQueue.length,
        sessionStats: { ...state.sessionStats, correct: state.sessionStats.correct + (isCorrect ? 1 : 0) },
      });
    } else {
      set({
        cards: newCards,
        sessionIndex: state.sessionIndex + 1,
        cardFlipped: false,
        sessionStats: { ...state.sessionStats, correct: state.sessionStats.correct + (isCorrect ? 1 : 0) },
      });
    }
  },

  resetSession: () => set({ sessionQueue: [], sessionIndex: 0, cardFlipped: false }),

  getGlyphsForDeck: () => getGlyphsForDeck(get().deck),
  getDueCount: () => {
    const state = get();
    const glyphs = getGlyphsForDeck(state.deck);
    const cards = loadCards();
    return getDueCards(glyphs.map(g => g.id), cards, 100).length;
  },

  getSRSStats: () => {
    const cards = loadCards();
    const entries = Object.values(cards);
    const now = Date.now();
    return {
      total: entries.length,
      due: entries.filter(c => c.nextReview <= now).length,
      mature: entries.filter(c => c.interval >= 21).length,
      reviewed: entries.reduce((s, c) => s + c.reviewed, 0),
      correct: entries.reduce((s, c) => s + c.correct, 0),
    };
  },

  getWeakWords: () => {
    const all = getGlyphsForDeck('all');
    const cards = loadCards();
    return all
      .filter(g => {
        const c = cards[g.id];
        return c && c.reviewed >= 3 && c.repetitions <= 1;
      })
      .slice(0, 15);
  },
}));
