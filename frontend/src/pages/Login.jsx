import { LoginForm } from '../components/login-form'

const Login = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center w-full px-4 py-8">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}

export default Login
