import GameArea from "./GameArea";
import PopupScreen from "./PopupScreen";
import { useState } from "react";

const NumberMemoryGame = () => {
    const [isStarted, setIsStarted] = useState(true);
    const [score, setScore] = useState(0);
    const [popupVisible, setPopupVisible] = useState(false);

    return (
        <div className="number-memory">
            <GameArea
                isStarted={isStarted}
                setIsStarted={setIsStarted}
                setScore={setScore}
                setPopupVisible={setPopupVisible}
                score={score}
            />
            <PopupScreen
                score={score}
                popupVisible={popupVisible}
                setIsStarted={setIsStarted}
                setPopupVisible={setPopupVisible}
                setScore={setScore}
            />
        </div>
    );
};

export default NumberMemoryGame;