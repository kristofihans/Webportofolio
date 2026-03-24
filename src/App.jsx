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

  return (
    <div className="app">
      {isLoading && <Loader finishLoading={() => setIsLoading(false)} />}
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
