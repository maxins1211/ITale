import loginService from '../services/login'
import blogService from '../services/blogs'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../reducers/userReducer'
import {
  clearNotification,
  setNotification,
} from '../reducers/notificationReducer'
import { useNavigate } from 'react-router-dom'
const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(loginUser(user))
      setUsername('')
      setPassword('')
      dispatch(
        setNotification({ content: 'Login successfully', isError: false }),
      )
      setTimeout(() => dispatch(clearNotification()), 3000)
      navigate('/')
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
  return (
    <div>
      <form action="" onSubmit={handleLogin}>
        <label>username</label>{' '}
        <input
          type="text"
          data-testid="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />{' '}
        <br />
        <label>password</label>{' '}
        <input
          type="password"
          name=""
          data-testid="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />{' '}
        <br />
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
