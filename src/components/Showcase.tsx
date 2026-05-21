import { useEffect , useRef } from "react";
import type { RefObject } from "react";
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger);

interface ShowcaseProps {
  priceRef?: RefObject<HTMLDivElement> ;
}

function Showcase({ priceRef }: ShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    if(!containerRef.current) return;
    const children = containerRef.current?.querySelectorAll('*');
    gsap.set(children, {y:100 , opacity:0});
    gsap.fromTo(children , {y:100 , opacity: 0}, {
      scrollTrigger:{
        trigger: priceRef?.current,
        start: "center top",
        scrub: true,
      },
      y:0,
      opacity: 1,
      stagger:1,
      duration: 10,
      ease: 'power2.inOut'
    })
  },[priceRef])
  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="w-full h-1/4 flex justify-center items-center">
        <h1 className="text-4xl lg:text-7xl xl:text-8xl text-end lg:text-start font-bold rubik-dirtFont">Lorem ipsum dolor sit.</h1>
      </div>

      <div className="w-full h-3/4 flex flex-col lg:flex-row justify-center lg:justify-between items-center" ref={containerRef}>
        <div className="w-full lg:w-1/3 h-full">
            <img 
                src="/wedding.webp" 
                alt="image" 
                className="w-auto h-auto object-contain"
                />
        </div>

        <div className="w-full lg:w-1/3 h-full flex flex-col py-3 gap-3">
            <p className="text-xs font-bold">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque necessitatibus blanditiis tempore nam saepe, cupiditate dolorum provident? Ex harum odit distinctio odio hic ratione! Voluptates earum reprehenderit animi molestias at.</p>
            <h2 className="text-lg font-bold">Subheading</h2>
            <p className="text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta, iusto architecto odit quidem labore, voluptas placeat at, voluptatibus doloribus eos ad quo sapiente fugit? Fugit pariatur dolorum dicta. Vero illum reiciendis beatae doloribus minus maiores perferendis sapiente quas blanditiis velit?</p>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minima rerum distinctio quaerat voluptatibus sit assumenda sed ut excepturi non delectus.</p>
        </div>
      </div>
    </div>
  )
}

export default Showcase;
