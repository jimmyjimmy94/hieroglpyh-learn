import { useEffect, useState, useCallback, useRef } from 'react';
import { useStore } from '../engine/store';
import type { PracticeMode, Deck } from '../engine/store';
import { loadCards, getDueCards } from '../engine/srs';
import { uniliterals, vocabulary, determinatives, biliteralsAndTriliterals, wordlandVocab } from '../data/vocabulary';
import { shuffle } from '../utils';
import type { Glyph } from '../data/vocabulary';

function pickWrong(answers: string[], target: string, count: number): string[] {
  const pool = [...new Set(answers)].filter(a => a !== target);
  return shuffle(pool).slice(0, count);
}

function getGlyphsForDeck(deck: Deck): Glyph[] {
  switch (deck) {
    case 'uniliterals': return uniliterals;
    case 'vocabulary': return [...vocabulary, ...biliteralsAndTriliterals];
    case 'determinatives': return determinatives;
    case 'wordland': return wordlandVocab;
    default: return [...uniliterals, ...determinatives, ...biliteralsAndTriliterals, ...vocabulary];
  }
}

type TypingState = {
  queue: Glyph[];
  index: number;
  input: string;
  feedback: 'correct' | 'incorrect' | null;
  revealed: boolean;
  correctCount: number;
};

type QuizState = {
  questions: { glyph: Glyph; options: string[]; correctIdx: number }[];
  index: number;
  selected: number | null;
  score: number;
};

