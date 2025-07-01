import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import Notification from '../components/Notification'
import ImageUpload from '../components/ImageUpload'
import blogService from '../services/blogs'
import {
  setNotification,
  clearNotification,
} from '../reducers/notificationReducer'

const EditBlog = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const queryClient = useQueryClient()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [newCoverImage, setNewCoverImage] = useState('')
  const [currentCoverImage, setCurrentCoverImage] = useState('')

  // Fetch the blog to edit
  const {
    data: blog,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogService.getById(id),
    enabled: !!id,
  })

  // Fill form when blog data is loaded
  useEffect(() => {
    if (blog) {
      setTitle(blog.title || '')
      setContent(blog.content || '')
      setCurrentCoverImage(blog.coverImage || '')
    }
  }, [blog])

  // Redirect if not logged in
  if (!user) {
    navigate('/login')
    return null
  }

  // Redirect if not the blog owner
  if (blog && user.username !== blog.user?.username) {
    navigate(`/blogs/${id}`)
    return null
  }

  const updateBlogMutation = useMutation({
    mutationFn: ({ id, blogData }) => {
      return blogService.updateBlog(id, blogData)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog', id] })
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      dispatch(
        setNotification({
          content: `Blog "${data.title}" updated successfully`,
          isError: false,
        }),
      )
      setTimeout(() => dispatch(clearNotification()), 3000)
      navigate(`/blogs/${id}`)
    },
    onError: (error) => {
      dispatch(
        setNotification({
          content: `Failed to update blog: ${error.response?.data?.error || error.message}`,
          isError: true,
        }),
      )
      setTimeout(() => dispatch(clearNotification()), 3000)
    },
  })

  const handleImageUpload = (imageUrl) => {
    setNewCoverImage(imageUrl)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      dispatch(
        setNotification({
          content: 'Title and content are required',
          isError: true,
        }),
      )
      setTimeout(() => dispatch(clearNotification()), 3000)
      return
    }

    const blogData = {
      title: title.trim(),
      content: content.trim(),
      likes: blog.likes,
      coverImage: newCoverImage || currentCoverImage, // Use new image or keep current
    }

    updateBlogMutation.mutate({
      id,
      blogData,
    })
  }

  if (isLoading) return <div>Loading blog...</div>
  if (error) return <div>Error loading blog: {error.message}</div>
  if (!blog) return <div>Blog not found</div>

  return (
    <div>
      <Notification />
      <h2>Edit Blog</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: '100%', padding: '5px', marginTop: '5px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Upload New Cover Image:</label>
          <ImageUpload onUploadComplete={handleImageUpload} />
          {currentCoverImage && !newCoverImage && (
            <div style={{ marginTop: '10px' }}>
              <p>Current cover image:</p>
              <img
                src={currentCoverImage}
                alt="Current cover"
                style={{
                  maxWidth: '200px',
                  maxHeight: '150px',
                  objectFit: 'cover',
                }}
              />
            </div>
          )}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            Content:
            <ReactQuill
              value={content}
              onChange={setContent}
              style={{ marginTop: '5px' }}
              theme="snow"
            />
          </label>
        </div>

        <div style={{ marginTop: '20px' }}>
          <button
            type="submit"
            disabled={updateBlogMutation.isPending}
            style={{ marginRight: '10px' }}
          >
            {updateBlogMutation.isPending ? 'Updating...' : 'Update Blog'}
          </button>
          <button type="button" onClick={() => navigate(`/blogs/${id}`)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditBlog
