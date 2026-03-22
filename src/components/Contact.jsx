import React from 'react';
import { MessageCircle, MapPin, Clock, Globe } from 'lucide-react';
import Reveal from './Reveal';
import './Contact.css';

const Contact = () => {
  return (
    <section id="contact" className="section contact-section">
      <div className="container contact-container">
        <Reveal delay={0.1}>
          <div className="contact-info">
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1rem' }}>
              Let's <span className="text-gradient">Work Together</span>
            </h2>
            <p className="contact-desc">
              Ready to launch your next project? Have a question? Message me directly on WhatsApp — I respond fast.
            </p>
            
            <div className="info-list">
              <div className="info-item">
                <div className="info-icon"><Globe size={20} /></div>
                <div>
                  <h4>Location</h4>
                  <p>Available Worldwide</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon"><Clock size={20} /></div>
                <div>
                  <h4>Response Time</h4>
                  <p>Within 24 hours</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon"><MessageCircle size={20} /></div>
                <div>
                  <h4>Languages</h4>
                  <p>EN / DE</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
        
        <Reveal delay={0.3}>
          <div className="contact-cta glass">
            <h3>Send a Message</h3>
            <p>Click the button below to start a chat on WhatsApp. I look forward to hearing about your project!</p>
            <a 
              href="https://wa.me/40775139223" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn whatsapp-btn"
            >
              <MessageCircle className="wa-icon" /> Chat on WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;
