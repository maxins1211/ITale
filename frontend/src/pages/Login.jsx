import LoginForm from '../components/LoginForm'
import Notification from '../components/Notification'

const Login = () => {
  return (
    <div>
      <Notification />
      <h2>Log in to application</h2>
      <LoginForm />
    </div>
  )
}

export default Login
