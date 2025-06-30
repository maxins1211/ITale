import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import blogService from '../services/blogs'

const SingleBlog = () => {
  const { id } = useParams()
  const [newComment, setNewComment] = useState('')
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
    enabled: !!id,
  })

  const addCommentMutation = useMutation({
    mutationFn: ({ blogId, content }) =>
      blogService.addComment(blogId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] })
      setNewComment('')
    },
  })

  const handleAddComment = (e) => {
    e.preventDefault()
    if (newComment.trim() && user) {
      addCommentMutation.mutate({ blogId: id, content: newComment })
    }
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
      <p>
        <strong>URL:</strong>{' '}
        <a href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </a>
      </p>
      <p>
        <strong>Likes:</strong> {blog.likes}
      </p>
      <p>
        <strong>Added by:</strong> {blog.user?.name}
      </p>

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
        {commentsLoading ? (
          <p>Loading comments...</p>
        ) : (
          <div>
            {comments.length === 0 ? (
              <p>No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '5px',
                  }}
                >
                  <p>{comment.content}</p>
                  <small>
                    By {comment.user.name} on{' '}
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </small>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SingleBlog
