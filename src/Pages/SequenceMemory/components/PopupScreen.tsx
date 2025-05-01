import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../styles/PopupScreen.css'
import {Dispatch, SetStateAction} from "react";

const PopupScreen = ({score, popupVisible, setIsStarted, setPopupVisible, replay, setReplay}: {
  score: number, popupVisible: boolean,
  setIsStarted: Dispatch<SetStateAction<boolean>>,
  setPopupVisible: Dispatch<SetStateAction<boolean>>,
  replay: boolean,
  setReplay: Dispatch<SetStateAction<boolean>>
}) => {
  return (
    <Popup open={popupVisible} position="center center">
      {replay ?
      <div className="popup-content">
        <h2>Wynik: {score}</h2>
        <button className="btn btn-moving-gradient btn-moving-gradient--purple" onClick={() => {
          setIsStarted(true);
          setPopupVisible(false);
        }}>Zagraj ponownie</button>
      </div> :
      <div className="popup-content">
        <button className="btn btn-moving-gradient btn-moving-gradient--purple" onClick={() => {
          setIsStarted(true);
          setPopupVisible(false);
          setReplay(true);
        }}>Zagraj</button>
      </div>}
    </Popup>
  );
};

export default PopupScreen;