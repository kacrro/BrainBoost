import '../../../styles/GameArea.css'
import {useState, useEffect, Dispatch, SetStateAction} from "react";

enum GameState {
  SEQUENCE,
  USER_INPUT
}

const GameArea = ({isStarted, setIsStarted, setScore, setPopupVisible}: {
  isStarted: boolean,
  setIsStarted: Dispatch<SetStateAction<boolean>>,
  setScore: Dispatch<SetStateAction<number>>,
  setPopupVisible: Dispatch<SetStateAction<boolean>>
}) => {
  const [gameState, setGameState] = useState<GameState>(GameState.SEQUENCE);
  const [sequence, setSequence] = useState<number[]>([Math.floor(Math.random() * 9)]);
  const [currentStep, setCurrentStep] = useState(0);

  const handleSquareClick = (index: number) => {
    if (currentStep >= sequence.length) {
      return;
    }

    if (gameState === GameState.SEQUENCE) {
      return;
    }

    if (index !== sequence[currentStep]) {
      highlightSquare(index, 1000, false);
      setPopupVisible(true);
      setIsStarted(false);
      setGameState(GameState.SEQUENCE);
      setCurrentStep(0);
      setSequence([Math.floor(Math.random() * 9)]);
      return;
    }

    highlightSquare(index, 200, true);
    setCurrentStep(currentStep + 1);

    if (currentStep + 1 === sequence.length) {
      setScore((prev) => prev + 1);
      setTimeout(() => {
        setGameState(GameState.SEQUENCE);
        setCurrentStep(0);
        setSequence((prev) => {
          let next;
          do {
            next = Math.floor(Math.random() * 9);
          } while (next === prev[prev.length - 1]);
          return [...prev, next];
        });
      }, 1000);
    }
    return;
  }

  const highlightSquare = (index: number, time: number, right: boolean) => {
    const squareRef = document.getElementById(`square-${index}`);
    if (squareRef) {
      squareRef.classList.add(`highlight_${right ? 'right' : 'wrong'}`);
      setTimeout(() => {
        squareRef.classList.remove(`highlight_${right ? 'right' : 'wrong'}`);
      }, time);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (isStarted) {
        sequence.forEach((index, i) => {
          setTimeout(() => {
            highlightSquare(index, 1000, true);
            if (i === sequence.length - 1) {
              setTimeout(() => {
                setGameState(GameState.USER_INPUT);
              }, 1000);
            }
          }, i * 1000);
        });
      }
    }, 1000);
  }, [isStarted, sequence]);

  return (
    <div
      className={`game-area ${isStarted ? 'started' : ''} ${gameState === GameState.SEQUENCE ? 'sequence' : 'user-input'}`}>
      <table className="square-grid">
        <tbody>
        {Array.from({length: 3}, (_, rowIndex) => (
          <tr key={rowIndex}>
            {[0, 1, 2].map((colIndex) => {
              const id = rowIndex * 3 + colIndex;
              return (
                <td key={id} className="square">
                  <button
                    className={`square-button`} id={`square-${id}`}
                    onClick={(_) => handleSquareClick(id)}
                    disabled={!isStarted && gameState === GameState.SEQUENCE}
                  ></button>
                </td>
              );
            })}
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default GameArea;
