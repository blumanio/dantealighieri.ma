import { FaGithub, FaYoutube, FaStackOverflow } from 'react-icons/fa'
import Link from 'next/link'
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  LinkedInIcon,
  WhatsAppIcon,
  TikTokIcon,
  DanteAlighieriLogo
} from './SocialIcons.js'
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/solid'

const socialLinks = [
  {
    icon: <FaGithub />,
    path: 'https://github.com/amgoun'
  },
  {
    icon: <FaYoutube />,
    path: 'https://www.youtube.com/channel/UCbsnQ_ADchMvoOYgbrPsfFw'
  },
  {
    icon: <FaStackOverflow />,
    path: 'https://stackoverflow.com/users/8044017/amgoun'
  }
]
const Social = () => {
  return (
    <div className='flex gap-6'>
      <div className='flex flex-col items-center space-y-2 md:flex-row md:space-x-4 md:space-y-0'>
        {/*<a
          href='mailto:elaammari.consulting@gmail.com'
          className='flex items-center font-sans'
          >
          <EnvelopeIcon className='mr-1 h-4 w-4' />
          <span>elaammari.consulting@gmail.com</span>
          </a>*/}
        <div className='mt-2 flex space-x-4 md:mt-0'>
          <a href='tel:+39 351 900 0615' className='flex items-center font-sans'>
            <WhatsAppIcon className=' h-5 w-5' />
            
          </a>
              <a
                href='https://www.linkedin.com/in/mohamedelaammari/'
                target='_blank'
                rel='noopener noreferrer'
              >
                <LinkedInIcon className='h-5 w-5' />
              </a>
              <a
                href='https://www.facebook.com/groups/etudesenitalie'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FacebookIcon className='h-5 w-5' />
              </a>
              <a
                href='https://www.instagram.com/studentitaly.it'
                target='_blank'
                rel='noopener noreferrer'
              >
                <InstagramIcon className='h-5 w-5' />
              </a>
              <a
                href='https://www.tiktok.com/@studentitaly.it'
                target='_blank'
                rel='noopener noreferrer'
              >
                <TikTokIcon className='h-5 w-5' />
              </a>
              {/* <a
              href='https://youtube.com'
              target='_blank'
              rel='noopener noreferrer'
            >
              <YoutubeIcon className='h-5 w-5' />
            </a>
            <a
              href='https://tiktok.com'
              target='_blank'
              rel='noopener noreferrer'
            >
              <TiktokIcon className='h-5 w-5' />
            </a> */}
            </div>
      </div>
    </div>
  )
}

export default Social