export function Practice() {
  const practiceMode = useStore(s => s.practiceMode);
  const setPracticeMode = useStore(s => s.setPracticeMode);
  const deck = useStore(s => s.deck);
  const setDeck = useStore(s => s.setDeck);
  const startSession = useStore(s => s.startSession);
  const flipCard = useStore(s => s.flipCard);
  const rateCard = useStore(s => s.rateCard);
  const sessionQueue = useStore(s => s.sessionQueue);
  const sessionIndex = useStore(s => s.sessionIndex);
  const cardFlipped = useStore(s => s.cardFlipped);
  const recordActivity = useStore(s => s.recordActivity);

  const [typing, setTyping] = useState<TypingState>({
    queue: [], index: 0, input: '', feedback: null, revealed: false, correctCount: 0,
  });
  const [quiz, setQuiz] = useState<QuizState>({
    questions: [], index: 0, selected: null, score: 0,
  });

  const glyphsRef = useRef(getGlyphsForDeck(deck));

  const buildTypingDeck = useCallback(() => {
    const glyphs = getGlyphsForDeck(deck);
    const cards = loadCards();
    const due = getDueCards(glyphs.map(g => g.id), cards, 15);
    let queue: Glyph[];
    if (due.length > 0) {
      queue = due.map(d => glyphs.find(g => g.id === d.id)).filter((g): g is Glyph => g !== undefined);
    } else {
      queue = shuffle(glyphs).slice(0, 12);
    }
    setTyping({ queue, index: 0, input: '', feedback: null, revealed: false, correctCount: 0 });
  }, [deck]);

  const buildQuizDeck = useCallback(() => {
    const glyphs = getGlyphsForDeck(deck);
    const allMeanings = glyphs.map(g => g.meaning);
    const selected = shuffle(glyphs).slice(0, 12);
    const qs = selected.map(g => {
      const wrong = pickWrong(allMeanings, g.meaning, 3);
      const options = shuffle([g.meaning, ...wrong]);
      return { glyph: g, options, correctIdx: options.indexOf(g.meaning) };
    });
    setQuiz({ questions: qs, index: 0, selected: null, score: 0 });
  }, [deck]);

  useEffect(() => {
    glyphsRef.current = getGlyphsForDeck(deck);
  }, [deck]);

  useEffect(() => {
    if (practiceMode === 'flashcard') startSession();
    else if (practiceMode === 'type') buildTypingDeck();
    else if (practiceMode === 'quiz') buildQuizDeck();
  }, [practiceMode, deck, startSession, buildTypingDeck, buildQuizDeck]);

  useEffect(() => { recordActivity(); }, [practiceMode, recordActivity]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (practiceMode !== 'flashcard' || sessionQueue.length === 0) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (sessionIndex >= sessionQueue.length) return;
        if (!cardFlipped) flipCard();
        else rateCard(3);
      }
      if (cardFlipped) {
        if (e.key === '1') rateCard(1);
        else if (e.key === '2') rateCard(2);
        else if (e.key === '3') rateCard(3);
        else if (e.key === '4') rateCard(4);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [practiceMode, cardFlipped, sessionIndex, sessionQueue.length, flipCard, rateCard]);

  return (
    <div className="drill">
      <div className="drill-header" style={{ flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['flashcard', 'type', 'quiz'] as PracticeMode[]).map(m => (
            <button
              key={m}
              className={practiceMode === m ? 'active' : ''}
              style={{
                padding: '7px 16px', borderRadius: 8, border: '1px solid var(--border)',
                background: practiceMode === m ? 'rgba(201,169,78,0.1)' : 'var(--bg)',
                color: practiceMode === m ? 'var(--gold)' : 'var(--text-dim)',
                fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
              }}
              onClick={() => setPracticeMode(m)}
            >
              {m === 'flashcard' ? 'Flashcard' : m === 'type' ? 'Type' : 'Quiz'}
            </button>
          ))}
        </div>

        <div className="deck-select">
          {(['all', 'uniliterals', 'vocabulary', 'wordland', 'determinatives'] as Deck[]).map(d => (
            <button
              key={d}
              className={deck === d ? 'active' : ''}
              onClick={() => setDeck(d)}
            >
              {d === 'uniliterals' ? 'Alphabet' : d === 'vocabulary' ? 'Words' : d === 'wordland' ? 'WordLand' : d === 'determinatives' ? 'Det.' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {practiceMode === 'flashcard' && <FlashcardMode />}
      {practiceMode === 'type' && (
        <TypeMode typing={typing} setTyping={setTyping} buildTypingDeck={buildTypingDeck} />
      )}
      {practiceMode === 'quiz' && (
        <QuizMode quiz={quiz} setQuiz={setQuiz} buildQuizDeck={buildQuizDeck} />
      )}
    </div>
  );
}

function FlashcardMode() {
  const sessionQueue = useStore(s => s.sessionQueue);
  const sessionIndex = useStore(s => s.sessionIndex);
  const cardFlipped = useStore(s => s.cardFlipped);
  const sessionStats = useStore(s => s.sessionStats);
  const flipCard = useStore(s => s.flipCard);
  const rateCard = useStore(s => s.rateCard);
  const startSession = useStore(s => s.startSession);
  const setView = useStore(s => s.setView);
  const resetSession = useStore(s => s.resetSession);

  const currentGlyph = sessionQueue[sessionIndex];
  const done = sessionQueue.length > 0 && sessionIndex >= sessionQueue.length;
  const progress = sessionQueue.length > 0 ? (sessionIndex / sessionStats.total) * 100 : 0;

  const cardInfo = currentGlyph ? loadCards()[currentGlyph.id] : null;

  function formatInterval(days: number): string {
    if (days === 0) return 'new';
    if (days === 1) return '1 day';
    if (days < 30) return `${days}d`;
    if (days < 365) return `${Math.round(days / 30)}mo`;
    return `${Math.round(days / 365)}yr`;
  }

  if (done && sessionQueue.length > 0) {
    const accuracy = sessionStats.total > 0
      ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0;
    const elapsed = Math.round((Date.now() - sessionStats.startTime) / 1000);
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    return (
      <div className="session-done">
        <h2>𓄤</h2>
        <p>Session complete!</p>
        <div className="stats-grid">
          <div className="stat"><div className="value">{accuracy}%</div><div className="label">Accuracy</div></div>
          <div className="stat"><div className="value">{sessionStats.correct}/{sessionStats.total}</div><div className="label">Correct</div></div>
          <div className="stat"><div className="value">{m}:{s.toString().padStart(2, '0')}</div><div className="label">Time</div></div>
        </div>
        <button onClick={() => { setView('home'); resetSession(); }}>Home</button>
        <button onClick={startSession}>Drill Again</button>
      </div>
    );
  }

  if (sessionQueue.length === 0) {
    return <div className="session-done"><h2>𓂀</h2><p>Loading...</p></div>;
  }

  return (
    <div className="flashcard-area">
      <div className="drill-progress" style={{ width: '100%', justifyContent: 'center', marginBottom: 8 }}>
        <span>{sessionIndex + 1} / {sessionStats.total}</span>
        <div className="progress-bar" style={{ width: 160 }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flashcard" onClick={() => { if (!cardFlipped) flipCard(); }}>
        {!cardFlipped ? (
          <>
            {currentGlyph?.imageUrl ? (
              <img src={currentGlyph.imageUrl} alt="" style={{ maxWidth: '100%', maxHeight: 160, objectFit: 'contain' }} />
            ) : (
              <div className="hiero-display">{currentGlyph?.hieroglyph}</div>
            )}
            <div className="hint">Press Space or tap to reveal</div>
          </>
        ) : (
          <>
            {currentGlyph?.imageUrl ? (
              <img src={currentGlyph.imageUrl} alt="" style={{ maxWidth: '100%', maxHeight: 120, objectFit: 'contain', marginBottom: 12 }} />
            ) : (
              <div className="hiero-display" style={{ fontSize: '2.5rem', marginBottom: 12 }}>{currentGlyph?.hieroglyph}</div>
            )}
            <div className="meaning-display">{currentGlyph?.meaning}</div>
            <div className="translit-display">/{currentGlyph?.transliteration}/</div>
            {currentGlyph?.gardiner && <div className="gardiner-display">Gardiner: {currentGlyph?.gardiner} · {currentGlyph?.category}</div>}
            {currentGlyph?.notes && <div className="notes-display">{currentGlyph.notes}</div>}
            {cardInfo && cardInfo.reviewed > 0 && (
              <div style={{
                marginTop: 10, fontSize: '0.72rem', color: 'var(--text-muted)',
                background: 'rgba(201,169,78,0.08)', padding: '3px 10px', borderRadius: 20,
                display: 'inline-block',
              }}>
                Reviewed {cardInfo.reviewed}× · Interval: {formatInterval(cardInfo.interval)}
              </div>
            )}
          </>
        )}
      </div>

      {cardFlipped && (
        <>
          <div style={{
            textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-dim)',
            marginBottom: 4, fontWeight: 500,
          }}>
            How well did you remember?
          </div>
          <div className="rating-bar">
            <button className="rating-btn again" onClick={() => rateCard(1)}>
              Forgot<span className="key-hint">1 · soon</span>
            </button>
            <button className="rating-btn hard" onClick={() => rateCard(2)}>
              Hard<span className="key-hint">2 · ~3d</span>
            </button>
            <button className="rating-btn good" onClick={() => rateCard(3)}>
              Good<span className="key-hint">3 · ~7d</span>
            </button>
            <button className="rating-btn easy" onClick={() => rateCard(4)}>
              Easy<span className="key-hint">4 · ~21d</span>
            </button>
          </div>
        </>
      )}

      <div className="kbd-hints">
        <span><kbd>Space</kbd> reveal / rate Good</span>
        <span><kbd>1</kbd> forgot</span>
        <span><kbd>2</kbd> hard</span>
        <span><kbd>3</kbd> good</span>
        <span><kbd>4</kbd> easy</span>
      </div>
    </div>
  );
}

function TypeMode({ typing, setTyping, buildTypingDeck }: {
  typing: TypingState;
  setTyping: React.Dispatch<React.SetStateAction<TypingState>>;
  buildTypingDeck: () => void;
}) {
  const current = typing.queue[typing.index];
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, [typing.index]);

  const checkAnswer = () => {
    if (typing.revealed) return;
    const answer = typing.input.trim().toLowerCase();
    const expected = current?.transliteration?.toLowerCase() || '';
    const isCorrect = answer === expected || answer === expected.replace(/[ˁḫẖšḳṯḏꜣˀ]/g, '').toLowerCase();
    setTyping(t => ({
      ...t, revealed: true,
      feedback: isCorrect ? 'correct' : 'incorrect',
      correctCount: t.correctCount + (isCorrect ? 1 : 0),
    }));
  };

  const next = () => {
    if (typing.index + 1 >= typing.queue.length) buildTypingDeck();
    else setTyping(t => ({ ...t, index: t.index + 1, input: '', feedback: null, revealed: false }));
  };

  if (!current) return <div className="session-done"><p>Loading...</p></div>;

  const progress = (typing.index / typing.queue.length) * 100;

  return (
    <div className="flashcard-area">
      <div className="drill-progress" style={{ width: '100%', justifyContent: 'center', marginBottom: 8, gap: 8 }}>
        <span>{typing.index + 1}/{typing.queue.length}</span>
        <div className="progress-bar" style={{ width: 120 }}><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        <span style={{ color: 'var(--green)', fontSize: '0.82rem' }}>{typing.correctCount}/{typing.index + (typing.revealed ? 1 : 0)}</span>
      </div>

      <div className="flashcard" style={{ cursor: 'default' }}>
        <div className="meaning-display" style={{ fontSize: '1.8rem', marginBottom: 8 }}>{current.meaning}</div>
        {current.notes && <div className="notes-display">{current.notes}</div>}
        {typing.revealed && (
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <div className="hiero-display" style={{ fontSize: '2.5rem' }}>{current.hieroglyph}</div>
            <div className="translit-display">/{current.transliteration}/</div>
            <div className="gardiner-display">{current.gardiner}</div>
          </div>
        )}
      </div>

      <div className="reverse-input-area">
        {!typing.revealed ? (
          <>
            <input ref={inputRef} type="text" placeholder="Type transliteration..." value={typing.input}
              onChange={e => setTyping(t => ({ ...t, input: e.target.value }))}
              onKeyDown={e => { if (e.key === 'Enter') checkAnswer(); }} />
            <button className="rating-btn good" onClick={checkAnswer}>Check (Enter)</button>
          </>
        ) : (
          <>
            <div className={`feedback ${typing.feedback}`}>
              {typing.feedback === 'correct' ? '✓ Correct!' : `✗ Answer: ${current.transliteration}`}
            </div>
            <button className="rating-btn good" onClick={next} autoFocus>Next (Enter)</button>
          </>
        )}
      </div>
    </div>
  );
}

function QuizMode({ quiz, setQuiz, buildQuizDeck }: {
  quiz: QuizState;
  setQuiz: React.Dispatch<React.SetStateAction<QuizState>>;
  buildQuizDeck: () => void;
}) {
  const current = quiz.questions[quiz.index];

  const handleSelect = (idx: number) => {
    if (quiz.selected !== null) return;
    setQuiz(q => ({ ...q, selected: idx, score: idx === current?.correctIdx ? q.score + 1 : q.score }));
  };

  const next = () => {
    if (quiz.index + 1 >= quiz.questions.length) buildQuizDeck();
    else setQuiz(q => ({ ...q, index: q.index + 1, selected: null }));
  };

  if (!current) return <div className="session-done"><p>Loading...</p></div>;

  return (
    <div className="flashcard-area">
      <div className="drill-progress" style={{ width: '100%', justifyContent: 'center', marginBottom: 8, gap: 8 }}>
        <span>{quiz.index + 1}/{quiz.questions.length}</span>
        <span style={{ color: 'var(--gold)', fontSize: '0.82rem' }}>
          Score: {quiz.score}/{quiz.index + (quiz.selected !== null ? 1 : 0)}
        </span>
      </div>

      <div className="flashcard" style={{ cursor: 'default', minHeight: 180 }}>
        {current.glyph.imageUrl ? (
          <img src={current.glyph.imageUrl} alt="" style={{ maxWidth: '100%', maxHeight: 120, objectFit: 'contain' }} />
        ) : (
          <div className="hiero-display">{current.glyph.hieroglyph}</div>
        )}
        <div className="gardiner-display">{current.glyph.gardiner}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', maxWidth: 600 }}>
        {current.options.map((opt, i) => {
          let cls = 'rating-btn';
          if (quiz.selected !== null) {
            if (i === current.correctIdx) cls += ' good';
            else if (i === quiz.selected) cls += ' again';
          }
          return <button key={i} className={cls} onClick={() => handleSelect(i)} style={{ textAlign: 'center' }}>{opt}</button>;
        })}
      </div>

      {quiz.selected !== null && (
        <div style={{ textAlign: 'center' }}>
          <div className={`feedback ${quiz.selected === current.correctIdx ? 'correct' : 'incorrect'}`}>
            {quiz.selected === current.correctIdx ? '✓ Correct!' : `✗ ${current.glyph.meaning} (/${current.glyph.transliteration}/)`}
          </div>
          <button className="start-btn" style={{ padding: '10px 24px', marginTop: 8 }} onClick={next}>
            {quiz.index + 1 >= quiz.questions.length ? 'Finish' : 'Next'}
          </button>
        </div>
      )}
    </div>
  );
}
