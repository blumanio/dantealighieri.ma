import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, MessageSquare } from 'lucide-react';

{/*{ icon: Twitter, href: '#', color: '#1DA1F2', hoverBg: 'hover:bg-[#1DA1F2]' },*/}
export default function SocialmediLeft() {
  const socials = [
    { icon: Facebook, href: '#', color: '#1877F2', hoverBg: 'hover:bg-[#1877F2]' },
    { icon: Instagram, href: '#', color: '#E4405F', hoverBg: 'hover:bg-[#E4405F]' },
    { icon: Linkedin, href: '#', color: '#0A66C2', hoverBg: 'hover:bg-[#0A66C2]' },
    { icon: Youtube, href: '#', color: '#FF0000', hoverBg: 'hover:bg-[#FF0000]' },
    { icon: MessageSquare, href: 'https://wa.me/393519000615', color: '#25D366', hoverBg: 'hover:bg-[#25D366]' }
  ];

  return (
    <div className="w-full h-96 bg-gray-10 relative overflow-hidden rounded-lg">
      <div className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50  backdrop-blur-sm p-2 rounded-full shadow-lg">
        {socials.map((social, index) => {
          const Icon = social.icon;
          return (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full shadow-md transition-all duration-300 hover:scale-110 hover:shadow-xl group"
              aria-label={`Visit our ${social.icon.name}`}
            >
              <Icon 
                className="w-4 h-4 group-hover:text-white transition-colors duration-300" 
                style={{ color: social.color }}
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}