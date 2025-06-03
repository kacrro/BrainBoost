import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
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
import '../styles/PopupScreen.css';

type GameResult = {
  id: number;
  score: number;
  created_at?: string;
};

type CustomDotProps = {
  cx?: number;
  cy?: number;
  payload?: GameResult;
};

interface PopupScreenProps {
  reactionTime: number | null;
  popupVisible: boolean;
  onClose: () => void;
  onPlayAgain: () => void;
  allAttempts: number[];
}

const PopupScreen: React.FC<PopupScreenProps> = ({
                                                   reactionTime,
                                                   popupVisible,
                                                   onClose,
                                                   onPlayAgain
                                                 }) => {
  const { userEmail } = useAuth();
  const [recentScores, setRecentScores] = useState<GameResult[]>([]);
  const [localScoreId, setLocalScoreId] = useState<number | null>(null);

  // Stała szerokość wykresu
  const CHART_WIDTH = 600;
  const MAX_DISPLAYED_RESULTS = 50; // Zwiększono z 15 do 50

  useEffect(() => {
    const fetchRecentScores = async () => {
      if (!userEmail) return;

      const { data, error } = await supabase
          .from('GameResult')
          .select('id, score, created_at')
          .eq('user_email', userEmail)
          .eq('game_type', 'ReactionTime')
          .not('created_at', 'is', null)
          .order('created_at', { ascending: false })
          .limit(100); // Pobieramy więcej danych z bazy

      if (error) {
        console.error('Error fetching scores:', error);
        return;
      }

      if (data) {
        const reversed = data.reverse();
        const lastId = reversed.length > 0 ? reversed[reversed.length - 1].id : 0;
        const newId = lastId + 1;
        setLocalScoreId(newId);

        const now = new Date().toISOString();

        // Sprawdź czy najnowszy wynik już istnieje
        const alreadyExists = reversed.some(
            (entry) =>
                entry.score === reactionTime &&
                entry.created_at &&
                Math.abs(new Date(entry.created_at).getTime() - new Date(now).getTime()) < 3000
        );

        let allResults: GameResult[] = alreadyExists || reactionTime === null
            ? reversed
            : [...reversed, { id: newId, score: reactionTime, created_at: now }];

        // Ograniczamy do ostatnich MAX_DISPLAYED_RESULTS wyników dla wykresu
        const displayedResults = allResults.slice(-MAX_DISPLAYED_RESULTS);

        setRecentScores(displayedResults);
      }
    };

    if (popupVisible && reactionTime !== null) {
      fetchRecentScores();
    }
  }, [popupVisible, userEmail, reactionTime]);

  const handlePlayAgainClick = () => {
    onPlayAgain();
  };

  const renderDot = ({ cx, cy, payload }: CustomDotProps) => {
    const isCurrent = payload?.id === localScoreId;

    return (
        <circle
            cx={cx}
            cy={cy}
            r={isCurrent ? 6 : 3} // Zmniejszono rozmiar punktów
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

  // Inteligentny system wyświetlania etykiet na osi X
  const calculateTickInterval = (dataLength: number) => {
    if (dataLength <= 10) return 0; // Pokaż wszystkie
    if (dataLength <= 20) return 1; // Co drugi
    if (dataLength <= 30) return 2; // Co trzeci
    if (dataLength <= 40) return 3; // Co czwarty
    return Math.floor(dataLength / 10); // Maksymalnie ~10 etykiet
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
          <text x={0} y={0} dy={8} textAnchor="middle" fill="#666" fontSize={9}>
            {time}
          </text>
          <text x={0} y={12} dy={8} textAnchor="middle" fill="#aaa" fontSize={8}>
            {date}
          </text>
        </g>
    );
  };

  const popupContentStyle: React.CSSProperties = {
    background: 'white',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    width: `${CHART_WIDTH + 64}px`,
    maxWidth: '95vw',
    position: 'relative' as const,
    margin: '0 auto'
  };

  const getPerformanceMessage = (time: number) => {
    if (time < 200) return "Świetny wynik! 🚀";
    if (time < 300) return "Bardzo dobry wynik! 👍";
    if (time < 400) return "Dobry wynik! 😊";
    if (time < 500) return "Przeciętny wynik 🙂";
    return "Możesz się poprawić! 💪";
  };

  // Oblicz statystyki z wszystkich wyświetlanych prób
  const avgTime = recentScores.length > 0
      ? Math.round(recentScores.reduce((sum, score) => sum + score.score, 0) / recentScores.length)
      : null;

  const bestTime = recentScores.length > 0
      ? Math.min(...recentScores.map(score => score.score))
      : null;

  // Oblicz interwał dla etykiet osi X
  const tickInterval = calculateTickInterval(recentScores.length);

  return (
      <Popup
          open={popupVisible}
          modal
          closeOnDocumentClick={true}
          onClose={onClose}
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
          <button className="close-button" onClick={onClose}>×</button>

          {reactionTime && (
              <>
                <h2>Czas reakcji: {reactionTime} ms</h2>
                <p style={{ fontSize: '18px', margin: '16px 0', color: '#333' }}>
                  {getPerformanceMessage(reactionTime)}
                </p>

                {/* Statystyki */}
                {recentScores.length > 1 && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      margin: '20px 0',
                      padding: '15px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px'
                    }}>
                      <div>
                        <strong>Najlepszy:</strong><br />
                        <span style={{ color: '#28a745', fontSize: '18px' }}>
                    {bestTime} ms
                  </span>
                      </div>
                      <div>
                        <strong>Średni:</strong><br />
                        <span style={{ color: '#007bff', fontSize: '18px' }}>
                    {avgTime} ms
                  </span>
                      </div>
                      <div>
                        <strong>Prób:</strong><br />
                        <span style={{ color: '#6c757d', fontSize: '18px' }}>
                    {recentScores.length}
                  </span>
                      </div>
                    </div>
                )}

                {recentScores.length > 1 ? (
                    <div
                        style={{
                          width: `${CHART_WIDTH}px`,
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
                        Historia czasów reakcji (ostatnie {recentScores.length} prób)
                      </h3>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={recentScores}
                            margin={{ top: 10, right: 30, bottom: 50, left: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                              dataKey="created_at"
                              tick={renderCustomTick}
                              minTickGap={15} // Zmniejszono odstęp między etykietami
                              interval={tickInterval} // Inteligentny interwał
                          />
                          <YAxis
                              label={{ value: 'Czas (ms)', angle: -90, position: 'insideLeft' }}
                          />
                          <Tooltip
                              labelFormatter={formatFullDate}
                              formatter={(value: number) => [`${value} ms`, 'Czas reakcji']}
                          />
                          <Line
                              type="monotone"
                              dataKey="score"
                              stroke="#8884d8"
                              strokeWidth={2}
                              dot={renderDot}
                              connectNulls={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                ) : (
                    <p style={{ margin: '20px 0', color: '#666' }}>
                      {userEmail
                          ? 'Zagraj więcej razy, aby zobaczyć wykres postępów!'
                          : 'Zaloguj się, aby śledzić swoje postępy.'}
                    </p>
                )}

                <button
                    className="btn btn-moving-gradient_2 btn-moving-gradient--blue"
                    onClick={handlePlayAgainClick}
                    style={{ marginTop: '10px' }}
                >
                  Zagraj ponownie
                </button>
              </>
          )}
        </div>
      </Popup>
  );
};

export default PopupScreen;