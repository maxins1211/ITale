import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from './reducers/userReducer'
import blogService from './services/blogs'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import SingleBlog from './pages/SingleBlog'
import CreateBlog from './pages/CreateBlog'
import EditBlog from './pages/EditBlog'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(loginUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  const padding = {
    padding: 5,
  }
  return (
    <Router>
      <div>
        <Link style={padding} to="/">
          Home
        </Link>
        <Link style={padding} to="/login">
          Login
        </Link>
        <Link style={padding} to="/signup">
          SignUp
        </Link>
        <Link style={padding} to="/create-blog">
          Create Blog
        </Link>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/blogs/:id" element={<SingleBlog />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/blogs/:id/edit" element={<EditBlog />} />
      </Routes>
    </Router>
  )
}

export default App
