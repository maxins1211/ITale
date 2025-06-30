import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import blogService from '../services/blogs'

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

  if (isLoading) return <div>Loading blog...</div>
  if (error) return <div>Error loading blog: {error.message}</div>
  if (!blog) return <div>Blog not found</div>

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>
        <strong>Author:</strong> {blog.author}
      </p>
      <div style={{ marginBottom: '15px' }}>
        <strong>Content:</strong>
        <div
          style={{
            marginTop: '10px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            minHeight: '100px',
          }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
      <p>
        <strong>Likes:</strong> {blog.likes}
        {user && (
          <button
            onClick={handleLikeBlog}
            disabled={likeBlogMutation.isPending}
            style={{ marginLeft: '10px' }}
          >
            {likeBlogMutation.isPending ? 'Liking...' : '👍 Like'}
          </button>
        )}
      </p>
      <p>
        <strong>Added by:</strong> {blog.user?.name}
      </p>

      {/* Blog Author Controls */}
      {user && user.username === blog.user.username && (
        <div style={{ marginTop: '15px', marginBottom: '15px' }}>
          <button
            onClick={() => navigate(`/blogs/${id}/edit`)}
            style={{ marginRight: '10px' }}
          >
            Edit Blog
          </button>
          <button
            onClick={handleDeleteBlog}
            disabled={deleteBlogMutation.isPending}
            style={{ color: 'red', marginRight: '10px' }}
          >
            {deleteBlogMutation.isPending ? 'Deleting...' : 'Delete Blog'}
          </button>
        </div>
      )}

      {/* Comments Section */}
      <div style={{ marginTop: '30px' }}>
        <h3>Comments</h3>

        {/* Add Comment Form */}
        {user ? (
          <form onSubmit={handleAddComment} style={{ marginBottom: '20px' }}>
            <div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows="3"
                style={{ width: '100%', marginBottom: '10px' }}
              />
            </div>
            <button
              type="submit"
              disabled={!newComment.trim() || addCommentMutation.isPending}
            >
              {addCommentMutation.isPending ? 'Adding...' : 'Add Comment'}
            </button>
          </form>
        ) : (
          <p>Please log in to comment</p>
        )}

        {/* Comments List */}
        {isCommentsLoading ? (
          <p>Loading comments...</p>
        ) : (
          <div>
            {blogComments.length === 0 ? (
              <p>No comments yet</p>
            ) : (
              blogComments.map((comment) => {
                return (
                  <div
                    key={comment.id}
                    style={{
                      border: '1px solid #ccc',
                      padding: '10px',
                      marginBottom: '10px',
                      borderRadius: '5px',
                    }}
                  >
                    {editingComment === comment.id ? (
                      // Edit form
                      <form
                        onSubmit={handleUpdateComment}
                        style={{ marginTop: '10px' }}
                      >
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows="3"
                          style={{ width: '100%', marginBottom: '10px' }}
                        />
                        <button
                          type="submit"
                          disabled={
                            !editContent.trim() ||
                            updateCommentMutation.isPending
                          }
                        >
                          {updateCommentMutation.isPending
                            ? 'Updating...'
                            : 'Update'}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          style={{ marginLeft: '10px' }}
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      // Display comment
                      <div>
                        <p>{comment.content}</p>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <small>
                            By {comment.user.name} on{' '}
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </small>
                          {user && user.username === comment.user.username && (
                            <div>
                              <button
                                onClick={() => handleEditComment(comment)}
                                style={{
                                  marginRight: '10px',
                                  fontSize: '12px',
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                disabled={deleteCommentMutation.isPending}
                                style={{ fontSize: '12px', color: 'red' }}
                              >
                                {deleteCommentMutation.isPending
                                  ? 'Deleting...'
                                  : 'Delete'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SingleBlog
