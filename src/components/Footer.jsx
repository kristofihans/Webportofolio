import React from 'react';

const Footer = () => {
  return (
    <footer style={{ padding: '2rem 0', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', backgroundColor: 'transparent' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        &copy; {new Date().getFullYear()} Hans. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
