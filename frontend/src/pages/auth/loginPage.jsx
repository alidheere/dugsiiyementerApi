import React from 'react'
import RegisterForm from '../../components/auth/RegisterForm'
import LoginForm from '../../components/auth/LoginForm'

const LoginPage = () => {
  return (
 <div className="min-h-screen flex flex-col items-center justify-center bg-background relative">

  {/* Background gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-secondary to-secondary/20 opacity-50" />

  {/* Content */}
  <div className="relative z-10 w-full max-w-md px-4">
    
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-foreground">
        Welcome back!
      </h1>

      <p className="text-muted-foreground">
        We're glad to see you again
      </p>
      {/* registerform */}
      <LoginForm/>
    </div>

  </div>

</div>

  )
}

export default LoginPage