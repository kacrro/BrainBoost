import GameArea from "./GameArea";
import StartButton from "./StartButton";
import '../styles/SequenceMemoryGame.css'
import {useState} from "react";

const SequenceMemoryGame = () => {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <div className="sequence-memory">
      <GameArea isStarted={isStarted} setIsStarted={setIsStarted} />
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }} />
      <StartButton isStarted={isStarted} setIsStarted={setIsStarted} />
    </div>
  );
};

export default SequenceMemoryGame;
