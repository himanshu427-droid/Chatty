import React, { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import { Routes, Route } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import { useAuthStore } from './store/useAuthStore.js'
import { Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore.js'

const App = () => {
  const {authUser, checkAuth,ischeckingAuth, onlineUsers} = useAuthStore();
  const {theme}  = useThemeStore();

  console.log(onlineUsers)
  
  useEffect(()=>{
    checkAuth();
  },[checkAuth]);

  // console.log({authUser});

  if(ischeckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <span className="loading loading-ring w-16 h-16" ></span>
    </div>
    
  )

  return (
    <div data-theme = {theme}>

    <Navbar/>
    <Routes>
      <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login" />}/>
      <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to="/" /> } />
      <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/" />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/login" />} />
    </Routes>

    <Toaster/>
    </div>
  )
}

export default App