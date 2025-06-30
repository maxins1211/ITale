import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import blogService from '../services/blogs'

const SingleBlog = () => {
  const { id } = useParams()

  const {
    data: blog,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogService.getById(id),
    enabled: !!id,
  })

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
    </div>
  )
}

export default SingleBlog
