import { JumbledLetters } from '../components/games/JumbledLetters';

const words = [
  { id: '1', word: 'world' },
  { id: '2', word: 'happy' },
  { id: '3', word: 'beautiful' },
];

function JumbledWords() {
  // Shuffle and select a random word
  const randomIndex = Math.floor(Math.random() * words.length);
  const jumbledLetters = words[randomIndex].word.split('').sort(() => Math.random() - 0.5);

  return <JumbledLetters letters={jumbledLetters} />;
}

export default JumbledWords;