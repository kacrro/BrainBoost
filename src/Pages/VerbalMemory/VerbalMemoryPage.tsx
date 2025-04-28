import '../../App.css';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import VerbalMemoryGame from "./components/VerbalMemoryGame";
import GameDescription from "./components/GameDescription";
import { useState } from "react";

const VerbalMemoryPage = () => {
  const [startGame, setStartGame] = useState(false);

  const handleStart = () => {
    setStartGame(true);

    const gameSection = document.getElementById("Game");
    if (gameSection) {
      gameSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="App">
      <Navbar/>

      <section id="Game">
        {startGame && <VerbalMemoryGame />}
      </section>

      <section id="Description">
        <GameDescription onStart={handleStart} />
      </section>

      <Footer/>
    </div>
  );
};

export default VerbalMemoryPage;
