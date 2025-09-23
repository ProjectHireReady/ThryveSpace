import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <p className="footer-text">© 2025 ThryveSpace. All rights reserved.</p>
        <ul className="footer-links">
          <li><Link to="/about">About</Link></li>
          <li><Link to="/privacy">Privacy</Link></li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
