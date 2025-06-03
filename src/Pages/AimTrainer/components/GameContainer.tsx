import React, { useEffect, useState, useRef } from "react";
import "../styles/AimTrainer.css";
import {Target} from "./Target";
import {useAuth} from "../../../contexts/AuthContext"; // Import kontekstu autoryzacji
import {supabase} from "../../../utils/supabase"; // Import klienta Supabase
import PopupScreen from "./PopupScreen"; // Import PopupScreen

type Phase = 'start' | 'countdown' | 'playing' | 'finished';

interface HitResult {
    x: number;
    y: number;
    timeToHit: number;
}

export const GameContainer: React.FC = () => {
    const { userEmail } = useAuth(); // Pobieranie emaila użytkownika z kontekstu

    const [phase, setPhase] = useState<Phase>('start');
    const [count, setCount] = useState<number>(3);
    const [targetPosition, setTargetPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [targetSize, setTargetSize] = useState<number>(50); // Rozmiar celu w pikselach
    const [hits, setHits] = useState<HitResult[]>([]);
    const [gameStartTime, setGameStartTime] = useState<number>(0);
    const [lastTargetTime, setLastTargetTime] = useState<number>(0);
    const [showTarget, setShowTarget] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [timeLeft, setTimeLeft] = useState<number>(10); // sekund na grę
    const [isSaving, setIsSaving] = useState<boolean>(false); // Stan zapisywania wyniku
    const [popupVisible, setPopupVisible] = useState<boolean>(false); // Stan widoczności popup
    const [averageReactionTime, setAverageReactionTime] = useState<number | null>(null); // Średni czas reakcji

    const gameAreaRef = useRef<HTMLDivElement>(null);
    const hasSavedScoreRef = useRef(false);
    const savingRef = useRef(false);

    // Funkcja do zapisywania wyniku do bazy danych
    const saveScore = async (avgReactionTime: number) => {
        // Sprawdzenie czy użytkownik jest zalogowany
        if (!userEmail || savingRef.current || hasSavedScoreRef.current) {
            return;
        }

        savingRef.current = true;
        setIsSaving(true);

        try {
            // Wstawienie wyniku do tabeli GameResult
            // score = średni czas reakcji w milisekundach (im mniejszy, tym lepszy wynik)
            const { error } = await supabase
                .from('GameResult')
                .insert({
                    game_type: 'AimTrainer', // Typ gry
                    user_email: userEmail, // Email użytkownika
                    score: avgReactionTime, // Średni czas reakcji jako wynik końcowy
                    created_at: new Date().toISOString(),
                });

            if (error) {
                console.error('Błąd podczas zapisywania wyniku:', error);
                throw error;
            }

            hasSavedScoreRef.current = true;
            console.log('Wynik został pomyślnie zapisany:', {
                game_type: 'AimTrainer',
                user_email: userEmail,
                score: avgReactionTime,
                totalHits: hits.length,
                gameScore: score
            });

        } catch (error) {
            console.error('Wystąpił błąd podczas zapisywania:', error);
        } finally {
            setIsSaving(false);
            savingRef.current = false;
        }
    };

    // Funkcja do generowania losowej pozycji celu
    const generateRandomPosition = () => {
        if (gameAreaRef.current) {
            const gameArea = gameAreaRef.current;
            const maxX = gameArea.clientWidth - targetSize;
            const maxY = gameArea.clientHeight - targetSize;

            // Zapewnienie marginesu od krawędzi
            const x = Math.max(10, Math.floor(Math.random() * maxX));
            const y = Math.max(10, Math.floor(Math.random() * maxY));

            return { x, y };
        }
        return { x: 0, y: 0 };
    };

    // Obsługa odliczania
    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;

        if (phase === 'countdown') {
            if (count > 0) {
                timer = setTimeout(() => {
                    setCount(count - 1);
                }, 1000);
            } else {
                setPhase('playing');
                setCount(3);
                setGameStartTime(Date.now());
                setTimeLeft(10);
                setScore(0);
                setHits([]);
                setShowTarget(false);
                hasSavedScoreRef.current = false; // Reset flagi zapisywania
            }
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [phase, count]);

    // Obsługa czasu gry
    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;

        if (phase === 'playing') {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setPhase('finished');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [phase]);

    // Automatyczne zapisywanie wyniku po zakończeniu gry
    useEffect(() => {
        if (phase === 'finished' && hits.length > 0) {
            const avgTime = Math.round(hits.reduce((acc, hit) => acc + hit.timeToHit, 0) / hits.length);
            setAverageReactionTime(avgTime);

            // Zapisujemy wynik jeśli użytkownik jest zalogowany
            if (userEmail && !hasSavedScoreRef.current) {
                setTimeout(() => {
                    saveScore(avgTime);
                }, 500);
            }
        }
    }, [phase, hits.length, userEmail]);

    // Pojawianie się nowego celu
    useEffect(() => {
        if (phase === 'playing' && !showTarget) {
            const newPosition = generateRandomPosition();
            setTargetPosition(newPosition);
            setShowTarget(true);
            setLastTargetTime(Date.now());
        }
    }, [phase, showTarget]);

    // Obsługa kliknięcia w cel
    const handleTargetClick = () => {
        if (phase === 'playing') {
            const hitTime = Date.now();
            const timeToHit = hitTime - lastTargetTime;

            // Dodaj nowy cel do listy trafień
            const newHit: HitResult = {
                x: targetPosition.x,
                y: targetPosition.y,
                timeToHit
            };

            setHits((prevHits) => [...prevHits, newHit]);
            setScore((prevScore) => prevScore + 1);
            setShowTarget(false);
        }
    };

    // Funkcja resetowania gry
    const resetGame = () => {
        setPhase('start');
        setCount(3);
        setScore(0);
        setHits([]);
        setShowTarget(false);
        setTimeLeft(10);
        setIsSaving(false);
        setPopupVisible(false);
        setAverageReactionTime(null);
        hasSavedScoreRef.current = false;
    };

    // Obsługa kliknięcia "Zobacz wyniki"
    const handleShowResults = () => {
        if (averageReactionTime !== null) {
            setPopupVisible(true);
        } else {
            // Jeśli brak średniego czasu, po prostu zrestartuj grę
            resetGame();
        }
    };

    // Obsługa zamknięcia popup
    const handleClosePopup = () => {
        setPopupVisible(false);
        resetGame();
    };

    // Obsługa "Zagraj ponownie" z popup
    const handlePlayAgain = () => {
        setPopupVisible(false);
        setPhase('start');
        setScore(0);
        setHits([]);
        setShowTarget(false);
        setTimeLeft(10);
        setAverageReactionTime(null);
        hasSavedScoreRef.current = false;
    };

    return (
        <>
            <div className="game-container">
                <div
                    className="game-area"
                    style={{ width: "80%", height: "600px" }}
                    ref={gameAreaRef}
                >
                    {phase === 'start' && (
                        <div className="start-window">
                            <h1 className="game-title">Aim Trainer</h1>
                            <p style={{ fontSize: "1rem" }}>Sprawdź swoje możliwości motoryczne!</p>
                            {/* Informacja o statusie logowania */}
                            {!userEmail && (
                                <p style={{ fontSize: "0.9rem", color: "#888", marginBottom: "10px" }}>
                                    Zaloguj się, aby zapisać średni czas reakcji!
                                </p>
                            )}
                            <button
                                className="btn btn-moving-gradient btn-moving-gradient--blue"
                                style={{ top: "75%" }}
                                onClick={() => setPhase('countdown')}
                            >
                                Start
                            </button>
                        </div>
                    )}

                    {phase === 'countdown' && (
                        <div className="start-window">
                            <div className="countdown-number">{count}</div>
                        </div>
                    )}

                    {phase === 'playing' && (
                        <div className="game-play-area">
                            <div className="game-info">
                                <div className="score">Punkty: {score}</div>
                                <div className="time-left">Czas: {timeLeft}s</div>
                            </div>

                            {showTarget && (
                                <Target
                                    positionX={targetPosition.x}
                                    positionY={targetPosition.y}
                                    size={targetSize}
                                    onClick={handleTargetClick}
                                />
                            )}
                        </div>
                    )}

                    {phase === 'finished' && (
                        <div className="start-window">
                            <h2>Koniec gry!</h2>
                            <div className="results">
                                <p>Twój wynik: {score} punktów</p>
                                <p>Średni czas reakcji: {averageReactionTime || 0} ms</p>

                                {/* Informacja o zapisywaniu wyniku */}
                                {userEmail && (
                                    <div style={{ marginTop: "10px", fontSize: "0.9rem" }}>
                                        {isSaving ? (
                                            <p style={{ color: "#007bff" }}>Zapisywanie wyniku...</p>
                                        ) : hits.length > 0 ? (
                                            <p style={{ color: "#28a745" }}>✓ Średni czas reakcji zapisany!</p>
                                        ) : (
                                            <p style={{ color: "#ffc107" }}>Brak trafień do zapisania</p>
                                        )}
                                    </div>
                                )}

                                {/* Informacja dla niezalogowanych użytkowników */}
                                {!userEmail && (
                                    <p style={{ fontSize: "0.9rem", color: "#dc3545", marginTop: "10px" }}>
                                        Zaloguj się, aby zapisać średni czas reakcji!
                                    </p>
                                )}
                            </div>

                            <button
                                className="btn btn-moving-gradient_2 btn-moving-gradient--blue"
                                onClick={handleShowResults}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Zapisywanie...' :
                                    (averageReactionTime !== null ? 'Zobacz wyniki' : 'Zagraj ponownie')}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Popup z wykresem wyników */}
            <PopupScreen
                averageReactionTime={averageReactionTime}
                totalHits={score}
                popupVisible={popupVisible}
                onClose={handleClosePopup}
                onPlayAgain={handlePlayAgain}
            />
        </>
    );
};