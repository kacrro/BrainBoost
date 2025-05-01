import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <Link to="/" className="navbar-brand">
              BrainBoost
            </Link>
            <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
              <li><a href="#games" onClick={toggleMenu} >Games</a></li>
              <li><a href="#creators" onClick={toggleMenu}>Creators</a></li>
              <li><a href="#contact" onClick={toggleMenu}>Contact</a></li>
            </ul>
            <div className="hamburger-menu" onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className={`navbar-right ${isMenuOpen ? 'active' : ''}`}>
            {/*<button className="signin-btn">Sign In</button>   sign in button     */}
            <button
                onClick={() => window.location.href = '/login-register'}
                className="btn btn-moving-gradient btn-moving-gradient--blue"
            >
              register / login
            </button>          </div>
        </div>
      </nav>
  );
};

export default Navbar;