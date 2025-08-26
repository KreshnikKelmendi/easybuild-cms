'use client';

import React, { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';

const Count = () => {
  const { t } = useTranslation();
  const { ref: ref1, inView: inView1 } = useInView({ triggerOnce: false });
  const { ref: ref2, inView: inView2 } = useInView({ triggerOnce: true });
  const { ref: ref3, inView: inView3 } = useInView({ triggerOnce: true });

  const countRef1 = useRef<HTMLSpanElement>(null);
  const countRef2 = useRef<HTMLSpanElement>(null);
  const countRef3 = useRef<HTMLSpanElement>(null);

  const animateCount = (countRef: React.RefObject<HTMLSpanElement>, end: number) => {
    if (countRef.current) {
      gsap.to(countRef.current, {
        innerText: end,
        snap: { innerText: 1 },
        duration: 3,
        ease: "power3.out",
        onUpdate: () => {
          if (countRef.current) {
            countRef.current.innerText = Math.ceil(Number(countRef.current.innerText)).toString();
          }
        }
      });
    }
  };

  useEffect(() => {
    if (inView1) animateCount(countRef1, 25);
  }, [inView1]);

  useEffect(() => {
    if (inView2) animateCount(countRef2, 35);
  }, [inView2]);

  useEffect(() => {
    if (inView3) animateCount(countRef3, 69);
  }, [inView3]);

  return (
    <div className='flex flex-col lg:flex-row lg:gap-x-16 gap-y-16 py-8 lg:py-24 lg:gap-y-0 font-sans lg:px-[70px] 2xl:px-[120px] bg-[#DD4624] rounded-b-[15px] relative'>
      <div ref={ref1} className='flex justify-center lg:justify-start'>
        <p className='flex items-center text-white leading-[28.8px] text-left'>
          <span className='text-[36px] lg:text-[48px] font-bold text-black' ref={countRef1}>0</span>
          <span className='text-[36px] lg:text-[48px] font-bold text-black'>+</span>
          <span className='text-[18px] lg:text-[24px] ml-5 w-1/2'>{t('firstCount')}</span>
        </p>
      </div>
      <div ref={ref2} className='flex justify-center lg:justify-start'>
        <p className='flex items-center text-white leading-[28.8px] text-left'>
          <span className='text-[36px] lg:text-[48px] font-bold text-black' ref={countRef2}>0</span>
          <span className='text-[36px] lg:text-[48px] font-bold text-black'>+</span>
          <span className='text-[18px] lg:text-[24px] ml-5 lg:w-1/2'>{t('secondCount')}</span>
        </p>
      </div>
      <div ref={ref3} className='flex justify-center lg:justify-start'>
        <p className='flex items-center text-white leading-[28.8px] text-left'>
          <span className='text-[36px] lg:text-[48px] font-bold text-black' ref={countRef3}>0</span>
          <span className='text-[36px] lg:text-[48px] font-bold text-black'>+</span>
          <span className='text-[18px] lg:text-[24px] ml-5 lg:w-1/2'>{t('thirdCount')}</span>
        </p>
      </div>
    </div>
  );
};

export default Count;
