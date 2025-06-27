import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Notification from '../components/Notification'
import { useDispatch } from 'react-redux'
import {
  setNotification,
  clearNotification,
} from '../reducers/notificationReducer'
import userService from '../services/users'

const Signup = () => {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordsMatch, setPasswordsMatch] = useState(true)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    setPasswordsMatch(e.target.value === confirmPassword)
  }

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value)
    setPasswordsMatch(password === e.target.value)
  }

  const handleSignup = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      dispatch(
        setNotification({
          content: 'Passwords do not match',
          isError: true,
        }),
      )
      setTimeout(() => dispatch(clearNotification()), 3000)
      return
    }

    try {
      const user = await userService.signup({ username, name, password })
      if (user) {
        dispatch(
          setNotification({
            content: 'Sign up successful! Please log in.',
            isError: false,
          }),
        )
        setTimeout(() => dispatch(clearNotification()), 3000)
        navigate('/login')
      }
    } catch (exception) {
      dispatch(
        setNotification({
          content: exception.response?.data?.error || 'Sign up failed',
          isError: true,
        }),
      )
      setTimeout(() => dispatch(clearNotification()), 3000)
    }
  }

  return (
    <div>
      <Notification />
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
        <label>name</label>{' '}
        <input
          type="text"
          data-testid="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />{' '}
        <br />
        <label>username</label>{' '}
        <input
          type="text"
          data-testid="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />{' '}
        <br />
        <label>password</label>{' '}
        <input
          type="password"
          data-testid="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />{' '}
        <br />
        <label>confirm password </label>
        <input
          type="password"
          data-testid="confirm-password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          required
        />{' '}
        {!passwordsMatch && confirmPassword && (
          <span style={{ color: 'red' }}>Passwords don't match</span>
        )}
        <br />
        <button type="submit">Signup</button>
      </form>
    </div>
  )
}

export default Signup
