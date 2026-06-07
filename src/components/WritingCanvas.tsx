import { useState, useRef, useCallback } from 'react';
import { uniliterals } from '../data/vocabulary';

export function WritingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [glyphIdx, setGlyphIdx] = useState(0);
  const [showGuide, setShowGuide] = useState(true);
  const [strokeWidth, setStrokeWidth] = useState(4);

  const glyph = uniliterals[glyphIdx % uniliterals.length];

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, []);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#c9a94e';
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing, strokeWidth]);

  const stopDraw = useCallback(() => setIsDrawing(false), []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const nextGlyph = () => {
    setGlyphIdx(i => i + 1);
    clearCanvas();
  };
  const prevGlyph = () => {
    setGlyphIdx(i => Math.max(0, i - 1));
    clearCanvas();
  };

  return (
    <div className="drill">
      <h2 style={{ color: 'var(--gold)', fontSize: '1.15rem', fontWeight: 600, marginBottom: 8 }}>
        Writing Practice
      </h2>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: 20, textAlign: 'center' }}>
        Copy the hieroglyph in the guide box. Drawing helps lock the shape into your memory.
      </p>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16,
      }}>
        <button className="nav-link" onClick={prevGlyph} disabled={glyphIdx === 0}>←</button>
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12,
          padding: '12px 24px', textAlign: 'center', minWidth: 200,
        }}>
          <div style={{
            fontFamily: 'var(--font-hiero)', fontSize: showGuide ? '3rem' : '1rem',
            color: showGuide ? 'var(--gold-light)' : 'transparent',
            opacity: showGuide ? 0.4 : 0, lineHeight: 1.2, transition: 'all 0.3s',
            marginBottom: 4,
          }}>
            {glyph.hieroglyph}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{glyph.meaning}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--gold-dim)', fontStyle: 'italic' }}>/{glyph.transliteration}/</div>
        </div>
        <button className="nav-link" onClick={nextGlyph}>→</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="nav-link" onClick={() => setShowGuide(!showGuide)} style={{ fontSize: '0.8rem' }}>
          {showGuide ? 'Hide Guide' : 'Show Guide'}
        </button>
        <button className="nav-link" onClick={clearCanvas} style={{ fontSize: '0.8rem' }}>Clear</button>
        {[2, 4, 6, 8].map(w => (
          <button
            key={w}
            className="nav-link"
            onClick={() => setStrokeWidth(w)}
            style={{
              fontSize: '0.8rem',
              color: strokeWidth === w ? 'var(--gold)' : 'var(--text-dim)',
              background: strokeWidth === w ? 'rgba(201,169,78,0.1)' : 'transparent',
            }}
          >
            {w}px
          </button>
        ))}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'center',
      }}>
        <canvas
          ref={canvasRef}
          width={500}
          height={400}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
          style={{
            border: '1px solid var(--border)',
            borderRadius: 12,
            background: '#1a1810',
            cursor: 'crosshair',
            touchAction: 'none',
            maxWidth: '100%',
          }}
        />
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textAlign: 'center', marginTop: 12 }}>
        Draw with your mouse or finger. Practice the shapes until they feel natural.
      </p>
    </div>
  );
}
