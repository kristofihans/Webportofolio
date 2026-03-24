import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Show navbar BG only after the hero frame animation has fully played
    const onDone   = () => setIsScrolled(true);
    const onActive = () => setIsScrolled(false);

    window.addEventListener('heroAnimationDone',   onDone);
    window.addEventListener('heroAnimationActive', onActive);

    // Fallback: if user loads page mid-scroll (e.g. refresh), check immediately
    const hero = document.getElementById('hero');
    if (hero) {
      const scrollMax = hero.offsetHeight - window.innerHeight;
      if (scrollMax > 0 && window.scrollY >= scrollMax) setIsScrolled(true);
    } else if (window.scrollY > 50) {
      setIsScrolled(true);
    }

    return () => {
      window.removeEventListener('heroAnimationDone',   onDone);
      window.removeEventListener('heroAnimationActive', onActive);
    };
  }, []);

  return (
    <header className={`header ${isScrolled ? 'glass' : 'transparent'}`}>
      <div className="container navbar">
        <div className="logo">
          <a href="#">Hans<span className="text-gradient">.dev</span></a>
        </div>
        
        <nav className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li><a href="#hero" onClick={() => setIsMobileMenuOpen(false)}>About</a></li>
            <li><a href="#services" onClick={() => setIsMobileMenuOpen(false)}>Services</a></li>
            <li><a href="#portfolio" onClick={() => setIsMobileMenuOpen(false)}>My Projects</a></li>
            <li><a href="#contact" className="btn btn-primary nav-btn" onClick={() => setIsMobileMenuOpen(false)}>Contact Me</a></li>
          </ul>
        </nav>

        <div className="hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
