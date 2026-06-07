import { useState } from 'react';
import { useStore } from '../engine/store';
import { loadCards, saveCards } from '../engine/srs';
import { uniliterals, determinatives, vocabulary, biliteralsAndTriliterals } from '../data/vocabulary';
import { exportSRSData, importSRSData } from '../utils';
import type { Glyph } from '../data/vocabulary';

export function Progress() {
  const getSRSStats = useStore(s => s.getSRSStats);
  const loadSRS = useStore(s => s.loadSRS);
  const stats = getSRSStats();
  const cards = loadCards();
  const [confirmReset, setConfirmReset] = useState(false);

  const allGlyphs: Glyph[] = [...uniliterals, ...determinatives, ...biliteralsAndTriliterals, ...vocabulary];

  function getStatus(id: string): 'new' | 'learning' | 'mastered' {
    const c = cards[id];
    if (!c || c.reviewed === 0) return 'new';
    if (c.interval >= 21) return 'mastered';
    return 'learning';
  }

  const avgEase = Object.keys(cards).length > 0
    ? Math.round(Object.values(cards).reduce((s, c) => s + c.easeFactor, 0) / Object.keys(cards).length * 100) / 100
    : 2.5;

  function handleReset() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('hieroglyph_')) keys.push(key);
    }
    keys.forEach(k => localStorage.removeItem(k));
    saveCards({});
    loadSRS();
    setConfirmReset(false);
  }

  return (
    <div className="progress">
      <h2>Progress & Settings</h2>

      <div className="progress-stats">
        <div className="progress-stat"><div className="value">{stats.total}</div><div className="label">Glyphs Started</div></div>
        <div className="progress-stat"><div className="value">{stats.due}</div><div className="label">Due for Review</div></div>
        <div className="progress-stat"><div className="value">{stats.mature}</div><div className="label">Mastered (21d+)</div></div>
        <div className="progress-stat"><div className="value">{stats.reviewed}</div><div className="label">Total Reviews</div></div>
        <div className="progress-stat">
          <div className="value">{stats.total > 0 ? Math.round((stats.correct / Math.max(1, stats.reviewed)) * 100) : 0}%</div>
          <div className="label">Retention</div>
        </div>
        <div className="progress-stat">
          <div className="value">{avgEase}</div>
          <div className="label">Avg Ease</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button className="start-btn" style={{ padding: '8px 18px', fontSize: '0.82rem' }} onClick={exportSRSData}>
          Export Backup
        </button>
        <button className="start-btn" style={{ padding: '8px 18px', fontSize: '0.82rem' }}
          onClick={() => importSRSData(() => loadSRS())}>
          Import Backup
        </button>
      </div>

      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 12, padding: '16px 20px', marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 2 }}>SRS Settings</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Cards per session: 10-30 depending on deck. SRS easing starts at 2.5 and adjusts ±0.15 per rating.
            Ratings: Forgot=reset, Hard=slow, Good=normal, Easy=fast interval growth.
          </div>
        </div>
      </div>

      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 12, padding: '16px 20px', marginBottom: 20,
      }}>
        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 8 }}>Danger Zone</div>
        {!confirmReset ? (
          <button
            className="rating-btn again"
            style={{ padding: '8px 18px', fontSize: '0.82rem', width: 'auto' }}
            onClick={() => setConfirmReset(true)}
          >
            Reset All Progress
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--red)' }}>
              This deletes all SRS data, streaks, and settings. Cannot be undone.
            </span>
            <button
              className="rating-btn again"
              style={{ padding: '8px 18px', fontSize: '0.82rem', width: 'auto' }}
              onClick={handleReset}
            >
              Confirm Reset
            </button>
            <button
              className="nav-link"
              style={{ fontSize: '0.82rem' }}
              onClick={() => setConfirmReset(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <h3 style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: 12, fontWeight: 500 }}>
        All Glyphs ({allGlyphs.length})
      </h3>

      <div className="glyph-grid">
        {allGlyphs.map(g => {
          const status = getStatus(g.id);
          return (
            <div key={g.id} className={`glyph-cell ${status}`} title={`${g.meaning} (${g.transliteration})`}>
              <span className="g-hiero">{g.hieroglyph}</span>
              <span>{g.transliteration || g.gardiner}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
