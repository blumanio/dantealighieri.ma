// client/components/FAQ.tsx (or wherever this component resides)
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion' // Removed 'animate' as it's not directly used here

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import FadeIn from '@/lib/variants' // Assuming FadeIn is correctly defined elsewhere

import { askedQuestions } from '@/lib/data' // This will now import from your updated data.ts

const slideVariant = {
  initial: {
    x: 0
  },
  animate: {
    x: '-135%', // Adjust this percentage based on the number of logos and their widths if needed
    transition: {
      repeat: Infinity,
      duration: 20,
      ease: 'linear' // Added for smoother animation
    }
  }
}



const FAQ = () => {
  return (
    <section className='pb-20 pt-36' id='FAQ'>
      <div className='container sm:px-2'>
        <div>
          <h1 className='text-[40px] font-bold uppercase leading-[3rem]'>
            Frequently <br /> <span className='under-line'>asked</span>
          </h1>
        </div>
        <motion.div
          variants={FadeIn('up', 0.2)}
          initial='hidden'
          whileInView={'show'}
          viewport={{ once: true, amount: 0.8 }} // Changed amount to 0.8 for potentially better trigger
        >
          <div className='mx-auto mt-12 flex max-w-3xl flex-col justify-center rounded-md bg-teal-600 py-8 sm:px-2 xl:py-4'>
            {askedQuestions.map(qst => (
              <Accordion
                type='single'
                collapsible
                className='w-full text-left text-white' // Added text-white for better contrast on teal-600
                key={qst.id}
              >
                <AccordionItem value={`item-${qst.id}`} className="border-b-teal-500"> {/* Use unique value for each item and adjust border*/}
                  <AccordionTrigger className='mx-2 text-xl font-medium hover:no-underline'>
                    {qst.qs}
                  </AccordionTrigger>
                  <AccordionContent className='px-2 pt-4 text-[16px] leading-6 text-teal-100'> {/* Lighter text for answer */}
                    {qst.answer}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </motion.div>
      </div>
      <div className='mt-36 flex w-full items-center justify-center overflow-hidden py-4'>
        {/* Added w-full and items-center to the parent of sliding logos for better centering */}
        <div className='flex w-full max-w-[1200px] items-center justify-center'>
          <div className='absolute left-0 z-10 h-full w-[50px] bg-gradient-to-r from-background to-transparent sm:w-[100px] md:w-[150px]' /> {/* Changed gradient to use theme background */}
          <motion.div
            variants={slideVariant}
            initial='initial'
            animate='animate'
            className='flex space-x-12' // Ensure tech logos are visible against the background
          >

          </motion.div>
          <div className='absolute right-0 z-10 h-full w-[50px] bg-gradient-to-l from-background to-transparent sm:w-[100px] md:w-[150px]' /> {/* Changed gradient */}
        </div>
      </div>
    </section>
  )
}
export default FAQ