import React, { useEffect, useState, useRef } from "react";
import "../styles/AimTrainer.css";
import {Target} from "./Target";
import {useAuth} from "../../../contexts/AuthContext"; // Import kontekstu autoryzacji
import {supabase} from "../../../utils/supabase"; // Import klienta Supabase

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

    const gameAreaRef = useRef<HTMLDivElement>(null);

    // Funkcja do zapisywania wyniku do bazy danych
    const saveScore = async () => {
        // Sprawdzenie czy użytkownik jest zalogowany
        if (!userEmail) {
            console.log('Użytkownik nie jest zalogowany - wynik nie zostanie zapisany');
            return;
        }

        setIsSaving(true); // Ustawienie stanu zapisywania na true

        try {
            // Obliczenie średniego czasu reakcji - to będzie naszym wynikiem
            const averageReactionTime = hits.length > 0
                ? Math.round(hits.reduce((acc, hit) => acc + hit.timeToHit, 0) / hits.length)
                : 0;

            // Wstawienie wyniku do tabeli GameResult
            // score = średni czas reakcji w milisekundach (im mniejszy, tym lepszy wynik)
            const { error } = await supabase
                .from('GameResult')
                .insert({
                    game_type: 'AimTrainer', // Typ gry
                    user_email: userEmail, // Email użytkownika
                    score: averageReactionTime // Średni czas reakcji jako wynik końcowy
                });

            if (error) {
                console.error('Błąd podczas zapisywania wyniku:', error);
                throw error;
            }

            console.log('Wynik został pomyślnie zapisany:', {
                game_type: 'AimTrainer',
                user_email: userEmail,
                score: averageReactionTime, // Średni czas reakcji (główny wynik)
                totalHits: hits.length, // Liczba trafień (info dodatkowe)
                gameScore: score // Punkty zdobyte w grze (info dodatkowe)
            });

        } catch (error) {
            console.error('Wystąpił błąd podczas zapisywania:', error);
        } finally {
            setIsSaving(false); // Resetowanie stanu zapisywania
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
                setShowTarget(false);    // ← czyścimy poprzedni cel
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
        // Zapisujemy wynik tylko jeśli gracz miał przynajmniej jedno trafienie
        if (phase === 'finished' && hits.length > 0) {
            // Zapisujemy wynik z małym opóźnieniem, aby UI zdążył się zaktualizować
            setTimeout(() => {
                saveScore();
            }, 500);
        }
    }, [phase, hits.length]); // Zależność od phase i liczby trafień

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
    };

    return (
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
                            <p>Średni czas reakcji: {hits.length > 0 ? Math.round(hits.reduce((acc, hit) => acc + hit.timeToHit, 0) / hits.length) : 0} ms</p>

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
                            onClick={resetGame}
                            disabled={isSaving} // Wyłączenie przycisku podczas zapisywania
                        >
                            {isSaving ? 'Zapisywanie...' : 'Zagraj ponownie'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};