import React from 'react';
import { Monitor, Search, Zap, Wrench, Shield, Smartphone } from 'lucide-react';
import Reveal from './Reveal';
import './Services.css';

const servicesData = [
  {
    icon: <Monitor className="service-icon" />,
    title: 'Website Design & Development',
    description: 'Custom-built websites tailored to your brand. From sleek landing pages to full multi-page business sites — responsive, fast, and built to convert.',
    price: 'From €500'
  },
  {
    icon: <Search className="service-icon" />,
    title: 'SEO Optimization',
    description: "Get found on Google. I optimize your site's structure, content, and speed so you rank higher and attract more organic traffic.",
    price: 'From €300'
  },
  {
    icon: <Zap className="service-icon" />,
    title: 'Performance Optimization',
    description: 'Slow websites lose customers. I audit and optimize load times, image compression, and caching for a lightning-fast user experience.',
    price: 'From €150'
  },
  {
    icon: <Wrench className="service-icon" />,
    title: 'Website Maintenance',
    description: "Keep your site fresh and secure. Monthly content updates, plugin management, backups, and uptime monitoring — I've got you covered.",
    price: 'From €100/month'
  },
  {
    icon: <Shield className="service-icon" />,
    title: 'Security & Hosting Setup',
    description: 'SSL certificates, secure hosting configuration, domain setup, and firewall protection. Your website, safe and always online.',
    price: 'From €100'
  },
  {
    icon: <Smartphone className="service-icon" />,
    title: 'Landing Pages',
    description: 'High-converting single-page experiences for campaigns, product launches, or lead generation. Optimized for mobile and designed to impress.',
    price: 'From €300'
  }
];

const Services = () => {
  return (
    <section id="services" className="section services-section">
      <div className="container">
        <Reveal delay={0.1}>
          <h2 className="section-title">
            My <span className="text-gradient">Services</span>
          </h2>
        </Reveal>
        
        <div className="services-grid">
          {servicesData.map((service, index) => (
            <Reveal key={index} delay={index * 0.1}>
              <div className="service-card glass">
                <div className="service-icon-wrapper">
                  {service.icon}
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.description}</p>
                <div className="service-price">
                  <span>{service.price}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
