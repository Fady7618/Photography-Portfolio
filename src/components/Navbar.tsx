'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, profile, isAdmin, isAuthenticated, loading, signOut } = useAuth()
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    setIsUserMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="h-16 lg:h-full w-full flex items-center">
      <div className="w-full px-4 lg:px-6 flex items-center h-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <Link href="/" className="text-xl lg:text-2xl font-bold text-orange-800 tracking-wider plasterFont">
              FUJIFILM
            </Link>
          </div>
          
          <button 
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-orange-200 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6 text-orange-800" /> : <Menu className="h-6 w-6 text-orange-800" />}
          </button>

          <div className="hidden lg:flex items-center space-x-4">
            <Link 
              href="/reservation"
              className="bg-orange-800 hover:bg-orange-900 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Now</span>
            </Link>

            {loading ? (
              <div className="bg-orange-800 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                <User className="h-4 w-4 animate-pulse" />
                <span>Loading...</span>
              </div>
            ) : isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="bg-orange-800 hover:bg-orange-900 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>{profile?.full_name || 'Account'}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border-2 border-orange-200 z-50">
                    <div className="p-3 border-b border-orange-100">
                      <p className="text-sm font-semibold text-orange-800">{profile?.full_name}</p>
                      <p className="text-xs text-orange-600">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      {isAdmin && (
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center space-x-2 px-4 py-2 text-orange-800 hover:bg-orange-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-orange-800 hover:bg-orange-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/auth/login"
                className="bg-orange-800 hover:bg-orange-900 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 shadow-lg z-50 bg-white">
            <div className="flex flex-col space-y-3 p-4">
              <Link 
                href="/reservation"
                className="bg-orange-800 hover:bg-orange-900 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Calendar className="h-4 w-4" />
                <span>Book Now</span>
              </Link>

              {loading ? (
                <div className="bg-orange-800 text-white px-4 py-3 rounded-lg font-medium flex items-center space-x-2 justify-center">
                  <User className="h-4 w-4 animate-pulse" />
                  <span>Loading...</span>
                </div>
              ) : isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      className="bg-orange-700 hover:bg-orange-800 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 justify-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false)
                      handleSignOut()
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 justify-center"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link 
                  href="/auth/login"
                  className="bg-orange-800 hover:bg-orange-900 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar