import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Blog from '../components/Blog'
import blogService from '../services/blogs'
import { Button } from '../components/ui/button'
import {
  showSuccessNotification,
  showErrorNotification,
} from '../utils/notifications'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { loginUser, logoutUser } from '../reducers/userReducer'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
const Home = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  const updateBlogMutation = useMutation({
    mutationFn: blogService.increaseLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })
  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const blogs = await blogService.getAll()
      return blogs.sort((a, b) => b.likes - a.likes)
    },
    // enabled: !!user,
  })

  const addLike = async (id) => {
    updateBlogMutation.mutate(id)
  }

  const deleteBlog = async (id) => {
    deleteBlogMutation.mutate(id)
  }
  const blogs = data
  return (
    <div>
      {user && (
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user.name}!
          </p>
          <Link to="/create-blog">
            <Button>Create New Blog</Button>
          </Link>
        </div>
      )}
      <div>
        {blogs &&
          blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              increaseLike={addLike}
              removeBlog={deleteBlog}
              currentUser={user}
            />
          ))}
      </div>
    </div>
  )
}

export default Home
