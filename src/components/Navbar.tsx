import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import '../styles/Navbar.css';
import {useAuth} from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const { userEmail, setUserEmail, userName } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (sectionId: string) => {
    setIsMenuOpen(false);
    navigate("/", { state: { scrollTo: sectionId } });
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            BrainBoost
          </Link>
          <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
            <li><a href="#games" onClick={() => handleNavigation("games")}>Games</a></li>
            <li><a href="#creators" onClick={() => handleNavigation("creators")}>Creators</a></li>
            <li><a href="#contact" onClick={() => handleNavigation("contact")}>Contact</a></li>
          </ul>
          <div className="hamburger-menu" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className={`navbar-right ${isMenuOpen ? 'active' : ''}`}>
          {/*<button className="signin-btn">Sign In</button>   sign in button     */}
          {userEmail ? (
            <div className="logged-in-container">
              <span>Logged in as {userName || userEmail}</span>
              <button
                onClick={() => {
                  setUserEmail(null);
                  window.location.href = '/';
                }}
                className="btn btn-moving-gradient btn-moving-gradient--blue"
              >
                logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => window.location.href = '/login-register'}
              className="btn btn-moving-gradient btn-moving-gradient--blue"
            >
              register / login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;