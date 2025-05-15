import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Togglable from './components/Togglable'
import { useDispatch } from 'react-redux'
import {
  setNotification,
  clearNotification,
} from './reducers/notificationReducer'
import { useSelector } from 'react-redux'
import { loginUser, logoutUser } from './reducers/userReducer'
const App = () => {
  const [blogs, setBlogs] = useState([])
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchBlogs = async () => {
      if (user) {
        const newBlogs = await blogService.getAll()
        setBlogs(newBlogs.sort((a, b) => b.likes - a.likes))
      }
    }
    fetchBlogs()
  }, [user])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(loginUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(logoutUser())
  }

  const addBlog = async (blogObject) => {
    const addedBlog = await blogService.addBlog(blogObject)
    const newBlogs = blogs.concat(addedBlog)
    setBlogs(newBlogs)
    dispatch(
      setNotification({
        content: `a new blog ${blogObject.title} added`,
        isError: false,
      }),
    )
    setTimeout(() => dispatch(clearNotification()), 3000)
  }

  const addLike = async (id, blogObject) => {
    const modifiedBlog = await blogService.increaseLike(id, blogObject)
    const newBlogs = blogs.map((blog) => (blog.id === id ? modifiedBlog : blog))
    setBlogs(newBlogs.sort((a, b) => b.likes - a.likes))
  }

  const deleteBlog = async (id) => {
    await blogService.deleteBlog(id)
    setBlogs(blogs.filter((blog) => blog.id !== id))
  }
  return (
    <div>
      {!user ? <h2>Log in to application</h2> : <h2>blogs</h2>}
      <Notification />
      {!user && <LoginForm />}

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

          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              increaseLike={addLike}
              removeBlog={deleteBlog}
              currentUser={user}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
