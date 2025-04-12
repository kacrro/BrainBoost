import React from 'react';
import '../styles/Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            {/* Logo pomijamy - np. <img src="..." alt="logo" /> */}
            <p>© 2025 Brain Boost. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
