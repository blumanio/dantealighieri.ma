import { FaGithub, FaYoutube, FaStackOverflow } from 'react-icons/fa'
import Link from 'next/link'
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  TiktokIcon,
  WhatsAppIcon
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
        <a href='tel:+39 351 900 0615' className='flex items-center font-sans'>
          <WhatsAppIcon className='mr-1 h-4 w-4' />
          <span>+39 351 900 0615</span>
        </a>
        {/*<a
          href='mailto:elaammari.consulting@gmail.com'
          className='flex items-center font-sans'
        >
          <EnvelopeIcon className='mr-1 h-4 w-4' />
          <span>elaammari.consulting@gmail.com</span>
        </a>*/}
      </div>
    </div>
  )
}

export default Social
