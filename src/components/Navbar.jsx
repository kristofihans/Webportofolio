import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      setIsScrolled(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (window.scrollY === 0) {
          setIsScrolled(false);
        } else {
          setIsScrolled(true);
        }
      }, 1500); // Wait after scrolling stops to hide? No, simple scroll > 0 is better.
    };
    // Let's just do > 50px
    const handleSimpleScroll = () => setIsScrolled(window.scrollY > 50);
    
    window.addEventListener('scroll', handleSimpleScroll);
    return () => window.removeEventListener('scroll', handleSimpleScroll);
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
