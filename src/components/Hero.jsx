import React from 'react';
import Reveal from './Reveal';
import meImg from '../assets/me.jpeg';
import './Hero.css';

const Hero = () => {
  return (
    <section id="hero" className="hero-section">
      <div className="container hero-container">
        <Reveal delay={0.2}>
          <div className="hero-content">
            <p className="greeting">Hello, I'm</p>
            <h1 className="hero-title">Hans</h1>
            <p className="hero-desc">
              I'm a passionate web developer dedicated to building powerful digital experiences. With a deep love for technology and clean code, I design and develop websites that don't just look great — they drive real results for your business. Let's transform your ideas into a cutting-edge online presence.
            </p>
            
            <div className="hero-stats">
              <div className="stat glass">
                <h3>10+</h3>
                <p>Projects Built</p>
              </div>
              <div className="stat glass">
                <h3>100%</h3>
                <p>Client Satisfaction</p>
              </div>
              <div className="stat glass">
                <h3>24h</h3>
                <p>Response Time</p>
              </div>
            </div>
            
            <div className="hero-actions">
              <a href="#portfolio" className="btn btn-primary">See My Work</a>
              <a href="#contact" className="btn btn-outline">Let's Talk</a>
            </div>
          </div>
        </Reveal>
        
        <Reveal delay={0.4}>
          <div className="hero-image-wrapper">
            <div className="image-decorator glass"></div>
            <img src={meImg} alt="Hans" className="hero-image" />
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Hero;
