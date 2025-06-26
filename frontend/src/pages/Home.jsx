import { useEffect } from 'react'
import Blog from '../components/Blog'
import blogService from '../services/blogs'
import Notification from '../components/Notification'
import CreateBlogForm from '../components/CreateBlogForm'
import Togglable from '../components/Togglable'
import { useDispatch } from 'react-redux'
import {
  setNotification,
  clearNotification,
} from '../reducers/notificationReducer'
import { useSelector } from 'react-redux'
import { loginUser, logoutUser } from '../reducers/userReducer'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
const Home = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const newBlogMutation = useMutation({
    mutationFn: blogService.addBlog,
    onSuccess: (data, variables) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(data))
      dispatch(
        setNotification({
          content: `a new blog ${variables.title} added`,
          isError: false,
        }),
      )
      setTimeout(() => dispatch(clearNotification()), 3000)
    },
  })

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
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(loginUser(user))
      blogService.setToken(user.token)
    }
  }, [])
  const { data, isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const blogs = await blogService.getAll()
      return blogs.sort((a, b) => b.likes - a.likes)
    },
    // enabled: !!user,
  })

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(logoutUser())
  }

  const addBlog = async (blogObject) => {
    newBlogMutation.mutate(blogObject)
  }

  const addLike = async (id, blogObject) => {
    updateBlogMutation.mutate({ id, blogObject })
  }

  const deleteBlog = async (id) => {
    deleteBlogMutation.mutate(id)
  }
  const blogs = data
  return (
    <div>
      <Notification />
      {user && (
        <div>
          <div>
            {' '}
            <span>{user.name} logged in</span>
            <button onClick={handleLogout}>log out</button>
          </div>
          <br />
          <Togglable buttonLabel="new blog">
            <CreateBlogForm createBlog={addBlog} />
          </Togglable>
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
