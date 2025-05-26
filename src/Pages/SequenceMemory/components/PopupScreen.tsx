import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../styles/PopupScreen.css'
import {Dispatch, SetStateAction} from "react";

const PopupScreen = ({score, setScore, popupVisible, setIsStarted, setPopupVisible, replay, setReplay}: {
  score: number, popupVisible: boolean,
  setScore: Dispatch<SetStateAction<number>>,
  setIsStarted: Dispatch<SetStateAction<boolean>>,
  setPopupVisible: Dispatch<SetStateAction<boolean>>,
  replay: boolean,
  setReplay: Dispatch<SetStateAction<boolean>>
}) => {
  return (
    <Popup open={popupVisible} position="center center">
      {replay ?
      <div className="popup-content">
        <h2>Score: {score}</h2>
        <button className="btn btn-moving-gradient btn-moving-gradient--purple" onClick={() => {
          setIsStarted(true);
          setPopupVisible(false);
          setScore(0);
        }}>Play again</button>
      </div> :
      <div className="popup-content">
        <button className="btn btn-moving-gradient btn-moving-gradient--purple" onClick={() => {
          setIsStarted(true);
          setPopupVisible(false);
          setReplay(true);
        }}>Play</button>
      </div>}
    </Popup>
  );
};

export default PopupScreen;