import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, MessageCircle, User, Calendar } from 'lucide-react'
import {
  formatTimeAgo,
  formatDate,
  getBlogDateFallback,
} from '@/utils/dateUtils'

const CompactBlogCard = ({ blog, rank }) => {
  return (
    <Card
      className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border overflow-hidden relative"
      style={{ height: 'calc((24rem - 2rem) / 3)' }}
    >
      {/* Rank Badge */}
      <div className="absolute top-2 left-2 z-10 flex items-center justify-center w-6 h-6 bg-secondary text-secondary-foreground rounded-full text-xs font-bold shadow-sm">
        {rank}
      </div>

      <Link to={`/blogs/${blog.id}`} className="block h-full">
        <div className="flex h-full">
          {/* Image Section - Left Side */}
          <div className="relative overflow-hidden w-1/3">
            {blog.coverImage ? (
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <div className="text-muted-foreground text-2xl">📝</div>
              </div>
            )}
          </div>

          {/* Content Section - Right Side */}
          <CardContent className="w-2/3 p-3 flex flex-col">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1 text-sm">
                {blog.title}
              </h3>

              {/* Author and Date */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="w-2.5 h-2.5" />
                  <span className="truncate">
                    {blog.user?.name || 'Anonymous'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-2.5 h-2.5" />
                  <span title={formatDate(getBlogDateFallback(blog))}>
                    {formatTimeAgo(getBlogDateFallback(blog))}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats - Bottom with more spacing */}
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Heart className="w-3 h-3" />
                <span className="text-xs font-medium">{blog.likes || 0}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageCircle className="w-3 h-3" />
                <span className="text-xs font-medium">
                  {blog.comments?.length || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>
  )
}

export default CompactBlogCard
