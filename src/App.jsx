import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ScrollVideoHero from './components/ScrollVideoHero';
import ChatbotSection from './components/ChatbotSection';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Loader from './components/Loader';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [framesLoaded, setFramesLoaded] = useState(0);

  // Expose progress function for ScrollVideoHero
  window.onHeroFrameProgress = (count) => {
    setFramesLoaded(count);
  };

  const handleFinishLoading = () => {
    // Only allow finishing if at least 50 frames are loaded
    if (framesLoaded >= 50) {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      {isLoading && <Loader finishLoading={handleFinishLoading} readyToFinish={framesLoaded >= 50} />}
      <Navbar />
      <main>
        <ScrollVideoHero />
        <ChatbotSection />
        <Services />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
