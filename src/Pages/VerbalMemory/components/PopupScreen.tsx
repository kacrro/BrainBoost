import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../styles/PopupScreen.css';
import { Dispatch, SetStateAction } from "react";

const PopupScreen = ({
  score,
  popupVisible,
  setPopupVisible,
  replay,
  onClose,
  onPlay
}: {
  score: number;
  popupVisible: boolean;
  setIsStarted: Dispatch<SetStateAction<boolean>>;
  setScore: Dispatch<SetStateAction<number>>;
  setPopupVisible: Dispatch<SetStateAction<boolean>>;
  replay: boolean;
  setReplay: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
  onPlay: () => void;
}) => {
  const handlePlayClick = () => {
    setPopupVisible(false);
    setTimeout(() => {
      onPlay();
    }, 50);
  };

  return (
    <Popup
      open={popupVisible}
      modal
      closeOnDocumentClick={true}
      onClose={onClose}
      contentStyle={{
        background: 'none',
        boxShadow: 'none',
        border: 'none',
        padding: 0,
        width: 'auto',
      }}
      overlayStyle={{
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>

        {replay ? (
          <>
            <h2>Score: {score}</h2>
            <button
              className="btn btn-moving-gradient_2 btn-moving-gradient--purple"
              onClick={handlePlayClick}
            >
              Play Again
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-moving-gradient_2 btn-moving-gradient--purple"
              onClick={handlePlayClick}
            >
              Play
            </button>
          </>
        )}
      </div>
    </Popup>
  );
};

export default PopupScreen;
