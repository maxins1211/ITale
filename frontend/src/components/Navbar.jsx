import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { logoutUser } from '../reducers/userReducer'
import blogService from '../services/blogs'
import { Button } from './ui/button'
import { Avatar, AvatarFallback } from './ui/avatar'
import { ModeToggle } from './mode-toggle'

const Navbar = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    dispatch(logoutUser())
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  const handleNavigation = (sectionId) => {
    setIsMobileMenuOpen(false)
    if (location.pathname !== '/') {
      // If not on home page, navigate to home page first
      navigate('/')
      // Wait for navigation to complete, then scroll to section
      setTimeout(() => {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      // If on home page, just scroll to section
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  }

  return (
    <>
      <nav className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-3 text-2xl font-bold text-primary hover:text-primary/80 transition-all duration-200 ease-in-out group"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-foreground group-hover:bg-primary/90 transition-colors shadow-sm">
                <span className="text-base font-black">I</span>
              </div>
              <span className="text-primary group-hover:text-primary/80 transition-colors">
                ITale
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Popular Stories and Recent Posts */}
              <button
                onClick={() => handleNavigation('popular-stories')}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
              >
                Popular Stories
              </button>
              <button
                onClick={() => handleNavigation('recent-blogs')}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
              >
                Recent Posts
              </button>

              {/* Admin Panel Link */}
              {user && user.isAdmin && (
                <Link
                  to="/admin"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                >
                  Admin Panel
                </Link>
              )}

              {/* Right side icons grouped closer together */}
              <div className="flex items-center space-x-1">
                {/* Dark mode toggle */}
                <ModeToggle />

                {user ? (
                  <>
                    {/* Logout Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all duration-200"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                    </Button>
                    {/* User Avatar with Admin Badge */}
                    <div className="flex items-center px-1 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors relative">
                      <Avatar className="h-8 w-8 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      {user.isAdmin && (
                        <div
                          className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border border-white"
                          title="Admin"
                        ></div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-card-foreground hover:bg-secondary/50 border border-transparent hover:border-border transition-all duration-200"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md border border-primary/20 hover:border-primary/30 transition-all duration-200"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center space-x-1">
                <div className="flex items-center">
                  <ModeToggle />
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-card">
              <div className="px-4 py-3 space-y-3">
                <button
                  onClick={() => handleNavigation('popular-stories')}
                  className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium py-2"
                >
                  Popular Stories
                </button>
                <button
                  onClick={() => handleNavigation('recent-blogs')}
                  className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium py-2"
                >
                  Recent Posts
                </button>
                {user && user.isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium py-2"
                  >
                    Admin Panel
                  </Link>
                )}
                {!user && (
                  <div className="pt-3 border-t border-border space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-muted-foreground hover:text-card-foreground hover:bg-secondary/50"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        size="sm"
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar
