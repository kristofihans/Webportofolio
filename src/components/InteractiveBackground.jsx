import React, { useEffect, useRef } from 'react';
import './InteractiveBackground.css';

const InteractiveBackground = () => {
  const blobRef = useRef(null);

  useEffect(() => {
    const handlePointerMove = (e) => {
      const { clientX, clientY } = e;
      if (blobRef.current) {
        blobRef.current.animate({
          left: `${clientX}px`,
          top: `${clientY}px`
        }, { duration: 3000, fill: "forwards" });
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <div className="interactive-bg">
      <div id="blob" ref={blobRef}></div>
    </div>
  );
};

export default InteractiveBackground;
