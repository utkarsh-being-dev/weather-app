
import React from 'react';
import './Footer.css'; // Import the CSS file for the footer styles

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer-text">
        Currently, locations are very limited due to lack of data sets. It will be updated soon.
        <br />
        <span className="footer-mention">@utkarsh-being-dev</span>
      </p>
    </footer>
  );
};

export default Footer;