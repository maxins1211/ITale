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

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
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
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      dispatch(
        setNotification({ content: 'Login successfully', isError: false }),
      )
      setTimeout(() => dispatch(clearNotification()), 3000)
    } catch (exception) {
      dispatch(
        setNotification({
          content: 'Wrong username or password',
          isError: true,
        }),
      )
      setTimeout(() => dispatch(clearNotification()), 3000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
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
      {!user && (
        <LoginForm
          username={username}
          handleLogin={handleLogin}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      )}

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
