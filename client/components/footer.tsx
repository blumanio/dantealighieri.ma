'use client';

import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '../app/[lang]/LanguageContext';
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
    { Icon: Facebook, href: 'https://www.facebook.com/etudesenitalie/', label: 'Facebook' },
    { Icon: Instagram, href: 'https://www.instagram.com/dantealighieri.ma/', label: 'Instagram' },
    { Icon: Linkedin, href: 'https://www.linkedin.com/in/mohamedelaammari/', label: 'LinkedIn' },
    { Icon: MessageCircle, href: '#', label: 'WhatsApp' },
    { Icon: Youtube, href: '#', label: 'YouTube' }
  ];

  // Reverse the order of social links for RTL
  const orderedSocialLinks = isRTL ? [...socialLinks].reverse() : socialLinks;

  return (
    <footer className="bg-white shadow-md mt-12 pt-5" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8 md:space-y-0 md:flex md:flex-row-reverse md:justify-between">
          {/* Logo and Description */}
          <div className="md:max-w-xs">
            <Link href={`/${language}`} className="inline-block" aria-label="Home">
              <DanteAlighieriLogo className="h-24 w-auto text-gray-900 mx-auto md:mx-0" aria-hidden="true" />
            </Link>
            <p className="mt-4 text-sm text-gray-600 text-center md:text-right">
              {t('footer', 'description')}
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4 text-center md:text-right">
              {t('footer', 'quickLinks')}
            </h3>
            <ul className="space-y-3 text-center md:text-right">
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
          <div>
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4 text-center md:text-right">
              {t('footer', 'contactUs')}
            </h3>
            <div className="space-y-3 text-sm text-gray-600 text-center md:text-right">
              <p>{t('footer', 'email')}</p>
              <p>{t('footer', 'phone')}</p>
              <p>{t('footer', 'location')}</p>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4 text-center md:text-right">
              {t('footer', 'followUs')}
            </h3>
            <div className="flex items-center justify-center md:justify-end gap-4">
              {orderedSocialLinks.map(({ Icon, href, label }) => (
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
            © {currentYear} {t('footer', 'copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;