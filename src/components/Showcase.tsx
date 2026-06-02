import { useEffect , useRef } from "react";
import type { RefObject } from "react";
import Image from "next/image";
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
        <div className="w-full lg:w-1/3 h-full relative min-h-[200px]">
            <Image
                src="/wedding/martin-baron-BJrbQpEshtY-unsplash.jpg"
                alt="Wedding showcase"
                fill
                className="w-full h-full object-contain object-center"
                />
        </div>

        <div className="w-full lg:w-1/3 h-full flex flex-col py-3 gap-3 justify-center">
            <p className="text-xs font-bold">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque necessitatibus blanditiis tempore nam saepe, cupiditate dolorum provident? Ex harum odit distinctio odio hic ratione! Voluptates earum reprehenderit animi molestias at.</p>
            <h2 className="text-lg font-bold">Subheading</h2>
            <p className="text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente incidunt dolores ipsa est excepturi dolore ipsam eius, laborum quasi nihil sequi voluptate. Sequi nulla labore dicta incidunt provident molestiae ipsa nobis saepe ratione ex doloribus quisquam nostrum veniam dolor, asperiores error laborum repellat voluptatibus consectetur in excepturi illum? Nemo culpa magnam porro iusto consectetur voluptate omnis voluptatem, doloremque voluptatum labore laboriosam quam adipisci voluptatibus sit velit. Natus culpa, tenetur veritatis, provident voluptates, delectus omnis illum unde illo nulla corporis fugiat suscipit distinctio voluptatem tempore perferendis alias et. Tempora, pariatur sunt. Dolorum dignissimos sequi quas dicta ullam et temporibus delectus, cumque quisquam at fugiat nesciunt expedita accusamus, nobis iure ipsum quasi beatae quo corrupti laborum dolores provident vel excepturi saepe? Totam quidem doloremque amet molestiae fugit recusandae suscipit error, perspiciatis ducimus ex non. Aliquam corrupti quisquam, nemo at ipsam fugit iste. Quod hic alias, mollitia harum quae minus quo officiis ex quia obcaecati incidunt eaque dolores maiores molestias assumenda autem ratione necessitatibus voluptatum? Dicta odio ipsam dolorum maiores nam tempore ab, beatae distinctio, ipsum id voluptatem provident consectetur! Asperiores dolores assumenda expedita explicabo esse maxime nostrum facere nesciunt ut. Autem adipisci corrupti provident quo quod maxime eius cum dolorum dolore omnis!</p>
        </div>
      </div>
    </div>
  )
}

export default Showcase;
