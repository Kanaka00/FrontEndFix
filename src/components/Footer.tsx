import { Code2, Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Code2 className="w-8 h-8 text-cyan-500 dark:text-cyan-400" />
              <span className="text-xl font-bold gradient-text">FrontEndFix</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-300">
              Creating exceptional web experiences through modern front-end development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 dark:text-gray-300">UI/UX Design</li>
              <li className="text-gray-600 dark:text-gray-300">Front-End Development</li>
              <li className="text-gray-600 dark:text-gray-300">Responsive Design</li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-bold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="mailto:contact@frontendfix.com"
                className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-300">
          <p>&copy; {currentYear} FrontEndFix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}