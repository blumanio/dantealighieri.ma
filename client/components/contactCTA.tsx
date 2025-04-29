import React from 'react';
import Link from 'next/link';

const ContactCTA = ({
  title = 'Contact Us Today',
  buttonText = 'Book a  Consultation',
  link = 'https://calendly.com/dantema/dante-alighieri-consulting',
}) => {
  return (
    <div className='mt-20 text-center'>
      <h3 className='mb-4 text-2xl font-bold text-textPrimary hover:text-primary transition-colors duration-300'>
        {title}
      </h3>
      <div className='flex justify-center space-x-4'>
        <a 
          href={link} 
          target='_blank' 
          rel='noopener noreferrer'
          onClick={() => {
            window.gtag?.('event', 'click', {
              event_category: 'CTA',
              event_label: 'Calendly Booking',
              value: 1,
            });
          }}
          className="inline-block bg-primary text-white px-8 py-4 rounded-full hover:bg-secondary hover:scale-105 hover:shadow-medium transform transition-all duration-300 shadow-soft"
        >
          {buttonText}
        </a>
      </div>
    </div>
  );
};

export default ContactCTA;
