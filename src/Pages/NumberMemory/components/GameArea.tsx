import { useState, useEffect, useCallback, useRef, Dispatch, SetStateAction } from "react";
import '../styles/GameArea.css';

const GameArea = ({
                      isStarted,
                      setIsStarted,
                      setScore,
                      setPopupVisible,
                      score,
                      resetGame,
                      setLastLevel,
                      setLastCorrectNumber,
                      setLastUserInput
                  }: {
    isStarted: boolean,
    setIsStarted: Dispatch<SetStateAction<boolean>>,
    setScore: Dispatch<SetStateAction<number>>,
    setPopupVisible: Dispatch<SetStateAction<boolean>>,
    score: number,
    resetGame: () => void,
    setLastLevel: Dispatch<SetStateAction<number>>,
    setLastCorrectNumber: Dispatch<SetStateAction<string>>,
    setLastUserInput: Dispatch<SetStateAction<string>>
}) => {
    const [currentNumber, setCurrentNumber] = useState('');
    const [userInput, setUserInput] = useState('');
    const [level, setLevel] = useState(1);
    const [lives, setLives] = useState(3);
    const [isShowingNumber, setIsShowingNumber] = useState(true);
    const [isPostGuess, setIsPostGuess] = useState(false);
    const [lastCorrectNumberLocal, setLastCorrectNumberLocal] = useState('');
    const [lastUserInputLocal, setLastUserInputLocal] = useState('');
    const [secondsLeft, setSecondsLeft] = useState(1.5);
    const [totalDisplayTime, setTotalDisplayTime] = useState(1.5);
    const [highestLevel, setHighestLevel] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const generateRandomNumber = useCallback((sequenceLength: number) => {
        let number = '';
        for (let i = 0; i < sequenceLength; i++) {
            number += Math.floor(Math.random() * 10).toString();
        }
        return number;
    }, []);

    const checkAnswer = () => {
        // Store the guess details locally and in parent
        setLastCorrectNumberLocal(currentNumber);
        setLastUserInputLocal(userInput);
        setLastLevel(level);
        setLastCorrectNumber(currentNumber);
        setLastUserInput(userInput);
        setIsPostGuess(true);

        if (userInput === currentNumber) {
            const newLevel = level + 1;
            setLives(3);
            setLevel(newLevel);
            setHighestLevel(prev => Math.max(prev, level));
            setScore(Math.max(highestLevel + 1, level));
        } else {
            setLives(prev => {
                const updated = prev - 1;
                if (updated <= 0) {
                    setIsStarted(false);
                    setPopupVisible(true);
                    return 0;
                }
                return updated;
            });
        }
    };

    const proceedToNext = () => {
        if (lives > 0) {
            setCurrentNumber(generateRandomNumber(level));
            setUserInput('');
            setIsShowingNumber(true);
            setIsPostGuess(false);
            const displayTime = 1.5 + ((level - 1) * 0.5);
            setTotalDisplayTime(displayTime);
            setSecondsLeft(displayTime);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    };

    const preventCopy = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const preventContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    useEffect(() => {
        if (!isStarted) return;

        if (isShowingNumber) {
            intervalRef.current = setInterval(() => {
                setSecondsLeft(prev => {
                    if (prev > 0) {
                        const newTime = prev - 0.5;
                        return newTime < 0 ? 0 : newTime;
                    } else {
                        setIsShowingNumber(false);
                        return 0;
                    }
                });
            }, 500);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isShowingNumber, isStarted]);

    useEffect(() => {
        if (isStarted) {
            setCurrentNumber(generateRandomNumber(1));
            setLevel(1);
            setLives(3);
            setUserInput('');
            setIsShowingNumber(true);
            setIsPostGuess(false);
            setSecondsLeft(1.5);
            setTotalDisplayTime(1.5);
            setHighestLevel(0);
            setScore(0);
        }
    }, [isStarted, generateRandomNumber]);

    if (!isStarted) return null;

    const progressWidth = secondsLeft > 0 ? (secondsLeft / totalDisplayTime) * 100 : 0;
    const containerWidth = (totalDisplayTime / 1.5) * 100;

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

            {isShowingNumber && (
                <div className="timer-bar-container" style={{ width: `${containerWidth}px` }}>
                    <div
                        className="timer-bar"
                        style={{ width: `${progressWidth}%` }}
                    />
                </div>
            )}

            {isPostGuess ? (
                <div className="post-guess-display">
                    <h3>Level: {level-1}</h3>
                    <p>Number: {lastCorrectNumberLocal}</p>
                    <p>Your Answer: {lastUserInputLocal}</p>
                    {lives > 0 && (
                        <button onClick={proceedToNext} className="next-button">Next</button>
                    )}
                </div>
            ) : (
                <>
                    <div
                        className="number-display"
                        onCopy={preventCopy}
                        onContextMenu={preventContextMenu}
                        draggable={false}
                    >
                        <h2>{isShowingNumber ? currentNumber : ''}</h2>
                    </div>

                    {!isShowingNumber && (
                        <div className="input-area">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value.replace(/[^0-9]/g, ''))}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter the number"
                                className="number-input"
                                autoFocus
                            />
                            <button onClick={checkAnswer} className="submit-button">Submit</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default GameArea;