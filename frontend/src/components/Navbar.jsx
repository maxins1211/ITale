import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { LogOut } from 'lucide-react'
import { logoutUser } from '../reducers/userReducer'
import blogService from '../services/blogs'
import { Button } from './ui/button'
import { Avatar, AvatarFallback } from './ui/avatar'
import { ModeToggle } from './mode-toggle'

const Navbar = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    dispatch(logoutUser())
    navigate('/')
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
    <nav className="border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95 supports-[backdrop-filter]:bg-card/60">
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

          {/* Right side navigation */}
          <div className="flex items-center space-x-3">
            {/* Dark mode toggle */}
            <div className="flex items-center">
              <ModeToggle />
            </div>

            {user ? (
              <div className="flex items-center space-x-3">
                {/* User Avatar and Name */}
                <div className="flex items-center space-x-3 px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-card-foreground font-medium text-sm">
                    {user.name}
                  </span>
                </div>
                {/* Logout Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
