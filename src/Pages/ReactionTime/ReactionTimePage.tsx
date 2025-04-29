// src/pages/ReflexPage.tsx
import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ReflexContainer from './Components/ReflexContainer';
import '../ReactionTime/styles/Reflex.css';

export const ReactionTimePage: React.FC = () => {
    return (
        <div className="App">
            <Navbar/>
            <section id="Game">
                <ReflexContainer/>
            </section>
            <Footer/>
        </div>
    );
};