import '../../App.css';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import VerbalMemoryGame from "./components/VerbalMemoryGame";
import GameDescription from "./components/GameDescription";
import PopupScreen from "./components/PopupScreen";
import { useState} from "react";

const VerbalMemoryPage = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [replay, setReplay] = useState(false);

  const handleStartGame = () => {
    setPopupVisible(true);
    const gameSection = document.getElementById("Game");
    if (gameSection) {
      gameSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePlay = () => {
    setScore(0);
    setReplay(true);
    setPopupVisible(false);
    setIsStarted(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setIsStarted(false);
    setReplay(false);
  };

  return (
    <div className="App">
      <Navbar />

      <section id="Game">
        {isStarted && (
          <VerbalMemoryGame
            isStarted={isStarted}
            setIsStarted={setIsStarted}
            setScore={setScore}
            setPopupVisible={setPopupVisible}
            score={score}
          />
        )}
      </section>

      <PopupScreen
        score={score}
        popupVisible={popupVisible}
        setIsStarted={setIsStarted}
        setScore={setScore}
        setPopupVisible={setPopupVisible}
        replay={replay}
        setReplay={setReplay}
        onClose={handleClosePopup}
        onPlay={handlePlay}
      />

      <section id="Description">
        <GameDescription onStart={handleStartGame} isStarted={isStarted} />
      </section>

      <Footer />
    </div>
  );
};

export default VerbalMemoryPage;
