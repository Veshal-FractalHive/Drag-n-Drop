import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import KanbanBoard from './pages/KanbanBoard';
import MatchTheFollowing from './pages/MatchTheFollowing';
import OddOneOut from './pages/OddOneOut';
import FillInTheBlanks from './pages/FillInTheBlanks';
import JumbledWords from './pages/JumbledWords';
import Puzzles from './pages/Puzzles';
import CircleTheOddOne from './pages/CircleTheOddOne';
import MatchTheFollowing2 from './pages/MatchTheFollowing2';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/kanban-board" element={<KanbanBoard />} />
      <Route path="/match-the-following" element={<MatchTheFollowing />} />
      <Route path="/odd-one-out" element={<OddOneOut />} />
      <Route path="/fill-in-the-blanks" element={<FillInTheBlanks />} />
      <Route path="/jumbled-words" element={<JumbledWords />} />
      <Route path="/puzzles" element={<Puzzles />} />
      <Route path="/circle-the-odd-one" element={<CircleTheOddOne />} />
      <Route path="/match-the-following2" element={<MatchTheFollowing2 />} />
    </Routes>
  );
}

export default App;
