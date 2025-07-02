import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import Notification from '../components/Notification'
import ImageUpload from '../components/ImageUpload'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
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

  if (isLoading)
    return (
      <div className="min-h-[calc(100vh-8rem)]">
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
      <div className="min-h-[calc(100vh-8rem)]">
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
      <div className="min-h-[calc(100vh-8rem)]">
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
    <div className="min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Notification />
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Edit Blog</h1>
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your blog title..."
                    className="w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <ImageUpload onUploadComplete={handleImageUpload} />
                  {currentCoverImage && !newCoverImage && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Current cover image:
                      </p>
                      <img
                        src={currentCoverImage}
                        alt="Current cover"
                        className="max-w-sm h-32 object-cover border"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <div className="prose-editor">
                    <ReactQuill
                      value={content}
                      onChange={setContent}
                      theme="snow"
                      placeholder="Share your story..."
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/blogs/${id}`)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateBlogMutation.isPending}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {updateBlogMutation.isPending
                      ? 'Updating...'
                      : 'Update Blog'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default EditBlog
