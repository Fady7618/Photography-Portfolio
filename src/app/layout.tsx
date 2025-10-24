'use client';

// @ts-ignore
import './globals.css';
import { useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const sidebarRef = useRef(null);
  const navbarRef = useRef(null);
  const mobilenavbarRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    if (sidebarRef.current) {
      tl.fromTo(
        sidebarRef.current,
        { x: '-100%' },
        { x: '0%', duration: 1, delay: 1, ease: 'power3.out' },
        'start'
      );
    }

    if (navbarRef.current) {
      tl.fromTo(
        navbarRef.current,
        { y: '-100%' },
        { y: '0%', duration: 1, delay: 1, ease: 'power2.inOut' },
        'start'
      );
    }

    if (mobilenavbarRef.current) {
      tl.fromTo(
        mobilenavbarRef.current,
        { y: '-100%' },
        { y: '0%', duration: 1, delay: 1, ease: 'power2.inOut' },
        'start'
      );
    }

    if (ScrollSmoother.get()) return;

    ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.5,
      effects: true,
    });

    return () => {
      const smoother = ScrollSmoother.get();
      if (smoother) smoother.kill();
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/logo.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#ea580c" />
      </head>
      <body suppressHydrationWarning={true}>
        <div id="smooth-wrapper" className="h-screen overflow-hidden bg-orange-100">
          <div id="smooth-content" ref={containerRef}>
            {/* Mobile Layout */}
            <div className="lg:hidden flex flex-col">
              <div className="w-full z-50" ref={mobilenavbarRef}>
                <Navbar />
              </div>
              <main className="relative h-full z-10">
                {children}
              </main>
              <div className="w-full z-50">
                <Sidebar />
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:grid grid-cols-[80px_1fr] grid-rows-[64px_1fr] lg:min-h-screen">
              <div
                className="relative bg-orange-800 row-span-full flex flex-col justify-center p-4 border-e-2 border-zinc-900 z-50"
                ref={sidebarRef}
              >
                <Sidebar />
              </div>

              <div className="flex flex-col items-center justify-center" ref={navbarRef}>
                <Navbar />
              </div>

              <main className="h-full">
                {children}
              </main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
