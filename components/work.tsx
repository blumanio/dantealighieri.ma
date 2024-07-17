import { projectsData } from '@/lib/data'
import React from 'react'

const Blog = () => {
  return (
    <section id='blog' className='bg-teal-600'>
      <div className='containerBlog w-full py-[100px] lg:py-[200px]'>
        <h1 className='mt-8 px-2 py-4 text-[40px] font-bold uppercase leading-[3rem] md:px-0'>
          recent
          <br />
          <span className='under-line'>articles</span>
        </h1>
        <div className='grid grid-cols-1 gap-[50px] py-4 md:grid-cols-2 lg:grid-cols-3'>
          {projectsData.map((article, i) => (
            <div
              key={i}
              className='transform rounded-lg bg-white p-6 shadow-lg transition-transform duration-300 hover:scale-105'
            >
              <h2 className='text-xl font-bold'>{article.title}</h2>
              <p className='mt-4'>{article.description}</p>
              <a
                href={article.link}
                className='mt-4 inline-block text-teal-600'
              >
                Read more
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Blog
