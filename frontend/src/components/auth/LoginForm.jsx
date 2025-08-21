
import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../ui/Button"
import Input from "../ui/Input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card"

const LoginForm = ({ onToggle }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()

  const handleSubmit = async (e) => {
     e.preventDefault()
    setLoading(true)
    setError("")

    const result = await login(email, password)

    if (result.success) {
      const { role } = result.user
      if (role === "ADMIN") {
        navigate("/admin")
      } else if (role === "CUSTOMER") {
        navigate("/tickets")
      } else if (role === "AGENT") {
        navigate("/agent")
      } else {
        navigate("/") // fallback
      }
    } else {
      setError(result.error || "Login failed")
    }

    setLoading(false)

  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-800" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* <div className="mt-4 text-center">
          <button type="button" onClick={onToggle} className="text-sm text-primary hover:underline">
            Don't have an account? Sign up
          </button>
        </div> */}
      </CardContent>
    </Card>
  )
}

export default LoginForm
