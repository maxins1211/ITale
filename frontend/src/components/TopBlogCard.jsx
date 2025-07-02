import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, MessageCircle, Trophy, User, Calendar } from 'lucide-react'
import {
  formatTimeAgo,
  formatDate,
  getBlogDateFallback,
} from '@/utils/dateUtils'

const TopBlogCard = ({ blog, rank }) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border overflow-hidden relative h-96">
      {/* Rank Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold shadow-md">
        {rank}
      </div>

      <Link to={`/blogs/${blog.id}`} className="block h-full">
        {/* Cover Image */}
        <div className="relative overflow-hidden h-56">
          {blog.coverImage ? (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <div className="text-muted-foreground text-5xl">📝</div>
            </div>
          )}
        </div>{' '}
        <CardContent className="p-4 h-32 flex flex-col">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2 text-lg leading-tight">
              {blog.title}
            </h3>

            {/* Author and Date */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{blog.user?.name || 'Anonymous'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span title={formatDate(getBlogDateFallback(blog))}>
                  {formatTimeAgo(getBlogDateFallback(blog))}
                </span>
              </div>
            </div>
          </div>

          {/* Stats and Rank - Bottom with more spacing */}
          <div className="flex items-center justify-between mt-12">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">{blog.likes || 0}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {blog.comments?.length || 0}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-primary">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-medium">#1</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

export default TopBlogCard
