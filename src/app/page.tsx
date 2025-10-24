"use client";

import Hero from './components/Hero';
import Pricing from './components/Pricing';
import Showcase from './components/Showcase';
import Images from './components/Images';
import Camera from './components/Camera';
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

  // Desktop animations (≥ 1024px)
  mm.add("(min-width: 1024px)", () => {
    const t1 = gsap.timeline({});
    t1.fromTo(cameraRef.current, { scale: 1, rotate: "0deg", opacity: 0 }, {
      rotate: "25deg",
      scale: 0.8,
      top: "5%",
      opacity: 1,
      duration: 1,
      delay: 1,
      ease: "power2.inOut",
    });

    const t2 = gsap.timeline({
      scrollTrigger: {
        trigger: priceRef.current,
        start: "top 80%",
        end: "bottom bottom",
        scrub: true,
      }
    });
    t2.fromTo(cameraRef.current, { top: "5%", rotate: "25deg" }, {
      rotate: "90deg",
      top: "29%",
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
    t3.fromTo(cameraRef.current, { top: "29%", rotate: "90deg" }, {
      top: "55%",
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
    t4.fromTo(cameraRef.current, {top: "55%" , rotate: "80deg"} , {
      top: "77%",
      scale: 1,
      rotate: "0deg",
      duration: 1,
      ease: "power2.inOut",
    })
  });

  // Mobile animations (< 1024px)
  mm.add("(max-width: 1023px)", () => {
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
    console.log("Price bounds:", pricebounds);
    const pricetop = pricebounds.top;
    console.log("Price top:", pricetop);
    console.log(window.document.body.clientHeight);
    
    // const pricepercentage = (pricetop / window.document.body.clientHeight) * 100;
    // console.log("Price percentage:", pricepercentage);
    
    const t6 = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "50% 50%",
        // end: "bottom bottom",
        scrub: true,
        // markers: true,
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
    console.log("Image bounds:", imagebounds);
    console.log("Image top:", imagebounds.top);
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
    })
    
  });

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
