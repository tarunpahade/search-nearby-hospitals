'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import axios from "axios"

export default function LoginPage() {
  const router = useRouter()
  const [user, setUser] = useState({
    password: "",
    email: ''
  })

  const [forgetPassword, setForgetPassword] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setButtonDisabled(!(user.email.length > 0 && user.password.length > 0))
  }, [user])

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await axios.post("/api/users/login", user)
      // const response = await axios.post('https://hapi.fhir.org/auth/login', {
      //   username: user.email,
      //   password: user.password,
      // });
      // const response = await axios.post('https://hapi.fhir.org/baseR4/Patient', {
      //   resourceType: 'Patient',
      //   name: [{ use: 'official', family: 'Doe', given: user.email }],
      // });

      // Handle successful login (you might want to store token/session)
      console.log(res.data);

      
      
      router.push("/dashboard")
    } catch (error) {
      console.log("Login Failed", error)
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await axios.post('/api/users/forgotpassword', { email: user.email })
      if (res.data.message === 'Mail sent to Your email') {
        setIsSuccess(true)
      } else if (res.data.error === 'User not found') {
        setError('User not found')
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {forgetPassword ? "Forgot Password" : "Login"}
        </h1>
        <form onSubmit={forgetPassword ? sendEmail : onLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                         focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="Enter your email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
          </div>
          {!forgetPassword && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                           focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                placeholder="Enter your password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                required
              />
            </div>
          )}
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          {isSuccess && (
            <p className="text-green-500 text-sm mt-2">Mail sent to your email</p>
          )}
          <button
            type="submit"
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${
              buttonDisabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={buttonDisabled || loading}
          >
            {loading ? 'Loading...' : forgetPassword ? 'Send Reset Link' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-center">
          {forgetPassword ? (
            <button
              onClick={() => setForgetPassword(false)}
              className="text-sm text-sky-600 hover:text-sky-500"
            >
              Back to Login
            </button>
          ) : (
            <>
              <button
                onClick={() => setForgetPassword(true)}
                className="text-sm text-sky-600 hover:text-sky-500"
              >
                Forgot Password?
              </button>
              <span className="mx-2">|</span>
              <Link href="/signup" className="text-sm text-sky-600 hover:text-sky-500">
                Create an account
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}