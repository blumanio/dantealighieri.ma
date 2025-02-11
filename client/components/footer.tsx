import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube, MessageCircle, Music2 } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'About', href: '/about' },
    { name: 'Universities', href: '/services' },
    { name: 'Courses', href: '/' }
  ];

  const socialLinks = [
    { Icon: Facebook, href: 'https://www.facebook.com/etudesenitalie/', label: 'Facebook' },
    { Icon: Instagram, href: 'https://www.instagram.com/dantealighieri.ma/', label: 'Instagram' },
    { Icon: Linkedin, href: 'https://www.linkedin.com/in/mohamedelaammari/', label: 'LinkedIn' },
    { Icon: MessageCircle, href: '#', label: 'WhatsApp' },
    { Icon: Youtube, href: '#', label: 'YouTube'  }
  ];

  return (
    <footer className="bg-white shadow-md mt-12 pt-5">
      <div className="container mx-auto px-4 py-8">
        {/* Mobile Layout */}
        <div className="space-y-8 md:space-y-0 md:flex md:justify-between">
          {/* Logo and Description */}
          <div className="text-center md:text-left md:max-w-xs">
            <a href="/" className="inline-block">
              <span className="text-2xl font-bold text-teal-700">DanteMa</span>
            </a>
            <p className="mt-4 text-sm text-gray-600">
              Your trusted partner in navigating Italian university admissions and education opportunities.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="text-center md:text-left">
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-gray-600 hover:text-teal-600 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="text-center md:text-left">
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>Email: contact@dantealighieri.com</p>
              <p>Phone: +39 123 456 789</p>
              <p>Location: Milan, Italy</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="text-center md:text-left">
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
        © {currentYear} Made with a lot of ☕️ and ❤️ in Milan 🇮🇹
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;