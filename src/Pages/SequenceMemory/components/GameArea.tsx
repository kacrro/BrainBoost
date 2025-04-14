import '../../../styles/GameArea.css'
import {useState} from "react";

interface Square {
  id: number;
  isHighlighted: boolean;
}

const GameArea = () => {
  const [highlightedSquare, setHighlightedSquare] = useState<number>(
    Math.floor(Math.random() * 9)
  );
  
  const squares: Square[] = Array.from({ length: 9 }, (_, index) => ({
    id: index,
    isHighlighted: index === highlightedSquare,
  }));
  
  return (
    <div className="game-area">
      <table className="square-grid">
        <tbody>
          {squares.map((_, index) => (
            <tr key={Math.floor(index / 3)}>
              {squares.slice(index, index + 3).map((s) => (
                <td key={s.id} className="square">
                  <button
                    className={`square-button ${s.isHighlighted ? 'highlighted' : ''}`}
                  ></button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GameArea;
