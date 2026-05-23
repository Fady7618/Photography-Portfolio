'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Image as ImageIcon, Calendar, User, Home, LayoutDashboard } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

function Sidebar() {
  const pathname = usePathname()
  const [activePath, setActivePath] = useState('/')
  const { isAdmin, loading } = useAuth()

  useEffect(() => {
    setActivePath(pathname)
  }, [pathname])

  const handleNavClick = (path: string) => {
    setActivePath(path)
  }

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden bg-orange-800 z-50 py-2">
        <nav className='flex justify-around items-center'>
          <Link
            href="/"
            className={`p-2 rounded-lg flex flex-col text-sm lg:text-lg justify-center items-center transition-colors
                      ${activePath === '/' 
                        ? 'bg-orange-100' 
                        : 'text-white'}`}
            title='Home'>
            <Home size={24} absoluteStrokeWidth={true}/>
            <span>home</span>
          </Link>
          <Link
            href="/gallery"
            className={`p-2 rounded-lg flex flex-col text-sm lg:text-lg justify-center items-center transition-colors
                      ${activePath === '/gallery' 
                        ? 'bg-orange-100' 
                        : 'text-white'}`}
            title='Gallery'>
            <ImageIcon size={24} absoluteStrokeWidth={true}/>
            <span>gallery</span>
          </Link>
          <Link
            href="/reservation"
            className={`p-2 rounded-lg flex flex-col text-sm lg:text-lg justify-center items-center transition-colors
                      ${activePath === '/reservation' 
                        ? 'bg-orange-100' 
                        : 'text-white'}`}
            title='Reservation'>
            <Calendar size={24} absoluteStrokeWidth={true}/>
            <span>reservation</span>
          </Link>
          {!loading && isAdmin && (
            <Link
              href="/admin"
              className={`p-2 rounded-lg flex flex-col text-sm lg:text-lg justify-center items-center transition-colors
                        ${activePath.startsWith('/admin') 
                          ? 'bg-orange-100' 
                          : 'text-white'}`}
              title='Admin'>
              <LayoutDashboard size={24} absoluteStrokeWidth={true}/>
              <span>admin</span>
            </Link>
          )}
          <Link
            href="/about"
            className={`p-2 rounded-lg flex flex-col text-sm lg:text-lg justify-center items-center transition-colors
                      ${activePath === '/about' 
                        ? 'bg-orange-100' 
                        : 'text-white'}`}
            title='About'>
            <User size={24} absoluteStrokeWidth={true}/>
            <span>about</span>
          </Link>
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <div className="w-full h-full hidden lg:flex flex-col justify-center">
        <nav className='w-full h-full flex flex-col gap-6 items-center'>
          <Link
            href="/"
            onClick={() => handleNavClick('/')}
            className={`p-2 rounded-lg flex place-content-center gap-2 transition-colors
                      ${activePath === '/' 
                        ? 'bg-orange-100' 
                        : 'text-white hover:bg-orange-600 hover:text-white'}`}
            title='Home'>
            <Home size={24} absoluteStrokeWidth={true}/>
          </Link>
          <Link
            href="/gallery"
            onClick={() => handleNavClick('/gallery')}
            className={`p-2 rounded-lg flex place-content-center gap-2 transition-colors
                      ${activePath === '/gallery' 
                        ? 'bg-orange-100' 
                        : 'text-white hover:bg-orange-600 hover:text-white'}`}
            title='Gallery'>
            <ImageIcon size={24} absoluteStrokeWidth={true}/>
          </Link>
          <Link
            href="/reservation"
            onClick={() => handleNavClick('/reservation')}
            className={`p-2 rounded-lg flex place-content-center gap-2 transition-colors
                      ${activePath === '/reservation' 
                        ? 'bg-orange-100' 
                        : 'text-white hover:bg-orange-600 hover:text-white'}`}
            title='Reservation'>
            <Calendar size={24} absoluteStrokeWidth={true}/>
          </Link>
          {!loading && isAdmin && (
            <Link
              href="/admin"
              onClick={() => handleNavClick('/admin')}
              className={`p-2 rounded-lg flex place-content-center gap-2 transition-colors
                        ${activePath.startsWith('/admin') 
                          ? 'bg-orange-100' 
                          : 'text-white hover:bg-orange-600 hover:text-white'}`}
              title='Admin Panel'>
              <LayoutDashboard size={24} absoluteStrokeWidth={true}/>
            </Link>
          )}
          <Link
            href="/about"
            onClick={() => handleNavClick('/about')}
            className={`p-2 rounded-lg flex place-content-center gap-2 transition-colors
                      ${activePath === '/about' 
                        ? 'bg-orange-100' 
                        : 'text-white hover:bg-orange-600 hover:text-white'}`}
            title='About'>
            <User size={24} absoluteStrokeWidth={true}/>
          </Link>
        </nav>
      </div>
    </>
  )
}

export default Sidebar
