import { useStore } from '../engine/store';

export function Home() {
  const setView = useStore(s => s.setView);
  const getSRSStats = useStore(s => s.getSRSStats);
  const streak = useStore(s => s.streak);
  const onboarded = useStore(s => s.onboarded);
  const markOnboarded = useStore(s => s.markOnboarded);
  const stats = getSRSStats();
  const isNew = stats.total === 0;

  if (!onboarded) {
    return (
      <div className="home">
        <div className="hero">
          <h1>𓂀</h1>
          <p>Welcome to Hieroglyph Academy. Here's your path to reading real Egyptian inscriptions.</p>
        </div>
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 500, width: '100%',
        }}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'center',
          }}>
            <span style={{ fontSize: '1.6rem' }}>1</span>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>Learn the Alphabet</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>25 uniliteral signs — the building blocks. Practice with flashcards until you know them all.</div>
            </div>
            <button className="start-btn" style={{ padding: '8px 18px', fontSize: '0.82rem' }}
              onClick={() => { setView('practice'); }}>
              Start
            </button>
          </div>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'center',
          }}>
            <span style={{ fontSize: '1.6rem' }}>2</span>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>Build Vocabulary</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>30+ common words and phrases. Use reverse drills to practice active recall.</div>
            </div>
          </div>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'center',
          }}>
            <span style={{ fontSize: '1.6rem' }}>3</span>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>Read Real Inscriptions</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>11 passages from temple walls, stelae, and papyri. Read word-by-word with context.</div>
            </div>
          </div>
        </div>
        <button className="start-btn" onClick={markOnboarded} style={{ fontSize: '0.9rem' }}>
          Got it — let me explore
        </button>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="hero">
        <h1>𓂀</h1>
        <p>Learn Egyptian hieroglyphs efficiently with spaced repetition, reverse drills, reading practice, and etymology lookup.</p>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        {stats.total > 0 && (
          <div className="stats-bar">
            <div className="stat"><div className="value">{stats.total}</div><div className="label">Learned</div></div>
            <div className="stat"><div className="value">{stats.due}</div><div className="label">Due</div></div>
            <div className="stat"><div className="value">{stats.mature}</div><div className="label">Mature</div></div>
            <div className="stat"><div className="value">{stats.reviewed}</div><div className="label">Reviews</div></div>
          </div>
        )}

        {streak.currentStreak > 0 && (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '12px 20px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--gold)' }}>
              {streak.currentStreak}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Day Streak {streak.currentStreak >= 3 ? '🔥' : ''}
            </div>
          </div>
        )}
      </div>

      {isNew && (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--gold-dim)',
          borderRadius: 12, padding: '16px 20px', maxWidth: 500, width: '100%', textAlign: 'center',
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4, color: 'var(--gold)' }}>New here?</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: 10 }}>
            Start with the 25-letter alphabet, then build vocabulary, then read real inscriptions.
          </div>
          <button className="start-btn" style={{ padding: '8px 20px', fontSize: '0.85rem' }}
            onClick={() => { setView('practice'); }}>
            Start Learning →
          </button>
        </div>
      )}

      <div className="modes">
        <div className="mode-card" onClick={() => setView('practice')}>
          <div className="icon">𓊹</div>
          <h3>Practice</h3>
          <p>Flashcards, typing drills, and multiple choice quiz — all with spaced repetition. Keyboard shortcuts: Space to flip, 1-4 to rate.</p>
          {stats.due > 0 && <span className="badge">{stats.due} cards due</span>}
        </div>

        <div className="mode-card" onClick={() => setView('write')}>
          <div className="icon">𓏞</div>
          <h3>Writing Practice</h3>
          <p>Draw hieroglyphs on a canvas with mouse or touch. Copy the reference glyph. Hide the guide to test your recall from shape alone.</p>
        </div>

        <div className="mode-card" onClick={() => setView('reading')}>
          <div className="icon">𓏛</div>
          <h3>Reading Room</h3>
          <p>11 real inscriptions — tomb walls, stelae, papyri. Word-by-word reading with progressive reveal. Known words highlighted from your SRS progress.</p>
        </div>

        <div className="mode-card" onClick={() => setView('names')}>
          <div className="icon">𓇓</div>
          <h3>Name Etymology</h3>
          <p>Pharaonic names like Ramesses, Tutankhamun, Nefertiti — hieroglyphic spelling, breakdown, and historical context.</p>
        </div>

        <div className="mode-card" onClick={() => setView('progress')}>
          <div className="icon">𓁧</div>
          <h3>Progress</h3>
          <p>Track your learning: glyph mastery grid, review stats, export/import your data.</p>
        </div>
      </div>

      <button className="start-btn" onClick={() => setView('practice')}>
        Start Practicing →
      </button>
    </div>
  );
}
