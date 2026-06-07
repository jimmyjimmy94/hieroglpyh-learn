import { useState, useMemo } from 'react';
import { enhancedPassages, imagePassages } from '../data/readingPassages';
import type { ReadingWord } from '../data/readingPassages';
import { loadCards, initCard, gradeCard, saveCards } from '../engine/srs';

type RevealLevel = 'none' | 'translit' | 'translation';
type PassageType = 'text' | 'image';
type SortKey = 'difficulty' | 'linked';

const difficultyColors: Record<string, string> = {
  beginner: 'var(--green)',
  intermediate: 'var(--gold)',
  advanced: 'var(--red)',
};

function getWordSRSStatus(word: ReadingWord): 'mastered' | 'learning' | 'unknown' {
  if (!word.vocabularyId) return 'unknown';
  const cards = loadCards();
  const card = cards[word.vocabularyId];
  if (!card || card.reviewed === 0) return 'unknown';
  if (card.interval >= 21) return 'mastered';
  return 'learning';
}

function markWordKnown(vocabularyId: string) {
  const cards = loadCards();
  const card = cards[vocabularyId] || initCard(vocabularyId);
  const updated = gradeCard(card, 4);
  saveCards({ ...cards, [vocabularyId]: updated });
}

export function ReadingRoom() {
  const [passageId, setPassageId] = useState<string | null>(null);
  const [passageType, setPassageType] = useState<PassageType>('text');
  const [revealLevel, setRevealLevel] = useState<RevealLevel>('none');
  const [selectedWordIdx, setSelectedWordIdx] = useState<number | null>(null);
  const [showContext, setShowContext] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>('difficulty');
  const [markedWords, setMarkedWords] = useState<Set<string>>(new Set());
  const [showImages, setShowImages] = useState(true);

  const filtered = useMemo(() => {
    let list: { type: PassageType; id: string; title: string; source: string; description: string; difficulty: string; wordCount: number; linkedCount: number }[] = [];

    const textFiltered = difficultyFilter
      ? enhancedPassages.filter(p => p.difficulty === difficultyFilter)
      : [...enhancedPassages];

    if (sortBy === 'linked') {
      textFiltered.sort((a, b) => {
        const aCount = a.words.filter(w => !!w.vocabularyId).length;
        const bCount = b.words.filter(w => !!w.vocabularyId).length;
        return bCount - aCount;
      });
    } else {
      const order = { beginner: 0, intermediate: 1, advanced: 2 };
      textFiltered.sort((a, b) => (order[a.difficulty] || 0) - (order[b.difficulty] || 0));
    }

    for (const p of textFiltered) {
      list.push({
        type: 'text', id: p.id, title: p.title, source: p.source,
        description: p.description, difficulty: p.difficulty,
        wordCount: p.words.length, linkedCount: p.words.filter(w => !!w.vocabularyId).length,
      });
    }

    if (showImages) {
      const imgFiltered = difficultyFilter
        ? imagePassages.filter(p => p.difficulty === difficultyFilter)
        : imagePassages;
      for (const p of imgFiltered) {
        list.push({
          type: 'image', id: p.id, title: p.title, source: p.source,
          description: p.description, difficulty: p.difficulty,
          wordCount: 0, linkedCount: 0,
        });
      }
    }

    return list;
  }, [difficultyFilter, sortBy, showImages]);

  const passage = passageId && passageType === 'text'
    ? enhancedPassages.find(p => p.id === passageId) : null;
  const imagePassage = passageId && passageType === 'image'
    ? imagePassages.find(p => p.id === passageId) : null;
  const selectedWord = selectedWordIdx !== null && passage ? passage.words[selectedWordIdx] : null;

  const knownCount = useMemo(() => {
    if (!passage) return 0;
    return passage.words.filter(w => getWordSRSStatus(w) === 'mastered' || markedWords.has(w.vocabularyId || '')).length;
  }, [passage, markedWords]);

  const handleMarkKnown = (word: ReadingWord) => {
    if (!word.vocabularyId) return;
    markWordKnown(word.vocabularyId);
    setMarkedWords(s => new Set(s).add(word.vocabularyId!));
  };

  if (!passage && !imagePassage) {
    return (
      <div className="reading">
        <h2>Reading Room</h2>
        <p style={{ color: 'var(--text-dim)', marginBottom: 20, fontSize: '0.9rem' }}>
          Read real Egyptian inscriptions word-by-word, or browse photographs of actual artifacts with translations. Your known vocabulary is highlighted.
        </p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="deck-select">
            <button className={!difficultyFilter ? 'active' : ''} onClick={() => setDifficultyFilter(null)}>All</button>
            <button className={difficultyFilter === 'beginner' ? 'active' : ''} onClick={() => setDifficultyFilter('beginner')}>Beginner</button>
            <button className={difficultyFilter === 'intermediate' ? 'active' : ''} onClick={() => setDifficultyFilter('intermediate')}>Intermediate</button>
            <button className={difficultyFilter === 'advanced' ? 'active' : ''} onClick={() => setDifficultyFilter('advanced')}>Advanced</button>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sort:</span>
          {(['difficulty', 'linked'] as SortKey[]).map(k => (
            <button
              key={k}
              className={`nav-link${sortBy === k ? ' active' : ''}`}
              style={{ fontSize: '0.78rem', padding: '4px 10px' }}
              onClick={() => setSortBy(k)}>
              {k === 'difficulty' ? 'By Level' : 'Most Linked'}
            </button>
          ))}
          <span style={{ marginLeft: 8 }} />
          <button
            className={`nav-link${showImages ? ' active' : ''}`}
            style={{ fontSize: '0.78rem', padding: '4px 10px' }}
            onClick={() => setShowImages(!showImages)}>
            {showImages ? 'Hide Images' : 'Show Images'}
          </button>
        </div>
        {filtered.map(p => (
          <div
            key={p.id}
            className="reading-passage"
            onClick={() => { setPassageId(p.id); setPassageType(p.type); }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h3 style={{ flex: 1 }}>{p.title}</h3>
              <span style={{
                fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase',
                color: difficultyColors[p.difficulty],
                padding: '2px 8px', borderRadius: 4,
                background: `${difficultyColors[p.difficulty]}15`,
              }}>{p.difficulty}</span>
              {p.type === 'image' && (
                <span style={{ fontSize: '0.72rem', color: 'var(--blue)', fontWeight: 500 }}>📷 Image</span>
              )}
            </div>
            <div className="source">{p.source}</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-dim)', marginTop: 6, lineHeight: 1.5 }}>{p.description}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gold-dim)', marginTop: 8 }}>
              {p.type === 'text' ? `${p.wordCount} words · ${p.linkedCount} linked to SRS` : 'Photograph + translation'}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (imagePassage) {
    return (
      <div className="reading" style={{ maxWidth: 900 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <button className="nav-link" onClick={() => { setPassageId(null); }}
            style={{ fontSize: '0.85rem' }}>← Back</button>
          <h2 style={{ flex: 1, fontSize: '1.15rem', margin: 0 }}>{imagePassage.title}</h2>
          <span style={{
            fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase',
            color: difficultyColors[imagePassage.difficulty],
            padding: '2px 8px', borderRadius: 4,
            background: `${difficultyColors[imagePassage.difficulty]}15`,
          }}>{imagePassage.difficulty}</span>
        </div>
        <div className="source" style={{ marginBottom: 12, fontSize: '0.8rem', fontStyle: 'italic' }}>{imagePassage.source}</div>
        <div style={{
          textAlign: 'center', marginBottom: 16,
          background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20,
        }}>
          <div style={{ fontFamily: 'var(--font-hiero)', fontSize: '3rem', color: 'var(--gold)', marginBottom: 8 }}>✉</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: 8 }}>
            This inscription is best viewed as a photograph. See the actual artifact on Wikipedia.
          </div>
          <a
            href={imagePassage.referenceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px 24px', borderRadius: 8,
              border: '1px solid var(--gold-dim)', background: 'rgba(201,169,78,0.1)',
              color: 'var(--gold)', fontFamily: 'inherit', fontSize: '0.88rem',
              fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'inline-block',
            }}
          >
            {imagePassage.referenceLabel}
          </a>
        </div>
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 12, padding: 20, marginBottom: 16,
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Transliteration</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--gold-dim)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: 12 }}>{imagePassage.transliteration}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Translation</div>
          <div style={{ fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1.7, marginBottom: 16 }}>{imagePassage.fullTranslation}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Reading Notes</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: 12 }}>{imagePassage.notes}</div>
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Cultural Context</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>{imagePassage.culturalContext}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!passage) return null;

  return (
    <div className="reading" style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <button className="nav-link" onClick={() => { setPassageId(null); setSelectedWordIdx(null); setRevealLevel('none'); }}
          style={{ fontSize: '0.85rem' }}>← Back</button>
        <h2 style={{ flex: 1, fontSize: '1.15rem', margin: 0 }}>{passage.title}</h2>
        <span style={{
          fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase',
          color: difficultyColors[passage.difficulty],
          padding: '2px 8px', borderRadius: 4,
          background: `${difficultyColors[passage.difficulty]}15`,
        }}>{passage.difficulty}</span>
      </div>

      <div className="source" style={{ marginBottom: 12, fontSize: '0.8rem', fontStyle: 'italic' }}>{passage.source}</div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginRight: 4 }}>Reveal:</span>
        {(['none', 'translit', 'translation'] as RevealLevel[]).map(level => (
          <button
            key={level}
            style={{
              padding: '5px 14px', borderRadius: 6, border: '1px solid var(--border)',
              background: revealLevel === level ? 'rgba(201,169,78,0.1)' : 'var(--bg)',
              color: revealLevel === level ? 'var(--gold)' : 'var(--text-dim)',
              fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
            }}
            onClick={() => setRevealLevel(revealLevel === level ? 'none' : level)}>
            {level === 'none' ? 'Hieroglyphs only' : level === 'translit' ? '+ Transliteration' : '+ Translation'}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--gold-dim)' }}>
          {knownCount}/{passage.words.length} known
        </span>
      </div>

      {selectedWord && (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--gold-dim)',
          borderRadius: 12, padding: '16px 20px', marginBottom: 16,
          display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap',
        }}>
          <div style={{ fontFamily: 'var(--font-hiero)', fontSize: '2.5rem', color: 'var(--gold)', minWidth: 60, textAlign: 'center', lineHeight: 1 }}>
            {selectedWord.hieroglyph}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 2 }}>{selectedWord.meaning}</div>
            <div style={{ color: 'var(--gold-dim)', fontStyle: 'italic', marginBottom: 4 }}>/{selectedWord.transliteration}/</div>
            {selectedWord.notes && (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>{selectedWord.notes}</div>
            )}
            {selectedWord.vocabularyId && (
              <button
                onClick={() => handleMarkKnown(selectedWord)}
                style={{
                  marginTop: 8, padding: '6px 16px', borderRadius: 6,
                  border: '1px solid var(--gold-dim)', background: 'rgba(201,169,78,0.1)',
                  color: 'var(--gold)', fontFamily: 'inherit', fontSize: '0.78rem',
                  fontWeight: 500, cursor: 'pointer',
                }}
              >
                {markedWords.has(selectedWord.vocabularyId) || getWordSRSStatus(selectedWord) !== 'unknown' ? '✓ Known' : 'Mark as Known'}
              </button>
            )}
          </div>
          <button onClick={() => setSelectedWordIdx(null)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem', padding: 4 }}>✕</button>
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24, justifyContent: 'center' }}>
        {passage.words.map((word, idx) => {
          const status = getWordSRSStatus(word);
          const isMarked = markedWords.has(word.vocabularyId || '');
          const effectiveStatus = isMarked ? 'mastered' : status;
          const isSelected = selectedWordIdx === idx;

          let borderColor = 'var(--border)';
          if (isSelected) borderColor = 'var(--gold)';
          else if (effectiveStatus === 'mastered') borderColor = 'var(--gold-dim)';
          else if (effectiveStatus === 'learning') borderColor = 'rgba(106,154,181,0.4)';

          return (
            <div
              key={idx}
              onClick={() => setSelectedWordIdx(isSelected ? null : idx)}
              style={{
                background: isSelected ? 'rgba(201,169,78,0.12)' : 'var(--bg-card)',
                border: `1.5px solid ${borderColor}`,
                borderRadius: 10, padding: '8px 12px', cursor: 'pointer',
                transition: 'all 0.15s', textAlign: 'center', minWidth: 50,
              }}>
              <div style={{
                fontFamily: 'var(--font-hiero)', fontSize: '1.5rem',
                color: effectiveStatus === 'mastered' ? 'var(--gold)' : 'var(--gold-light)',
                lineHeight: 1.3, marginBottom: 4,
              }}>{word.hieroglyph}</div>
              {revealLevel !== 'none' && (
                <div style={{ fontSize: '0.68rem', color: 'var(--gold-dim)', fontStyle: 'italic', lineHeight: 1.2 }}>/{word.transliteration}/</div>
              )}
              {revealLevel === 'translation' && (
                <div style={{ fontSize: '0.7rem', color: 'var(--text)', fontWeight: 500, lineHeight: 1.2, marginTop: 2 }}>{word.meaning}</div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}
          onClick={() => setShowContext(!showContext)}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Full Translation {showContext ? '▲' : '▼'}
          </span>
        </div>
        {showContext && (
          <div style={{ fontSize: '1rem', color: 'var(--text)', lineHeight: 1.6, marginBottom: 16 }}>{passage.fullTranslation}</div>
        )}
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Reading Notes</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>{passage.notes}</div>
        <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Cultural Context</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>{passage.culturalContext}</div>
        </div>
      </div>
    </div>
    );
}

