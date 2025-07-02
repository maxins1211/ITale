import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  showSuccessNotification,
  showErrorNotification,
} from '../utils/notifications'
import userService from '../services/users'

const Signup = () => {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordsMatch, setPasswordsMatch] = useState(true)

  const navigate = useNavigate()

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
      showErrorNotification('Passwords do not match')
      return
    }

    try {
      const user = await userService.signup({ username, name, password })
      if (user) {
        showSuccessNotification('Sign up successful! Please log in.')
        navigate('/login')
      }
    } catch (exception) {
      showErrorNotification(exception.response?.data?.error || 'Sign up failed')
    }
  }

  return (
    <div>
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
