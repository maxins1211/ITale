import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageCircle, User, Calendar } from 'lucide-react'
import {
  formatTimeAgo,
  formatDate,
  getBlogDateFallback,
} from '@/utils/dateUtils'

const BlogCard = ({ blog, size = 'default' }) => {
  // Truncate content for display
  const truncateText = (text, maxLength) => {
    if (!text) return ''
    const strippedText = text.replace(/<[^>]+>/g, '') // Remove HTML tags
    return strippedText.length > maxLength
      ? strippedText.substring(0, maxLength) + '...'
      : strippedText
  }

  const cardSizeClasses = {
    large: 'h-80',
    default: 'h-64',
  }

  const imageSizeClasses = {
    large: 'h-48',
    default: 'h-32',
  }

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border ${cardSizeClasses[size]} overflow-hidden`}
    >
      <Link to={`/blogs/${blog.id}`} className="block h-full">
        <div className="flex h-full">
          {/* Image Section - Left Side */}
          <div className="relative overflow-hidden w-1/3">
            {blog.coverImage ? (
              <img
                src={blog.coverImage}
                alt={blog.title}
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300`}
              />
            ) : (
              <div
                className={`w-full h-full bg-muted flex items-center justify-center`}
              >
                <div className="text-muted-foreground text-3xl">📝</div>
              </div>
            )}
          </div>

          {/* Content Section - Right Side */}
          <div className="w-2/3 p-4 flex flex-col justify-between">
            <div>
              <h3
                className={`font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2 ${
                  size === 'large' ? 'text-xl' : 'text-lg'
                }`}
              >
                {blog.title}
              </h3>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <User className="w-4 h-4" />
                <span>{blog.user?.name || 'Anonymous'}</span>
                <Calendar className="w-4 h-4 ml-2" />
                <span title={formatDate(getBlogDateFallback(blog))}>
                  {formatTimeAgo(getBlogDateFallback(blog))}
                </span>
              </div>

              <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                {truncateText(blog.content, size === 'large' ? 200 : 120)}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{blog.likes || 0}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{blog.comments?.length || 0}</span>
                </div>
              </div>

              <span className="text-sm text-primary font-medium group-hover:underline">
                Read more →
              </span>
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div className="flex gap-1 mt-2">
                {blog.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </Card>
  )
}

export default BlogCard
