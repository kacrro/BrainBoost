import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { MainPage } from './Pages/MainPage/MainPage';
import { AimTrainerPage } from './Pages/AimTrainer/AimTrainerPage';
import SequenceMemoryPage from "./Pages/SequenceMemory/SequenceMemoryPage";
import VerbalMemoryPage from "./Pages/VerbalMemory/VerbalMemoryPage";
import NumberMemoryPage from "./Pages/NumberMemory/NumberMemoryPage";
import {ReactionTimePage} from './Pages/ReactionTime/ReactionTimePage';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/game/aim-trainer" element={<AimTrainerPage/>} />
            <Route path="/game/sequence-memory" element={<SequenceMemoryPage />} />
            <Route path="/game/verbal-memory" element={<VerbalMemoryPage />} />
            <Route path="/game/number-memory" element={<NumberMemoryPage />} />
            <Route path="/game/ReactionTime" element={<ReactionTimePage/>}/>
            </Routes>
        </Router>
    );
};

export default App;
