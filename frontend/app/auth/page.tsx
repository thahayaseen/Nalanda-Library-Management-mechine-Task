'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function AuthPage() {
  const { login, register,user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })

  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const clearErrors = () => {
    setErrors({})
  }

  const handleApiError = (error: any) => {
    console.log(error);
    
    if (error.details && typeof error.details === 'object') {
      // Handle field-specific errors
      setErrors(error.details)
      
      // Show a general toast for the main error
      toast({
        title: "Validation Error",
        description: error.error || "Please check the form for errors",
        variant: "destructive",
      })
    } else {
      // Handle general errors
      setErrors({})
      toast({
        title: "Error",
        description: error.response.data.error||error.message || error.error || "An error occurred",
        variant: "destructive",
      })
    }
  }

  const validatePassword = (password: string): string[] => {
    const errors = []
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long")
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must contain at least one lowercase letter")
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must contain at least one uppercase letter")
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("Password must contain at least one number")
    }
    if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?])/.test(password)) {
      errors.push("Password must contain at least one special character")
    }
    return errors
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    clearErrors()
    setLoading(true)

    try {
      await login(loginForm.email, loginForm.password)
      toast({
        title: "Success",
        description: "Logged in successfully!",
      })
      console.log(user?.role,user,'datata');
      
      if(user?.role=='admin'){

        router.push('/admin')
      }else{
        router.push('/')

      }
    } catch (error: any) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    clearErrors()
    
    // Client-side validation
    const newErrors: {[key: string]: string} = {}
    
    if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    
    const passwordErrors = validatePassword(registerForm.password)
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors[0] // Show first error
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast({
        title: "Validation Error",
        description: "Please fix the errors below",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await register(registerForm.username, registerForm.email, registerForm.password)
      toast({
        title: "Success",
        description: "Account created successfully!",
      })
      router.push('/')
    } catch (error: any) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (formType: 'login' | 'register', field: string, value: string) => {
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    if (formType === 'login') {
      setLoginForm(prev => ({ ...prev, [field]: value }))
    } else {
      setRegisterForm(prev => ({ ...prev, [field]: value }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to LibraryHub
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account or create a new one
          </p>
        </div>

        <Card>
          <Tabs defaultValue="login" className="w-full" onValueChange={clearErrors}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => handleInputChange('login', 'email', e.target.value)}
                      className={errors.email ? 'border-red-500 focus:border-red-500' : ''}
                      required
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => handleInputChange('login', 'password', e.target.value)}
                      className={errors.password ? 'border-red-500 focus:border-red-500' : ''}
                      required
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                 
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent value="register">
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>
                  Create a new account to start borrowing books
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="register-username">Username</Label>
                    <Input
                      id="register-username"
                      type="text"
                      value={registerForm.username}
                      onChange={(e) => handleInputChange('register', 'username', e.target.value)}
                      className={errors.username ? 'border-red-500 focus:border-red-500' : ''}
                      required
                    />
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => handleInputChange('register', 'email', e.target.value)}
                      className={errors.email ? 'border-red-500 focus:border-red-500' : ''}
                      required
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerForm.password}
                      onChange={(e) => handleInputChange('register', 'password', e.target.value)}
                      className={errors.password ? 'border-red-500 focus:border-red-500' : ''}
                      required
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                    
                    {/* Password requirements hint */}
                    <div className="mt-2">
                      <Alert className="bg-blue-50 border-blue-200">
                        <AlertDescription className="text-xs text-blue-700">
                          Password must be at least 8 characters and include: uppercase, lowercase, number, and special character
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="register-confirm-password">Confirm Password</Label>
                    <Input
                      id="register-confirm-password"
                      type="password"
                      value={registerForm.confirmPassword}
                      onChange={(e) => handleInputChange('register', 'confirmPassword', e.target.value)}
                      className={errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}
                      required
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}