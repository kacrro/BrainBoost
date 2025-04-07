import React from 'react';
import Navbar from '../../components/MainPage/Navbar';
import GamesSection from '../../components/MainPage/GamesSection';
import CreatorsSection from '../../components/MainPage/CreatorsSection';
import ContactForm from '../../components/MainPage/ContactForm';
import Footer from '../../components/MainPage/Footer';

import '../../App.css';

export const Main_Page: React.FC = () => {
    return (
        <div className="App">
            <Navbar />

            {/* Sekcja gier */}
            <section id="games">
                <GamesSection />
            </section>

            {/* Sekcja twórców */}
            <section id="creators">
                <CreatorsSection />
            </section>

            {/* Sekcja kontaktowa (ankieta) */}
            <section id="contact">
                <ContactForm />
            </section>

            {/* Stopka */}
            <Footer />
        </div>
    );
};