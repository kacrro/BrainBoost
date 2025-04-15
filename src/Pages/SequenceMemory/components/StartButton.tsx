import '../styles/SequenceMemoryGame.css'
import {Dispatch, SetStateAction, useEffect, useState} from "react";

const StartButton = ({isStarted, setIsStarted}: {isStarted: boolean, setIsStarted:  Dispatch<SetStateAction<boolean>>}) => {
  const [disabled, setDisabled] = useState(false);
  
  const handleClick = () => {
    setIsStarted(true);
    setDisabled(true);
  }

  useEffect(() => {
    setDisabled(isStarted);
  }, [isStarted, setDisabled]);

  return (
    <button className={`free-play-button ${disabled ? 'disabled' : ''}`} onClick={handleClick} disabled={disabled}>
      Graj
    </button>
  );
};

export default StartButton;