import React from 'react';
import Reveal from './Reveal';
import Chatbot from './Chatbot';
import meImg from '../assets/me.jpg';
import './ChatbotSection.css';

const ChatbotSection = () => {
  return (
    <section id="chatbot" className="chatbot-section section">
      <div className="container chatbot-section-inner">
        {/* Photo + intro row */}
        <Reveal>
          <div className="chatbot-intro-row">
            <img src={meImg} alt="Hans" className="chatbot-profile-img" />
            <div className="chatbot-intro-text">
              <h2 className="section-title chatbot-section-title">Ask Me Anything</h2>
              <p className="chatbot-section-subtitle">
                Curious about Hans? Ask this AI assistant about his background, work experience,
                education, skills, hobbies, and more.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Chatbot */}
        <Reveal delay={0.2}>
          <div className="chatbot-center">
            <Chatbot />
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default ChatbotSection;
