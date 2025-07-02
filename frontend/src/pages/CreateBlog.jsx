import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import CreateBlogForm from '../components/CreateBlogForm'
import Notification from '../components/Notification'
import blogService from '../services/blogs'
import {
  setNotification,
  clearNotification,
} from '../reducers/notificationReducer'
const CreateBlog = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const queryClient = useQueryClient()

  if (!user) {
    navigate('/login')
    return null
  }

  const newBlogMutation = useMutation({
    mutationFn: blogService.addBlog,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      dispatch(
        setNotification({
          content: `A new blog "${data.title}" added`,
          isError: false,
        }),
      )
      setTimeout(() => dispatch(clearNotification()), 3000)
      navigate('/')
    },
    onError: (error) => {
      dispatch(
        setNotification({
          content: `Failed to create blog: ${error.response?.data?.error || error.message}`,
          isError: true,
        }),
      )
      setTimeout(() => dispatch(clearNotification()), 3000)
    },
  })

  const addBlog = async (blogObject) => {
    newBlogMutation.mutate(blogObject)
  }

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Notification />
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            Create New Blog
          </h1>
          <CreateBlogForm createBlog={addBlog} />
        </div>
      </div>
    </div>
  )
}

export default CreateBlog
