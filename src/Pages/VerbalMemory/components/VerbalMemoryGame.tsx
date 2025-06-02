import GameArea from "./GameArea";
import React from "react";

const VerbalMemoryGame = ({
  isStarted,
  setIsStarted,
  setScore,
  setPopupVisible,
  score
}: {
  isStarted: boolean;
  setIsStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setPopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
  score: number;
}) => {
  return (
    <div className="verbal-memory">
      {isStarted && (
        <GameArea
          isStarted={isStarted}
          setIsStarted={setIsStarted}
          setScore={setScore}
          setPopupVisible={setPopupVisible}
          score={score}
        />
      )}
    </div>
  );
};

export default VerbalMemoryGame;