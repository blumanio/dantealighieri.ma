import Link from 'next/link'
import Photo from '@/components/photo'

const Hero = () => {
  return (
    <section className='w-full bg-slate-50 pt-20'>
      <div className='container mx-auto h-full px-4'>
        <div className='flex flex-col items-center justify-between gap-10 xl:flex-row xl:pt-8'>
          {/* text */}
          <div className='relative z-10 max-w-xl text-left'>
            <h1 className='mb-4 text-[36px] font-bold leading-tight text-slate-800 md:text-[48px]'>
              Your Journey To Italy Begins Here
            </h1>
            <p className='mb-6 text-base text-slate-600 md:text-lg'>
              We equip our students with the right tools needed in a competitive
              job market.
            </p>
            {/*<Link
              href='/consultation'
              className='mb-8 inline-block rounded-md bg-teal-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-teal-700 md:text-lg'
            >
              Get a Consultation
            </Link>*/}
            <ul className='space-y-2 text-slate-700'>
              <li className='flex items-center'>
                <svg
                  className='mr-2 h-5 w-5 text-teal-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'></path>
                </svg>
                <span className='marker-highlight-green'>
                  Career Consulting
                </span>
              </li>
              <li className='flex items-center'>
                <svg
                  className='mr-2 h-5 w-5 text-teal-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'></path>
                </svg>
                <span className='marker-highlight-white'>
                  College Admissions
                </span>
              </li>
              <li className='flex items-center'>
                <svg
                  className='mr-2 h-5 w-5 text-teal-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'></path>
                </svg>
                <span className='marker-highlight-red'>
                  Scholarship Support
                </span>
              </li>
            </ul>
          </div>
          {/* image and quote */}
          <div className='relative z-0 w-full max-w-md lg:max-w-lg'>
            <Photo />
            <div className='signature absolute bottom-0 right-0 z-50 max-w-sm bg-white p-4 shadow-lg'>
              <p className='mb-2 text-sm text-slate-600'>
                Helping students since 2016.
              </p>
              <p className='font-bold text-slate-800'>Mohamed El Aammari</p>
              <p className='text-sm text-slate-600'>
                Founder at DanteAlighieri.ma
              </p>
              {/* <img src='/signature.png' alt='Signature' className='mt-2 h-8' /> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
