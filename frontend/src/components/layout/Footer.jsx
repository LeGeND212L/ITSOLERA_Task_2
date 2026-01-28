import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';
import logo from '../../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-dark-900 border-t border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <img 
                src={logo} 
                alt="Apex Booking" 
                className="w-10 h-10 rounded-lg transition-transform group-hover:scale-110" 
              />
              <span className="text-xl font-bold gradient-text group-hover:text-cyber-400 transition-colors">Apex Booking</span>
            </Link>
            <p className="text-dark-400 mb-4 max-w-md">
              Apex Booking - Smart Service Booking & Management System. Connecting customers with professional service providers for seamless booking experiences.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-dark-400 hover:text-cyber-400 transition-all hover:scale-110">
                <FiGithub className="w-5 h-5" />
              </a>
              <a href="#" className="text-dark-400 hover:text-cyber-400 transition-all hover:scale-110">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-dark-400 hover:text-cyber-400 transition-all hover:scale-110">
                <FiLinkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-dark-400 hover:text-cyber-400 transition-all hover:scale-110">
                <FiMail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-dark-400 hover:text-cyber-400 transition-all hover:translate-x-1 inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-dark-400 hover:text-cyber-400 transition-all hover:translate-x-1 inline-block">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-dark-400 hover:text-cyber-400 transition-all hover:translate-x-1 inline-block">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-dark-400 hover:text-cyber-400 transition-all hover:translate-x-1 inline-block">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-dark-400 hover:text-cyber-400 transition-all hover:translate-x-1 inline-block">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-dark-400 hover:text-cyber-400 transition-all hover:translate-x-1 inline-block">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-dark-800 text-center text-dark-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Apex Booking. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
