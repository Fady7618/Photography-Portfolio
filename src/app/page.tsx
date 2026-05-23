"use client";

import Hero from '@/components/Hero';
import Pricing from '@/components/Pricing';
import Showcase from '@/components/Showcase';
import Images from '@/components/Images';
import Camera from '@/components/Camera';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef} from 'react';

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const cameraRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null!);
  const showcaseRef = useRef<HTMLDivElement>(null!);
  const imagesRef = useRef<HTMLDivElement>(null!);

useEffect(() => {
  const mm = gsap.matchMedia();
  const breakpoints = {
    mobile: 425,
    desktop:{
      min: 426,
      max: 1448
    },
    large: 1449
  }

  mm.add({
    isMobile: `(max-width: ${breakpoints.mobile}px)`,
    isDesktop: `(min-width: ${breakpoints.desktop.min}px) and (max-width: ${breakpoints.desktop.max}px)`,
    isLarge: `(min-width: ${breakpoints.large}px)`
  }, (context) => {
    const conditions = context.conditions || {};
    const isMobile = conditions.isMobile;
    const isDesktop = conditions.isDesktop;
    const isLarge = conditions.isLarge;
    if (isMobile) {
      const t5 = gsap.timeline({});
      t5.fromTo(cameraRef.current, { top: "0%", rotate: "0deg" , opacity: 0 , scale: 1}, {
        top: "0%",
        rotate: "-25deg",
        opacity: 1,
        scale: 0.8,
        delay: 1,
        duration: 1,
        ease: "power2.inOut"
      });

      const pricebounds = priceRef.current.getBoundingClientRect();
      const pricetop = pricebounds.top;

      const t6 = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "50% 50%",
          scrub: true,
        }
      });

      t6.fromTo(cameraRef.current, { top: "0%", rotate: "-25deg" , scale: 0.8}, {
        top: `${pricetop - 65}px`,
        left: "30%",
        scale: 0.5,
        rotate: "25deg",
        duration: 1,
        ease: "power2.inOut"
      });

      const showcasebounds = showcaseRef.current.getBoundingClientRect();
      const showcasetop = showcasebounds.top;
      const t7 = gsap.timeline({
        scrollTrigger:{
          trigger: priceRef.current,
          start: "10% 30%",
          end: "bottom 60%",
          scrub: true,
        }
      });
      t7.fromTo(cameraRef.current, { top: `${pricetop - 65}px`, rotate: "25deg" }, {
        top: `${showcasetop - 20}px`,
        left: "-20%",
        rotate: "-30deg",
        duration: 0.5,
        ease: "power2.inOut"
      });

      const imagebounds = imagesRef.current.getBoundingClientRect();
      const imagetop = imagebounds.top;
      const imagecenter = imagetop + (imagebounds.height / 2);
      const t8 = gsap.timeline({
        scrollTrigger:{
          trigger: showcaseRef.current,
          start: "center center",
          end: "bottom 60%",
          scrub: true,
        }
      });
      t8.fromTo(cameraRef.current, { top: `${showcasetop - 20}px`, rotate: "-30deg" },{
        top: `${imagecenter}px`,
        left: "0%",
        rotate: "0deg",
        scale: 1,
        duration: 0.5,
        ease: "power2.inOut"
      });
    }

    if (isDesktop || isLarge) {
      const t1 = gsap.timeline({});
      t1.fromTo(cameraRef.current, {scale: 1, rotate: "0deg", opacity: 0}, {
        scale: isDesktop ? 0.8 : 1,
        rotate: "25deg",
        top: "5%",
        opacity: 1,
        duration: 1,
        delay: 1,
        ease: "power2.inOut",
      });

      const t2 = gsap.timeline({
        scrollTrigger:{
          trigger: priceRef.current,
          start: "top 80%",
          end: "bottom bottom",
          scrub: true,
        }
      })
      t2.fromTo(cameraRef.current, { top: "5%", rotate: "25deg" }, {
        rotate: "90deg",
        top: isDesktop ? "29%" : "31%",
        duration: 1,
        ease: "power2.inOut"
      });

      const t3 = gsap.timeline({
        scrollTrigger: {
          trigger: showcaseRef.current,
          start: "top 80%",
          end: "bottom bottom",
          scrub: true,
        }
      });
      t3.fromTo(cameraRef.current, { top: isDesktop ? "29%" : "31%", rotate: "90deg" }, {
        top: isDesktop ? "55%" : "60%",
        rotate: "80deg",
        duration: 1,
        ease: "power2.inOut",
      });

      const t4 = gsap.timeline({
        scrollTrigger:{
          trigger: imagesRef.current,
          start: "top 80%",
          end: "bottom bottom",
          scrub: true,
        }
      });
      t4.fromTo(cameraRef.current, {top: isDesktop ? "55%" : "60%" , rotate: "80deg"} , {
        top: isDesktop ? "77%" : "83%",
        scale: 1,
        rotate: "0deg",
        duration: 1,
        ease: "power2.inOut",
      })
    }
  })

  return () => mm.revert(); // Clean up
}, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-full absolute top-0 z-10" ref={cameraRef}>
        <Camera />
      </div>
      <div className="w-full h-full" ref={heroRef}>
        <Hero />
      </div>
      <div className="w-full h-full z-10" ref={priceRef}>
        <Pricing />
      </div>
      <div className="w-full h-full lg:h-screen" ref={showcaseRef}>
        <Showcase priceRef={priceRef} />
      </div>
      <div className="w-full h-screen" ref={imagesRef}>
        <Images showcaseRef={showcaseRef} />
      </div>
    </div>
  );
}

export default Home;
