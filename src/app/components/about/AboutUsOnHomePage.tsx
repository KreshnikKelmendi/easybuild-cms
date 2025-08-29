'use client'

import React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'


const AboutUsOnHomePage = () => {
  const { t } = useTranslation()

  const handleScrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      <div className='bg-[#DD4624] h-fit lg:h-[120ch] rounded-[15px] relative'>
          <div className='flex flex-col lg:flex-row px-5 lg:px-[60px] py-16 2xl:px-[120px] lg:py-36'>
              <div className='w-full lg:w-1/2'>
              <Image 
                src="/assets/IMG_3865.jpg" 
                alt='About us image' 
                width={600}
                height={400}
                className='w-full h-full object-cover rounded-[15px]' 
              />
              </div>

              <div className='w-full lg:w-1/2 flex flex-col lg:justify-center mt-12 lg:mt-0 lg:pl-[50px] 2xl:pl-[100px] lg:py-5 2xl:py-0'>
              <p className='text-[#F3F4F4] text-[18px] font-custom font-normal uppercase font-zonapro'>{t('aboutUs')}</p>
              <p className='font-custom1 text-2xl lg:text-[60px] 2xl:text-[64px] text-[#F3F3F3] lg:leading-[67px] 2xl:leading-[75.2px] mt-6 font-zonapro'>{t('aboutUsDescription')}</p>
              <p className='text-[18px] font-normal leading-[21.15px] text-[#F3F4F4] w-full 2xl:w-[667px] mt-6 font-zonapro'>{t('firstDescription')}</p>
              <p className='text-[18px] font-normal leading-[21.15px] text-[#F3F4F4] w-full 2xl:w-[667px] mt-4 font-zonapro'>{t('secondDescription')}</p>
              <Link href="/about" onClick={handleScrollToTop}>
                <button className='w-full lg:w-[200px] bg-[#191716] py-3 rounded-[8px] hover:bg-white hover:text-black hover:duration-500 text-[#F3F4F4] font-custom mt-6 font-zonapro'>{t('readMore')}</button>
              </Link>
              </div>
          </div>
           {/* Projects Section */}
    
      </div>
    </>
  )
}

export default AboutUsOnHomePage
