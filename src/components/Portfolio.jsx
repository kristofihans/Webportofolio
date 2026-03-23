import React from 'react';
import { ExternalLink } from 'lucide-react';
import Reveal from './Reveal';
import './Portfolio.css';

const projects = [
  { title: "FunIce Presentation", url: "https://kristofihans.github.io/FunIce/" },
  { title: "Birou de Arhitectură", url: "https://kristofihans.github.io/oanagalarhitect/#/" },
  { title: "FotoRapid.ro", url: "https://hanskristofi.github.io/fotorapid2/" }
];

const Portfolio = () => {
  return (
    <section id="portfolio" className="section portfolio-section">
      <div className="container">
        <Reveal delay={0.1}>
          <h2 className="section-title">
            My <span className="text-gradient">Projects</span>
          </h2>
        </Reveal>
        
        <div className="portfolio-grid">
          {projects.map((project, index) => (
            <Reveal key={index} delay={index * 0.2}>
              <div className="portfolio-item">
                <div className="portfolio-header">
                  <h3>{project.title}</h3>
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                    Visit Live <ExternalLink size={16} />
                  </a>
                </div>
                <div className="iframe-wrapper glass">
                  <div className="iframe-container">
                    <iframe 
                      src={project.url} 
                      title={project.title}
                      loading="lazy"
                      sandbox="allow-scripts allow-same-origin"
                    ></iframe>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
