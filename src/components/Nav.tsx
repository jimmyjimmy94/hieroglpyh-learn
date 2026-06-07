import { useStore } from '../engine/store';
import type { AppView } from '../engine/store';

const links: { view: AppView; label: string }[] = [
  { view: 'home', label: 'Home' },
  { view: 'practice', label: 'Practice' },
  { view: 'write', label: 'Write' },
  { view: 'reading', label: 'Read' },
  { view: 'names', label: 'Names' },
  { view: 'progress', label: 'Progress' },
];

export function Nav() {
  const view = useStore(s => s.view);
  const setView = useStore(s => s.setView);
  const theme = useStore(s => s.theme);
  const toggleTheme = useStore(s => s.toggleTheme);

  return (
    <nav className="nav">
      <button className="nav-logo" onClick={() => setView('home')}>
        <span className="hiero-icon">𓂀</span>
        Hieroglyph Academy
      </button>
      <div className="nav-links">
        {links.map(({ view: v, label }) => (
          <button
            key={v}
            className={`nav-link${view === v ? ' active' : ''}`}
            onClick={() => setView(v)}
          >
            {label}
          </button>
        ))}
        <button
          className="nav-link"
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          style={{ fontSize: '1rem', padding: '6px 10px' }}
        >
          {theme === 'light' ? '☀' : '☾'}
        </button>
      </div>
    </nav>
  );
}
