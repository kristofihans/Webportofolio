import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(0); // Set to 0 by default, JS reveals it later

  useEffect(() => {
    // Show navbar BG only after the hero frame animation has fully played
    const onDone   = () => setIsScrolled(true);
    const onActive = () => setIsScrolled(false);
    
    // Sync content opacity with hero progress (50%–70% window)
    const onProgress = (e) => {
      const p = e.detail.progress;
      const opacity = Math.max(0, Math.min(1, (p - 0.50) / 0.20));
      setContentOpacity(opacity);
    };

    window.addEventListener('heroAnimationDone',   onDone);
    window.addEventListener('heroAnimationActive', onActive);
    window.addEventListener('heroScrollProgress',  onProgress);

    // Initial check for content opacity if hero exists
    const hero = document.getElementById('hero');
    if (hero) {
      const scrollMax = hero.offsetHeight - window.innerHeight;
      const progress  = Math.min(Math.max(window.scrollY / scrollMax, 0), 1);
      setContentOpacity(Math.max(0, Math.min(1, (progress - 0.50) / 0.20)));
      
      if (scrollMax > 0 && window.scrollY >= scrollMax) setIsScrolled(true);
    } else {
      setIsScrolled(window.scrollY > 50);
      setContentOpacity(1);
    }

    return () => {
      window.removeEventListener('heroAnimationDone',   onDone);
      window.removeEventListener('heroAnimationActive', onActive);
      window.removeEventListener('heroScrollProgress',  onProgress);
    };
  }, []);

  return (
    <header className={`header ${isScrolled ? 'glass' : 'transparent'}`}>
      <div className="container navbar" style={{ opacity: contentOpacity }}>
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
