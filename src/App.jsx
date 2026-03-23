import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Loader from './components/Loader';
import videoBg from './assets/videobackground.mp4';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="app">
      <video autoPlay loop muted playsInline className="video-background">
        <source src={videoBg} type="video/mp4" />
      </video>
      <div className="video-overlay"></div>
      
      {isLoading && <Loader finishLoading={() => setIsLoading(false)} />}
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
