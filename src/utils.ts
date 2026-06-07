export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const STREAK_KEY = 'hieroglyph_streak';

export interface StreakData {
  currentStreak: number;
  lastPracticeDate: string | null;
  practiceDates: string[];
}

export function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export function loadStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { currentStreak: 0, lastPracticeDate: null, practiceDates: [] };
}

export function recordPractice(): StreakData {
  const streak = loadStreak();
  const today = getToday();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (streak.lastPracticeDate === today) return streak;

  if (streak.lastPracticeDate === yesterday) {
    streak.currentStreak++;
  } else if (streak.lastPracticeDate !== today) {
    streak.currentStreak = 1;
  }

  streak.lastPracticeDate = today;
  if (!streak.practiceDates.includes(today)) {
    streak.practiceDates.push(today);
  }
  localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  return streak;
}

export function exportSRSData(): void {
  const data: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('hieroglyph_') || key === 'hieroglyph_srs' || key === 'hieroglyph_streak')) {
      const val = localStorage.getItem(key);
      if (val) data[key] = val;
    }
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hieroglyph-academy-backup-${getToday()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importSRSData(onDone: () => void): void {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        for (const [key, value] of Object.entries(data)) {
          if (typeof value === 'string') {
            localStorage.setItem(key, value);
          }
        }
        onDone();
      } catch { /* ignore corrupt files */ }
    };
    reader.readAsText(file);
  };
  input.click();
}
