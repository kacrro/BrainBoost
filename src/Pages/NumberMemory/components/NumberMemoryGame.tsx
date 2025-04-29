import GameArea from "./GameArea";
import PopupScreen from "./PopupScreen";
import { useState } from "react";

const NumberMemoryGame = ({ resetGame }: { resetGame: () => void }) => {
    const [isStarted, setIsStarted] = useState(true);
    const [score, setScore] = useState(0);
    const [popupVisible, setPopupVisible] = useState(false);
    const [lastLevel, setLastLevel] = useState(1); // Store the last level
    const [lastCorrectNumber, setLastCorrectNumber] = useState(''); // Store the last correct number
    const [lastUserInput, setLastUserInput] = useState(''); // Store the last user input

    return (
        <div className="number-memory">
            <GameArea
                isStarted={isStarted}
                setIsStarted={setIsStarted}
                setScore={setScore}
                setPopupVisible={setPopupVisible}
                score={score}
                resetGame={resetGame}
                setLastLevel={setLastLevel}
                setLastCorrectNumber={setLastCorrectNumber}
                setLastUserInput={setLastUserInput}
            />
            <PopupScreen
                score={score}
                popupVisible={popupVisible}
                setIsStarted={setIsStarted}
                setPopupVisible={setPopupVisible}
                setScore={setScore}
                resetGame={resetGame}
                lastLevel={lastLevel}
                lastCorrectNumber={lastCorrectNumber}
                lastUserInput={lastUserInput}
            />
        </div>
    );
};

export default NumberMemoryGame;