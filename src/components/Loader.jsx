import React, { useEffect, useState } from 'react';
import './Loader.css';

const Loader = ({ finishLoading, readyToFinish }) => {
  const fullText = "hans.dev".split('');
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Initial intro animation lasts at least 1.5s
    const minDurTimer = setTimeout(() => {
      // Once intro is done AND frames are ready, start fading
      if (readyToFinish) {
        setIsFading(true);
        setTimeout(() => finishLoading(), 600);
      }
    }, 1500);

    return () => clearTimeout(minDurTimer);
  }, [readyToFinish, finishLoading]);

  // Keep checking if frames become ready after the 1.5s mark
  useEffect(() => {
    if (readyToFinish && !isFading) {
      // Small delay for smooth transition
      const timer = setTimeout(() => {
        setIsFading(true);
        setTimeout(() => finishLoading(), 600);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [readyToFinish, isFading, finishLoading]);

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
