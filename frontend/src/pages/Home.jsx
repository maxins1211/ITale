import { Link, useNavigate } from 'react-router-dom'
import BlogCard from '../components/BlogCard'
import TopBlogCard from '../components/TopBlogCard'
import CompactBlogCard from '../components/CompactBlogCard'
import blogService from '../services/blogs'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import {
  PenTool,
  TrendingUp,
  Clock,
  ChevronDown,
  Code,
  BookOpen,
  Users,
} from 'lucide-react'

const Home = () => {
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()

  const {
    data: blogs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const blogs = await blogService.getAll()
      return blogs
    },
  })

  // Get top 4 blogs by likes (highest votes)
  const topBlogs = blogs
    ? [...blogs].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 4)
    : []

  // Get recent blogs sorted by creation date (not updated date)
  const recentBlogs = blogs
    ? [...blogs]
        .sort((a, b) => {
          const dateA = new Date(a.createdAt || a.date)
          const dateB = new Date(b.createdAt || b.date)
          return dateB - dateA
        })
        .slice(0, 8)
    : []

  const handleCreateBlog = () => {
    if (!user) {
      navigate('/login')
    } else {
      navigate('/create-blog')
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-destructive">Error loading blogs</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {user ? (
        /* Compact greeting section for logged-in users */
        <section className="hero-section py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-foreground mb-1 animate-fade-in-up">
                Hello, <span className="text-primary">{user.name}</span>!
                Welcome back!
              </h1>
              <p className="text-sm text-muted-foreground mb-3 animate-fade-in-up animate-delay-200">
                What's your story today? Please share and place your name on the
                leaderboard!
              </p>
              <Button
                onClick={handleCreateBlog}
                size="default"
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 transform hover:scale-[1.02] animate-fade-in-up animate-delay-400"
              >
                <PenTool className="w-4 h-4 mr-2" />
                Share Your Story
              </Button>
            </div>
          </div>
        </section>
      ) : (
        /* Full hero section for non-logged in users */
        <section className="hero-section h-screen flex items-center relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl w-full">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in-left">
                  Share Your <span className="text-primary">IT Story</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl animate-fade-in-left animate-delay-200">
                  Join our community and share your IT journey with fellow
                  developers. Read inspiring stories, learn from experiences,
                  and connect with like-minded professionals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-left animate-delay-400">
                  <Button
                    onClick={handleCreateBlog}
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    <PenTool className="w-5 h-5 mr-2" />
                    Create Your Story
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() =>
                      document
                        .getElementById('recent-blogs')
                        ?.scrollIntoView({ behavior: 'smooth' })
                    }
                  >
                    Explore Stories
                  </Button>
                </div>
              </div>
              <div className="flex-1 lg:flex justify-center hidden">
                <div className="hero-visual w-96 h-96 rounded-2xl flex items-center justify-center relative shadow-2xl animate-fade-in-right animate-delay-600">
                  {/* Modern tech icons arrangement */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-8 text-primary/60">
                      <Code
                        className="w-12 h-12 animate-pulse"
                        style={{ animationDelay: '0s' }}
                      />
                      <BookOpen
                        className="w-12 h-12 animate-pulse"
                        style={{ animationDelay: '0.5s' }}
                      />
                      <Users
                        className="w-12 h-12 animate-pulse"
                        style={{ animationDelay: '1s' }}
                      />
                      <TrendingUp
                        className="w-12 h-12 animate-pulse"
                        style={{ animationDelay: '1.5s' }}
                      />
                      <PenTool
                        className="w-16 h-16 text-primary animate-pulse"
                        style={{ animationDelay: '2s' }}
                      />
                      <Clock
                        className="w-12 h-12 animate-pulse"
                        style={{ animationDelay: '2.5s' }}
                      />
                    </div>
                  </div>
                  {/* Floating elements */}
                  <div
                    className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full animate-bounce"
                    style={{ animationDelay: '0.5s' }}
                  ></div>
                  <div
                    className="absolute -bottom-4 -left-4 w-6 h-6 bg-secondary/20 rounded-full animate-bounce"
                    style={{ animationDelay: '1s' }}
                  ></div>
                  <div
                    className="absolute top-1/2 -right-8 w-4 h-4 bg-accent/20 rounded-full animate-bounce"
                    style={{ animationDelay: '1.5s' }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Bouncing Arrow for non-logged in users */}
            <div className="flex justify-center mt-12 lg:mt-16 animate-fade-in animate-delay-800">
              <button
                onClick={() =>
                  document
                    .getElementById('popular-stories')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="group flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
                aria-label="Scroll down to explore stories"
              >
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  Explore Stories
                </span>
                <div className="animate-bounce">
                  <ChevronDown className="w-6 h-6" />
                </div>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Top Voted Blogs Section */}
      <section
        id="popular-stories"
        className={`${user ? 'py-8' : 'py-16'} gradient-bg`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">
              Most Popular Stories
            </h2>
          </div>

          {topBlogs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top 1 Blog - Left side with vertical layout (50% width) */}
              <div className="lg:col-span-1">
                <TopBlogCard blog={topBlogs[0]} rank={1} />
              </div>

              {/* Top 2-4 Blogs - Right side in column (50% width) */}
              <div className="lg:col-span-1 space-y-4">
                {topBlogs.slice(1, 4).map((blog, index) => (
                  <CompactBlogCard key={blog.id} blog={blog} rank={index + 2} />
                ))}
              </div>
            </div>
          ) : (
            <Card className="card-enhanced p-8 text-center">
              <CardContent>
                <p className="text-muted-foreground">
                  No stories available yet. Be the first to share your IT
                  journey!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Recent Blogs Section */}
      <section id="recent-blogs" className="py-16 bg-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">
              Latest Stories
            </h2>
          </div>

          {recentBlogs.length > 0 ? (
            <div className="space-y-6">
              {recentBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} size="default" />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <CardContent>
                <p className="text-muted-foreground">
                  No recent stories available.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Share Your Story?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of IT professionals sharing their experiences,
            insights, and knowledge with the community.
          </p>
          <Button
            onClick={handleCreateBlog}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <PenTool className="w-5 h-5 mr-2" />
            Start Writing
          </Button>
        </div>
      </section>
    </div>
  )
}

export default Home
