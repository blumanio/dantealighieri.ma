'use client';

import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext'
import { DanteAlighieriLogo } from './SocialIcons';

const Footer = () => {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: t('footer', 'linkAbout'), href: `/${language}/about` },
    { name: t('footer', 'linkUniversities'), href: `/${language}/universities` },
    { name: t('footer', 'linkCourses'), href: `/${language}/` }
  ];

  const socialLinks = [
    { Icon: Facebook, href: 'https://www.facebook.com/etudesenitalie/', label: 'Facebook', color: 'hover:text-primary' },
    { Icon: Instagram, href: 'https://www.instagram.com/studentitaly.it', label: 'Instagram', color: 'hover:text-secondary' },
    { Icon: Linkedin, href: 'https://www.linkedin.com/in/mohamedelaammari/', label: 'LinkedIn', color: 'hover:text-primary' },
    { Icon: MessageCircle, href: '#', label: 'WhatsApp', color: 'hover:text-secondary' },
    { Icon: Youtube, href: '#', label: 'YouTube', color: 'hover:text-primary' }
  ];

  const orderedSocialLinks = isRTL ? [...socialLinks].reverse() : socialLinks;

  return (
    <footer 
      className="relative bg-white mt-12 border-t border-neutral-200" 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10"></div>

      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and Description */}
          <div className="text-center sm:text-start">
            <Link href={`/${language}`} className="inline-block group" aria-label="Home">
              <DanteAlighieriLogo 
                className="h-20 w-auto text-primary transition-transform duration-300 
                          group-hover:scale-105" 
                aria-hidden="true" 
              />
            </Link>
            <p className="mt-4 text-sm text-textSecondary">
              {t('footer', 'description')}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="text-center sm:text-start">
            <h3 className="font-heading text-lg font-semibold text-primary mb-4">
              {t('footer', 'quickLinks')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-textSecondary hover:text-primary transition-colors duration-300
                             inline-block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="text-center sm:text-start">
            <h3 className="font-heading text-lg font-semibold text-primary mb-4">
              {t('footer', 'contactUs')}
            </h3>
            <div className="space-y-3 text-sm text-textSecondary">
              <p className="hover:text-primary transition-colors duration-300 cursor-pointer">
                {t('footer', 'email')}
              </p>
              <p className="hover:text-primary transition-colors duration-300 cursor-pointer">
                {t('footer', 'phone')}
              </p>
              <p className="hover:text-primary transition-colors duration-300 cursor-pointer">
                {t('footer', 'location')}
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="text-center sm:text-start">
            <h3 className="font-heading text-lg font-semibold text-primary mb-4">
              {t('footer', 'followUs')}
            </h3>
            <div className="flex items-center justify-center sm:justify-start gap-4">
              {orderedSocialLinks.map(({ Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-textSecondary ${color} transition-all duration-300 
                            hover:scale-110 hover:shadow-soft`}
                  aria-label={label}
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-neutral-200">
          <p className="text-center text-sm text-textSecondary">
            © {currentYear} {t('footer', 'copyright')}
          </p>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 opacity-50"></div>
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10 opacity-50"></div>
    </footer>
  );
};

export default Footer;