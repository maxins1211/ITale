import { SignupForm } from '../components/signup-form'

const Signup = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center w-full px-4 py-8">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  )
}

export default Signup
