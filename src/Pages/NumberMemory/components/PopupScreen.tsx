import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../styles/PopupScreen.css';
import { Dispatch, SetStateAction } from "react";

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
    score: number,
    popupVisible: boolean,
    setIsStarted: Dispatch<SetStateAction<boolean>>,
    setPopupVisible: Dispatch<SetStateAction<boolean>>,
    setScore: Dispatch<SetStateAction<number>>,
    resetGame: () => void,
    lastLevel: number,
    lastCorrectNumber: string,
    lastUserInput: string
}) => {
    return (
        <Popup
            open={popupVisible}
            modal
            closeOnDocumentClick={false}
            contentStyle={{
                background: 'none',
                boxShadow: 'none',
                border: 'none',
                padding: 0,
                width: 'auto'
            }}
            overlayStyle={{
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <div className="popup-content">
                <button
                    className="close-button"
                    onClick={() => {
                        setScore(0);
                        setIsStarted(false);
                        setPopupVisible(false);
                        resetGame();
                    }}
                >
                    ×
                </button>

                <h2>Game Over!</h2>
                <p>Your Score: {score}</p>
                <h3>Level: {lastLevel}</h3>
                <p>Number: {lastCorrectNumber}</p>
                <p>Your Answer: {lastUserInput}</p>
                <button
                    className="replay-button"
                    onClick={() => {
                        setScore(0);
                        setIsStarted(true);
                        setPopupVisible(false);
                    }}
                >
                    Play Again
                </button>
            </div>
        </Popup>
    );
};

export default PopupScreen;