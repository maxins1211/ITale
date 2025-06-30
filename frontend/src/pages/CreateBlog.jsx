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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      dispatch(
        setNotification({
          content: `A new blog "${variables.title}" added`,
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
    <div>
      <Notification />
      <h2>Create New Blog</h2>
      <CreateBlogForm createBlog={addBlog} />
    </div>
  )
}

export default CreateBlog
