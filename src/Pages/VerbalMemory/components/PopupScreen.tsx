import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../styles/PopupScreen.css';
import { Dispatch, SetStateAction } from "react";

const PopupScreen = ({
  score,
  popupVisible,
  setIsStarted,
  setPopupVisible,
  setScore
}: {
  score: number,
  popupVisible: boolean,
  setIsStarted: Dispatch<SetStateAction<boolean>>,
  setPopupVisible: Dispatch<SetStateAction<boolean>>,
  setScore: Dispatch<SetStateAction<number>>
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
        <h2>Game Over!</h2>
        <p>Your Score: {score}</p>
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
