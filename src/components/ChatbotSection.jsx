import React from 'react';
import Reveal from './Reveal';
import Chatbot from './Chatbot';
import './ChatbotSection.css';

const ChatbotSection = () => {
  return (
    <section id="chatbot" className="chatbot-section section">
      <div className="container chatbot-section-inner">
        <Reveal>
          <h2 className="section-title chatbot-section-title">Ask Me Anything</h2>
          <p className="chatbot-section-subtitle">
            Curious about Hans? Ask this AI assistant anything — hobbies, studies, family and more.
          </p>
        </Reveal>
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
