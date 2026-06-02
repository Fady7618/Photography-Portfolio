import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import Image from "next/image";
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger);

interface ImagesProps {
    showcaseRef?: RefObject<HTMLDivElement>;
}

function Images({ showcaseRef }: ImagesProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const children = containerRef.current.querySelectorAll('div');
        gsap.set(children, { y: 100, opacity: 0 });
        gsap.fromTo(children, { y: 100, opacity: 0 }, {
            scrollTrigger:{
                trigger: showcaseRef?.current,
                start: "center 20%",
                scrub: true,
            },
            y: 0,
            opacity: 1,
            stagger: 1,
            duration: 1,
            ease: 'power2.inOut'
        });
    }, [showcaseRef])
    
  return (
    <div className="w-full h-full relative overflow-hidden z-0" ref={containerRef}>
      <div className="absolute top-0 lg:top-5 left-0 lg:left-10 z-10 -rotate-5 size-30 lg:size-60 border-8 border-white shadow-[10px_5px_15px_rgba(0,0,0,0.65)] overflow-hidden">
        <Image src="/wedding/jakob-owens-lSp8R968ozE-unsplash.jpg" alt="Wedding photo" fill className="object-cover" />
      </div>

      <div className="absolute top-10 lg:top-20 right-0 lg:right-10 rotate-10 lg:-rotate-10 size-40 lg:size-70 border-8 border-white shadow-[10px_5px_15px_rgba(0,0,0,0.65)] overflow-hidden">
        <Image src="/wedding/nathan-dumlao-H_cZqryUuok-unsplash.jpg" alt="Wedding photo" fill className="object-cover" />
      </div>

      <div className="absolute bottom-5 left-10 lg:bottom-0 lg:left-20 rotate-12 size-30 lg:size-50 border-8 border-white shadow-[10px_5px_15px_rgba(0,0,0,0.65)] overflow-hidden">
        <Image src="/wedding/ozkan-guner-ovQQ1jePRmk-unsplash.jpg" alt="Wedding photo" fill className="object-cover" />
      </div>
    </div>
  )
}

export default Images
