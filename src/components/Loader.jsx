import React, { useEffect, useState } from 'react';
import './Loader.css';

const Loader = ({ finishLoading }) => {
  const fullText = "hans.dev".split('');
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setIsFading(true), 1500);
    const timer2 = setTimeout(() => finishLoading(), 2100); 

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [finishLoading]);

  return (
    <div className={`loader-container ${isFading ? 'fade-out' : ''}`}>
      <div className="loader-text">
        {fullText.map((char, index) => (
          <span 
            key={index}
            className="smooth-char"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Loader;
