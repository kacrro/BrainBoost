import GameArea from "./GameArea";
import PopupScreen from "./PopupScreen"
import '../styles/SequenceMemoryGame.css'
import {useState} from "react";

const SequenceMemoryGame = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [popupVisible, setPopupVisible] = useState(true);
  const [score, setScore] = useState(0);
  const [replay, setReplay] = useState(false);

  return (
    <div className="sequence-memory">
      <GameArea
        isStarted={isStarted}
        setIsStarted={setIsStarted}
        setScore={setScore}
        setPopupVisible={setPopupVisible}
      />
      <PopupScreen
        score={score}
        popupVisible={popupVisible}
        setIsStarted={setIsStarted}
        setPopupVisible={setPopupVisible}
        replay={replay}
        setReplay={setReplay}
      />
    </div>
  );
};

export default SequenceMemoryGame;
