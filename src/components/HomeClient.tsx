'use client'

import Hero from '@/components/Hero'
import Pricing from '@/components/Pricing'
import Showcase from '@/components/Showcase'
import Images from '@/components/Images'
import Camera from '@/components/Camera'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

export default function HomeClient() {
  const cameraRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const priceRef = useRef<HTMLDivElement>(null!)
  const showcaseRef = useRef<HTMLDivElement>(null!)
  const imagesRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const mm = gsap.matchMedia()
    const breakpoints = {
      mobile: 425,
      desktop: {
        min: 426,
        max: 1706.98,
      },
      large: 1707,
    }

    mm.add(
      {
        isMobile: `(max-width: ${breakpoints.mobile}px)`,
        isDesktop: `(min-width: ${breakpoints.desktop.min}px) and (max-width: ${breakpoints.desktop.max}px)`,
        isLarge: `(min-width: ${breakpoints.large}px)`,
      },
      (context) => {
        const conditions = context.conditions || {}
        const isMobile = conditions.isMobile
        const isDesktop = conditions.isDesktop
        const isLarge = conditions.isLarge

        if (isMobile) {
          const t5 = gsap.timeline()
          t5.fromTo(
            cameraRef.current,
            { top: '3%', rotate: 0, opacity: 0, scale: 1 },
            {
              top: '3%',
              rotate: -25,
              opacity: 1,
              scale: 0.8,
              delay: 1,
              duration: 1,
              ease: 'power2.inOut',
            }
          )

          const pricebounds = priceRef.current.getBoundingClientRect()
          const pricetop = pricebounds.top

          const t6 = gsap.timeline({
            scrollTrigger: {
              trigger: heroRef.current,
              start: '50% 50%',
              scrub: true,
            },
          })

          t6.fromTo(
            cameraRef.current,
            { top: '3%', rotate: -25, scale: 0.8 },
            {
              top: `${pricetop - 65}px`,
              left: '30%',
              scale: 0.5,
              rotate: 25,
              duration: 1,
              ease: 'power2.inOut',
            }
          )

          const showcasebounds = showcaseRef.current.getBoundingClientRect()
          const showcasetop = showcasebounds.top
          const t7 = gsap.timeline({
            scrollTrigger: {
              trigger: priceRef.current,
              start: '10% 30%',
              end: 'bottom 60%',
              scrub: true,
            },
          })
          t7.fromTo(
            cameraRef.current,
            { top: `${pricetop - 65}px`, rotate: 25 },
            {
              top: `${showcasetop - 20}px`,
              left: '-25%',
              rotate: -30,
              duration: 0.5,
              ease: 'power2.inOut',
            }
          )

          const imagebounds = imagesRef.current.getBoundingClientRect()
          const imagetop = imagebounds.top
          const imagecenter = imagetop + imagebounds.height / 2
          const t8 = gsap.timeline({
            scrollTrigger: {
              trigger: showcaseRef.current,
              start: 'center center',
              end: 'bottom 60%',
              scrub: true,
            },
          })
          t8.fromTo(
            cameraRef.current,
            { top: `${showcasetop - 20}px`, rotate: -30 },
            {
              top: `${imagecenter - 150}px`,
              left: '0%',
              rotate: 0,
              scale: 1,
              duration: 0.5,
              ease: 'power2.inOut',
            }
          )
        }

        if (isDesktop || isLarge) {
          const t1 = gsap.timeline()
          t1.fromTo(
            cameraRef.current,
            { scale: isDesktop ? 1.8 : 1.2, rotate: 0, opacity: 0, top: '5%' },
            {
              opacity: 1,
              duration: 1,
              ease: 'power2.inOut',
            }
          )
          t1.fromTo(
            cameraRef.current,
            { scale: isDesktop ? 1.8 : 1.2, rotate: 0, opacity: 1, top: '5%' },
            {
              scale: isDesktop ? 1.5 : 1,
              rotate: 25,
              ease: 'power2.inOut',
              duration: 1,
            }
          )

          const t2 = gsap.timeline({
            scrollTrigger: {
              trigger: priceRef.current,
              start: 'top 80%',
              end: 'bottom bottom',
              scrub: true,
            },
          })
          t2.fromTo(
            cameraRef.current,
            { top: '5%', rotate: 25 },
            {
              rotate: 90,
              top: '31%',
              duration: 1,
              ease: 'power2.inOut',
            }
          )

          const t3 = gsap.timeline({
            scrollTrigger: {
              trigger: showcaseRef.current,
              start: 'top 80%',
              end: 'bottom bottom',
              scrub: true,
            },
          })
          t3.fromTo(
            cameraRef.current,
            { top: '31%', rotate: 90 },
            {
              top: isDesktop ? '60%' : '58%',
              rotate: 80,
              duration: 1,
              ease: 'power2.inOut',
            }
          )

          const t4 = gsap.timeline({
            scrollTrigger: {
              trigger: imagesRef.current,
              start: 'top 80%',
              end: 'bottom bottom',
              scrub: true,
            },
          })
          t4.fromTo(
            cameraRef.current,
            { top: isDesktop ? '60%' : '58%', rotate: 80 },
            {
              top: '80%',
              scale: isDesktop ? 1.8 : 1.2,
              rotate: 0,
              duration: 1,
              ease: 'power2.inOut',
            }
          )
        }
      }
    )

    return () => mm.revert()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-full absolute top-0 z-20" ref={cameraRef}>
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
  )
}
