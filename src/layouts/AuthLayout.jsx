import React from 'react'
import { Outlet } from 'react-router-dom'
import './AuthLayout.css'

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-background">
        <div className="auth-overlay"></div>
        <div className="auth-pattern"></div>
      </div>
      
      <div className="auth-container">
        <div className="auth-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
