import {
  useState, useEffect, useCallback, useRef, Dispatch, SetStateAction
} from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { supabase } from "../../../utils/supabase";
import '../styles/GameArea.css';
import { words } from 'popular-english-words';

const popularWords = words.getMostPopular(5000);
const shuffledWords = [...popularWords].sort(() => 0.5 - Math.random()).slice(0, 1000);
const allowedWords = shuffledWords.filter((word: string) => word.length >= 4 && word.length <= 7);

type GameAreaProps = {
  isStarted: boolean;
  setIsStarted: Dispatch<SetStateAction<boolean>>;
  setScore: Dispatch<SetStateAction<number>>;
  setPopupVisible: Dispatch<SetStateAction<boolean>>;
  score: number;
};

const GameArea = ({
  isStarted,
  setIsStarted,
  setScore,
  setPopupVisible,
  score
}: GameAreaProps) => {
  const { userEmail } = useAuth();
  const [currentWord, setCurrentWord] = useState('');
  const [newWords, setNewWords] = useState<string[]>([]);
  const [shownWords, setShownWords] = useState<string[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [lives, setLives] = useState(3);
  const [isWaitingForAnswer, setIsWaitingForAnswer] = useState(false);
  const [lastWord, setLastWord] = useState('');
  const [shownWordsStreak, setShownWordsStreak] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasLostLifeRef = useRef(false);
  const hasSavedScoreRef = useRef(false);
  const savingRef = useRef(false);

  const saveScore = useCallback(async () => {
    if (!userEmail || savingRef.current || hasSavedScoreRef.current) return;

    savingRef.current = true;
    const { error } = await supabase.from('GameResult').insert({
      game_type: 'VerbalMemory',
      user_email: userEmail,
      score,
      created_at: new Date().toISOString(),
    });

    if (!error) {
      hasSavedScoreRef.current = true;
    }

    savingRef.current = false;
  }, [userEmail, score]);

  const endGame = useCallback(() => {
    setIsStarted(false);
    setPopupVisible(true);

    setTimeout(async () => {
      if (!hasSavedScoreRef.current) {
        try {
          await saveScore();
        } catch (err) {
          console.error('Delayed saveScore error:', err);
        }
      }
    }, 100);
  }, [saveScore, setIsStarted, setPopupVisible]);

  const pickNewWord = useCallback(async () => {
    if (newWords.length === 0) {
      endGame();
      return;
    }

    const mustPickNewWord = shownWordsStreak >= 4;
    const shouldPickFromShown = !mustPickNewWord && shownWords.length > 0 && Math.random() < 0.6;

    if (shouldPickFromShown) {
      let randomOldWord = '';
      do {
        randomOldWord = shownWords[Math.floor(Math.random() * shownWords.length)];
      } while (randomOldWord === lastWord && shownWords.length > 1);

      setCurrentWord(randomOldWord);
      setLastWord(randomOldWord);
      setSecondsLeft(10);
      setIsWaitingForAnswer(true);
      setShownWordsStreak(prev => prev + 1);
      hasLostLifeRef.current = false;
    } else {
      let word = '';
      let updatedNewWords: string[];

      do {
        const randomIndex = Math.floor(Math.random() * newWords.length);
        word = newWords[randomIndex];
      } while (word === lastWord && newWords.length > 1);

      updatedNewWords = newWords.filter(w => w !== word);

      setNewWords(updatedNewWords);
      setCurrentWord(word);
      setLastWord(word);
      setSecondsLeft(10);
      setIsWaitingForAnswer(true);
      setShownWordsStreak(0);
      hasLostLifeRef.current = false;
    }
  }, [newWords, shownWords, lastWord, shownWordsStreak, endGame]);

  const loseLife = useCallback(() => {
    if (hasLostLifeRef.current) return;

    hasLostLifeRef.current = true;
    setLives(prev => {
      const updated = prev - 1;
      if (updated <= 0) {
        endGame();
        return 0;
      }
      return updated;
    });
  }, [endGame]);

  useEffect(() => {
    if (!isStarted) return;

    hasSavedScoreRef.current = false;
    savingRef.current = false;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev > 1) {
          return prev - 1;
        } else {
          if (isWaitingForAnswer) {
            setIsWaitingForAnswer(false);
            loseLife();
            setTimeout(() => pickNewWord(), 100);
          }
          return 0;
        }
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isStarted, isWaitingForAnswer, loseLife, pickNewWord]);

  useEffect(() => {
    if (isStarted) {
      const wordList = [...allowedWords];
      const randomIndex = Math.floor(Math.random() * wordList.length);
      const word = wordList[randomIndex];
      const updatedNewWords = wordList.filter((_, i) => i !== randomIndex);

      setNewWords(updatedNewWords);
      setCurrentWord(word);
      setLastWord(word);
      setShownWords([]);
      setSecondsLeft(10);
      setLives(3);
      setIsWaitingForAnswer(true);
      setShownWordsStreak(0);
      hasLostLifeRef.current = false;
    }
  }, [isStarted]);

  const handleAnswer = (wasSeen: boolean) => {
    if (!isWaitingForAnswer) return;

    const hasAppeared = shownWords.includes(currentWord);

    if ((wasSeen && hasAppeared) || (!wasSeen && !hasAppeared)) {
      setScore(prev => prev + 1);
      if (!hasAppeared) {
        setShownWords(prev => [...prev, currentWord]);
      }
    } else {
      loseLife();
    }

    setIsWaitingForAnswer(false);
    setTimeout(() => pickNewWord(), 100);
  };

  if (!isStarted) return null;

  return (
    <div className="game-area started">
      <div className="lives-display">
        {[...Array(3)].map((_, idx) => (
          <img
            key={idx}
            src={idx < lives ? "/images/heart.png" : "/images/heart_empty.png"}
            alt="heart"
            className="heart-icon"
          />
        ))}
      </div>

      <div className="score-display">Score: {score}</div>

      <div className="timer-display" style={{ color: secondsLeft <= 3 ? 'red' : 'black' }}>
        Time left: {secondsLeft}s
      </div>

      <div className="word-display">
        <h2>{currentWord}</h2>
      </div>

      <div className="buttons">
        <button onClick={() => handleAnswer(true)}>YES</button>
        <button onClick={() => handleAnswer(false)}>NO</button>
      </div>
    </div>
  );
};

export default GameArea;
