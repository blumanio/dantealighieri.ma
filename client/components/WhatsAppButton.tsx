'use client'

import React from 'react';
import {
  WhatsAppIcon,
} from './SocialIcons.js'
const WhatsAppButton = () => {
  const handleClick = () => {
    window.open('https://wa.me/393519000615', '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition-colors "
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </button>
  );
};

export default WhatsAppButton;