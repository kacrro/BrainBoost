import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../styles/PopupScreen.css';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

type GameResult = {
    id?: number;
    score: number;
    created_at?: string;
};

type CustomDotProps = {
    cx?: number;
    cy?: number;
    payload?: GameResult;
};

const PopupScreen = ({
                         score,
                         popupVisible,
                         setIsStarted,
                         setPopupVisible,
                         setScore,
                         resetGame,
                         lastLevel,
                         lastCorrectNumber,
                         lastUserInput
                     }: {
    score: number;
    popupVisible: boolean;
    setIsStarted: Dispatch<SetStateAction<boolean>>;
    setPopupVisible: Dispatch<SetStateAction<boolean>>;
    setScore: Dispatch<SetStateAction<number>>;
    resetGame: () => void;
    lastLevel: number;
    lastCorrectNumber: string;
    lastUserInput: string;
}) => {
    const { userEmail } = useAuth();
    const [recentScores, setRecentScores] = useState<GameResult[]>([]);
    const [localScoreId, setLocalScoreId] = useState<number | null>(null);

    useEffect(() => {
        const fetchRecentScores = async () => {
            if (!userEmail) return;

            const { data, error } = await supabase
                .from('GameResult')
                .select('id, score, created_at')
                .eq('user_email', userEmail)
                .eq('game_type', 'NumberMemory')
                .not('created_at', 'is', null)
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) {
                console.error('Error fetching scores:', error);
                return;
            }

            if (data) {
                const reversed = data.reverse();
                const lastId = reversed.length > 0 ? reversed[reversed.length - 1].id ?? 0 : 0;
                const newId = lastId + 1;
                setLocalScoreId(newId);

                const now = new Date().toISOString();

                // Check if current score already exists recently (to avoid duplicate in chart)
                const alreadyExists = reversed.some(
                    (entry) =>
                        entry.score === score &&
                        entry.created_at &&
                        Math.abs(new Date(entry.created_at).getTime() - new Date(now).getTime()) < 3000
                );

                const augmented: GameResult[] = alreadyExists
                    ? reversed
                    : [...reversed, { id: newId, score, created_at: now }];

                setRecentScores(augmented);
            }
        };

        if (popupVisible) {
            fetchRecentScores();
        }
    }, [popupVisible, userEmail, score]);

    const handlePlayAgain = () => {
        setScore(0);
        setIsStarted(true);
        setPopupVisible(false);
    };

    const handleClose = () => {
        setScore(0);
        setIsStarted(false);
        setPopupVisible(false);
        resetGame();
    };

    const renderDot = ({ cx, cy, payload }: CustomDotProps) => {
        const isCurrent = payload?.id === localScoreId;

        return (
            <circle
                cx={cx}
                cy={cy}
                r={isCurrent ? 6 : 4}
                fill={isCurrent ? 'orange' : '#8884d8'}
                stroke="#fff"
                strokeWidth={isCurrent ? 2 : 1}
            />
        );
    };

    const formatFullDate = (value?: string) => {
        try {
            const date = new Date(value || '');
            if (isNaN(date.getTime())) return '';
            return date.toLocaleString('pl-PL', {
                timeZone: 'Europe/Warsaw',
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return '';
        }
    };

    const renderCustomTick = (props: any) => {
        const { x, y, payload } = props;
        const rawDate = new Date(payload.value);

        const isValid = !isNaN(rawDate.getTime());

        const time = isValid
            ? rawDate.toLocaleTimeString('pl-PL', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Europe/Warsaw'
            })
            : '';

        const date = isValid
            ? rawDate.toLocaleDateString('pl-PL', {
                day: '2-digit',
                month: '2-digit',
                timeZone: 'Europe/Warsaw'
            })
            : '';

        return (
            <g transform={`translate(${x},${y + 10})`}>
                <text x={0} y={0} dy={8} textAnchor="middle" fill="#666" fontSize={10}>
                    {time}
                </text>
                <text x={0} y={12} dy={8} textAnchor="middle" fill="#aaa" fontSize={9}>
                    {date}
                </text>
            </g>
        );
    };

    const chartWidth = Math.max(recentScores.length * 80, 320);

    const popupContentStyle: React.CSSProperties = {
        background: 'white',
        padding: '32px',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        width: `${chartWidth + 64}px`,
        maxWidth: '95vw',
        position: 'relative',
        margin: '0 auto'
    };

    return (
        <Popup
            open={popupVisible}
            modal
            closeOnDocumentClick={false}
            contentStyle={{
                width: 'fit-content',
                maxWidth: '95vw',
                height: 'fit-content',
                padding: 0,
                background: 'none',
                boxShadow: 'none',
                border: 'none'
            }}
            overlayStyle={{
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <div style={popupContentStyle} onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={handleClose}>×</button>

                {/* NumberMemory text info */}
                <h2>Game Over!</h2>
                <p>Your Score: {score}</p>
                <h3>Level: {lastLevel}</h3>
                <p>Number: {lastCorrectNumber}</p>
                <p>Your Answer: {lastUserInput}</p>

                {/* Chart Section */}
                {recentScores.length > 0 ? (
                    <div
                        style={{
                            width: `${chartWidth}px`,
                            margin: '0 auto 40px auto',
                            height: 360
                        }}
                    >
                        <h3
                            style={{
                                textAlign: 'center',
                                marginBottom: '12px',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: '#333'
                            }}
                        >
                            Recent Scores
                        </h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={recentScores}
                                margin={{ top: 10, right: 30, bottom: 50, left: -10 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="created_at"
                                    tick={renderCustomTick}
                                    minTickGap={30}
                                    interval={0}
                                />
                                <YAxis />
                                <Tooltip labelFormatter={formatFullDate} />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                    dot={renderDot}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p style={{ margin: '40px 0' }}>
                        {userEmail
                            ? 'No recent scores yet. Play more games to see your progress!'
                            : 'Log in to start tracking your progress.'}
                    </p>
                )}

                <button
                    className="btn btn-moving-gradient_2 btn-moving-gradient--purple"
                    onClick={handlePlayAgain}
                >
                    Play Again
                </button>
            </div>
        </Popup>
    );
};

export default PopupScreen;
