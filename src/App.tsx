import { useEffect } from 'react';
import { useStore } from './engine/store';
import { Nav } from './components/Nav';
import { Home } from './components/Home';
import { Practice } from './components/Practice';
import { ReadingRoom } from './components/ReadingRoom';
import { NameLookup } from './components/NameLookup';
import { Progress } from './components/Progress';
import { WritingCanvas } from './components/WritingCanvas';

export default function App() {
  const view = useStore(s => s.view);
  const theme = useStore(s => s.theme);
  const loadSRS = useStore(s => s.loadSRS);

  useEffect(() => { loadSRS(); }, [loadSRS]);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app">
      <Nav />
      {view === 'home' && <Home />}
      {view === 'practice' && <Practice />}
      {view === 'write' && <WritingCanvas />}
      {view === 'reading' && <ReadingRoom />}
      {view === 'names' && <NameLookup />}
      {view === 'progress' && <Progress />}
    </div>
  );
}
