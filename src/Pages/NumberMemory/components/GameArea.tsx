import { useState, useEffect, useCallback, useRef, Dispatch, SetStateAction } from "react";
import '../styles/GameArea.css';

const GameArea = ({
                      isStarted,
                      setIsStarted,
                      setScore,
                      setPopupVisible,
                      score
                  }: {
    isStarted: boolean,
    setIsStarted: Dispatch<SetStateAction<boolean>>,
    setScore: Dispatch<SetStateAction<number>>,
    setPopupVisible: Dispatch<SetStateAction<boolean>>,
    score: number
}) => {
    const [currentNumber, setCurrentNumber] = useState('');
    const [userInput, setUserInput] = useState('');
    const [level, setLevel] = useState(1);
    const [lives, setLives] = useState(3);
    const [isShowingNumber, setIsShowingNumber] = useState(true);
    const [secondsLeft, setSecondsLeft] = useState(3);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const generateRandomNumber = useCallback(() => {
        const length = level;
        let number = '';
        for (let i = 0; i < length; i++) {
            number += Math.floor(Math.random() * 10).toString();
        }
        return number;
    }, [level]);

    const checkAnswer = () => {
        if (userInput === currentNumber) {
            setScore(prev => prev + level * 10);
            setLevel(prev => prev + 1);
            setCurrentNumber(generateRandomNumber());
            setUserInput('');
            setIsShowingNumber(true);
            setSecondsLeft(3);
        } else {
            setLives(prev => {
                const updated = prev - 1;
                if (updated <= 0) {
                    setIsStarted(false);
                    setPopupVisible(true);
                    return 0;
                }
                setCurrentNumber(generateRandomNumber());
                setUserInput('');
                setIsShowingNumber(true);
                setSecondsLeft(3);
                return updated;
            });
        }
    };

    useEffect(() => {
        if (!isStarted) return;

        if (isShowingNumber) {
            intervalRef.current = setInterval(() => {
                setSecondsLeft(prev => {
                    if (prev > 1) {
                        return prev - 1;
                    } else {
                        setIsShowingNumber(false);
                        setSecondsLeft(0);
                        return 0;
                    }
                });
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isShowingNumber, isStarted]);

    useEffect(() => {
        if (isStarted) {
            setCurrentNumber(generateRandomNumber());
            setLevel(1);
            setLives(3);
            setUserInput('');
            setIsShowingNumber(true);
            setSecondsLeft(3);
        }
    }, [isStarted, generateRandomNumber]);

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

            <div className="timer-display" style={{ color: secondsLeft <= 1 ? 'red' : 'black' }}>
                {isShowingNumber ? `Time left: ${secondsLeft}s` : ''}
            </div>

            <div className="number-display">
                <h2>{isShowingNumber ? currentNumber : ''}</h2>
            </div>

            {!isShowingNumber && (
                <div className="input-area">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="Enter the number"
                        className="number-input"
                        autoFocus
                    />
                    <button onClick={checkAnswer} className="submit-button">Submit</button>
                </div>
            )}
        </div>
    );
};

export default GameArea;