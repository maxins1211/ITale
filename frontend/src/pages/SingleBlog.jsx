import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import blogService from '../services/blogs'
import { formatTimeAgo, formatDate } from '../utils/dateUtils'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import {
  Heart,
  Edit,
  Trash2,
  MessageCircle,
  Calendar,
  User,
  ArrowLeft,
} from 'lucide-react'

const SingleBlog = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [newComment, setNewComment] = useState('')
  const [editingComment, setEditingComment] = useState(null)
  const [editContent, setEditContent] = useState('')
  const user = useSelector((state) => state.user)
  const queryClient = useQueryClient()

  const {
    data: blog,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogService.getById(id),
    enabled: !!id,
  })

  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => blogService.getComments(id),
    enabled: !!id && (!blog || !blog.comments), // Only fetch if blog doesn't have comments populated
  })

  // Use comments from blog object if available, otherwise fall back to separate query
  const blogComments = blog?.comments || comments
  const isCommentsLoading = isLoading || (commentsLoading && !blog?.comments)

  const addCommentMutation = useMutation({
    mutationFn: ({ blogId, content }) =>
      blogService.addComment(blogId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] })
      queryClient.invalidateQueries({ queryKey: ['blog', id] })
      setNewComment('')
    },
  })

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }) =>
      blogService.updateComment(commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] })
      queryClient.invalidateQueries({ queryKey: ['blog', id] })
      setEditingComment(null)
      setEditContent('')
    },
  })

  const deleteCommentMutation = useMutation({
    mutationFn: blogService.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] })
      queryClient.invalidateQueries({ queryKey: ['blog', id] })
    },
  })

  const likeBlogMutation = useMutation({
    mutationFn: blogService.increaseLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', id] })
    },
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      navigate('/')
    },
  })

  const handleAddComment = (e) => {
    e.preventDefault()
    if (newComment.trim() && user) {
      addCommentMutation.mutate({ blogId: id, content: newComment })
    }
  }

  const handleEditComment = (comment) => {
    setEditingComment(comment.id)
    setEditContent(comment.content)
  }

  const handleUpdateComment = (e) => {
    e.preventDefault()
    if (editContent.trim() && editingComment) {
      updateCommentMutation.mutate({
        commentId: editingComment,
        content: editContent,
      })
    }
  }

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteCommentMutation.mutate(commentId)
    }
  }

  const handleLikeBlog = () => {
    if (user) {
      likeBlogMutation.mutate(id)
    }
  }

  const handleDeleteBlog = () => {
    if (
      window.confirm(
        `Are you sure you want to delete the blog "${blog.title}"?`,
      )
    ) {
      deleteBlogMutation.mutate(id)
    }
  }

  const cancelEdit = () => {
    setEditingComment(null)
    setEditContent('')
  }

  if (isLoading)
    return (
      <div className="min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-muted-foreground">
                Loading blog...
              </div>
            </div>
          </div>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-red-600">
                  Error loading blog: {error.message}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )

  if (!blog)
    return (
      <div className="min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">
                  Blog not found
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stories
          </Button>

          {/* Blog Content Card - Combined */}
          <Card>
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Blog Title */}
                <h1 className="text-4xl font-bold text-foreground leading-tight">
                  {blog.title}
                </h1>

                {/* Author and Date Info */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {blog.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">
                        {blog.user?.name}
                      </p>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span title={formatDate(blog.createdAt)}>
                          {formatTimeAgo(blog.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Blog Stats */}
                  <div className="flex items-center space-x-4">
                    <Badge
                      variant="secondary"
                      className="flex items-center space-x-1"
                    >
                      <Heart className="w-4 h-4" />
                      <span>{blog.likes || 0}</span>
                    </Badge>
                    <Badge
                      variant="outline"
                      className="flex items-center space-x-1"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{blogComments.length}</span>
                    </Badge>
                  </div>
                </div>

                {/* Blog Author Controls */}
                {user &&
                  (user.username === blog.user.username || user.isAdmin) && (
                    <div className="flex space-x-3 pt-4 border-t">
                      {(user.username === blog.user.username ||
                        user.isAdmin) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/blogs/${id}/edit`)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          {user.isAdmin && user.username !== blog.user.username
                            ? 'Edit Blog (Admin)'
                            : 'Edit Blog'}
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteBlog}
                        disabled={deleteBlogMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {deleteBlogMutation.isPending
                          ? 'Deleting...'
                          : user.isAdmin && user.username !== blog.user.username
                            ? 'Delete Blog (Admin)'
                            : 'Delete Blog'}
                      </Button>
                    </div>
                  )}

                {/* Cover Image */}
                {blog.coverImage && (
                  <div className="pt-4">
                    <img
                      src={blog.coverImage}
                      alt="Blog cover"
                      className="w-full object-cover"
                    />
                  </div>
                )}

                {/* Blog Content */}
                <div className="pt-4">
                  <div
                    className="prose prose-lg max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments and Like Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Comments ({blogComments.length})</span>
                </div>
                {/* Like Button */}
                {user ? (
                  <Button
                    onClick={handleLikeBlog}
                    disabled={likeBlogMutation.isPending}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Heart className="w-4 h-4" />
                    <span>
                      {likeBlogMutation.isPending
                        ? 'Liking...'
                        : `${blog.likes || 0}`}
                    </span>
                  </Button>
                ) : (
                  <Badge
                    variant="secondary"
                    className="flex items-center space-x-1"
                  >
                    <Heart className="w-4 h-4" />
                    <span>{blog.likes || 0}</span>
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Comment Form */}
              {user ? (
                <form onSubmit={handleAddComment} className="space-y-4">
                  <div>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      rows="3"
                      className="w-full p-3 border border-input bg-background text-foreground rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={
                      !newComment.trim() || addCommentMutation.isPending
                    }
                    size="sm"
                  >
                    {addCommentMutation.isPending ? 'Adding...' : 'Add Comment'}
                  </Button>
                </form>
              ) : (
                <Card>
                  <CardContent className="p-4">
                    <p className="text-center text-muted-foreground">
                      Please{' '}
                      <Link
                        to="/login"
                        className="text-primary hover:underline font-medium"
                      >
                        log in
                      </Link>{' '}
                      to comment or like this post.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Comments List */}
              {isCommentsLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading comments...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {blogComments.length === 0 ? (
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">
                          No comments yet. Be the first to comment!
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    blogComments.map((comment) => (
                      <Card key={comment.id}>
                        <CardContent className="p-4">
                          {editingComment === comment.id ? (
                            // Edit form
                            <form
                              onSubmit={handleUpdateComment}
                              className="space-y-3"
                            >
                              <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows="3"
                                className="w-full p-3 border border-input bg-background text-foreground rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
                              />
                              <div className="flex space-x-2">
                                <Button
                                  type="submit"
                                  disabled={
                                    !editContent.trim() ||
                                    updateCommentMutation.isPending
                                  }
                                  size="sm"
                                >
                                  {updateCommentMutation.isPending
                                    ? 'Updating...'
                                    : 'Update'}
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={cancelEdit}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </form>
                          ) : (
                            // Display comment
                            <div className="space-y-3">
                              <p className="text-foreground">
                                {comment.content}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="w-6 h-6">
                                    <AvatarFallback className="text-xs">
                                      {comment.user.name
                                        ?.charAt(0)
                                        ?.toUpperCase() || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="text-sm text-muted-foreground">
                                    <span className="font-medium">
                                      {comment.user.name}
                                    </span>
                                    <span className="mx-1">•</span>
                                    <span title={formatDate(comment.createdAt)}>
                                      {formatTimeAgo(comment.createdAt)}
                                    </span>
                                  </div>
                                </div>
                                {user &&
                                  (user.username === comment.user.username ||
                                    user.isAdmin) && (
                                    <div className="flex space-x-2">
                                      {user.username ===
                                        comment.user.username && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            handleEditComment(comment)
                                          }
                                        >
                                          <Edit className="w-3 h-3 mr-1" />
                                          Edit
                                        </Button>
                                      )}
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleDeleteComment(comment.id)
                                        }
                                        disabled={
                                          deleteCommentMutation.isPending
                                        }
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="w-3 h-3 mr-1" />
                                        {deleteCommentMutation.isPending
                                          ? 'Deleting...'
                                          : user.isAdmin &&
                                              user.username !==
                                                comment.user.username
                                            ? 'Delete (Admin)'
                                            : 'Delete'}
                                      </Button>
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SingleBlog
