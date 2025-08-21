
import { useState } from "react"
import LoginForm from "../components/auth/LoginForm"
import RegisterForm from "../components/auth/RegisterForm"
import { Handshake, HeadphonesIcon, HelpCircle, LogIn, UserPlus } from "lucide-react"

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-10 items-center">
        
        <div className="flex items-center flex-col justify-center space-y-4 px-6 md:px-0">
          <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 shadow-md">
            <Handshake className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Support System</h1>
          <p className="text-lg text-gray-600">
            Professional customer support management
          </p>
        </div>

        <div className="flex items-center justify-center px-6 md:px-0">
          <div className="w-full max-w-md bg-white rounded-2xl  p-8 ">
            {isLogin ? (
              <div className="space-y-6">
                <LoginForm onToggle={() => setIsLogin(false)} />
                <button
                  onClick={() => setIsLogin(false)}
                  className="flex items-center justify-center w-full text-sm text-indigo-500 hover:text-indigo-900 font-medium gap-2"
                >
                  <UserPlus className="h-4 w-4" /> Create a new account
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <RegisterForm onToggle={() => setIsLogin(true)} />
                <button
                  onClick={() => setIsLogin(true)}
                  className="flex items-center justify-center w-full text-sm text-indigo-500 hover:text-indigo-900 font-medium gap-2"
                >
                  <LogIn className="h-4 w-4" /> Already have an account? Log in
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
