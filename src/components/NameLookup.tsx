import { useState } from 'react';
import { nameEtymologies } from '../data/vocabulary';

export function NameLookup() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="names">
      <h2>Pharaonic Name Etymology</h2>
      <p style={{ color: 'var(--text-dim)', marginBottom: 20, fontSize: '0.9rem' }}>
        Understanding how pharaonic names are constructed helps you recognize hieroglyphic patterns.
      </p>

      {nameEtymologies.map(n => (
        <div
          key={n.name}
          className={`name-card${expanded === n.name ? ' expanded' : ''}`}
          onClick={() => setExpanded(expanded === n.name ? null : n.name)}
        >
          <h3>{n.name}</h3>
          <div className="name-hiero">{n.hieroglyph}</div>
          <div className="meaning">{n.meaning}</div>

          {expanded === n.name && (
            <div className="details">
              <div className="detail-row">
                <div className="label">Hieroglyphic Breakdown</div>
                <div className="value">{n.breakdown}</div>
              </div>
              <div className="detail-row">
                <div className="label">Historical Context</div>
                <div className="value">{n.historical}</div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
