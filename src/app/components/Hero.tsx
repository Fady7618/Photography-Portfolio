import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Hero() {
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.fromTo(textRef.current , {
      scale:0,
      opacity: 0
    }, {
      scale:1,
      opacity:1,
      duration: 1,
      delay:1,
      ease: "power2.inOut",
    })
  }, [])
  
  return (
    <div className='w-full h-[90vh] flex flex-col justify-center items-center text-center'>
      <h1 className='text-4xl mt-10 lg:m-0 md:text-6xl lg:text-8xl xl:text-9xl w-full text-orange-800 font-bold' ref={textRef}>Welcome to Our Photography Site</h1>
    </div>
  )
}

export default Hero;