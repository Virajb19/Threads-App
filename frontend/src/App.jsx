import { useEffect, useLayoutEffect, useState } from 'react'
import Lenis from 'lenis'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import UserPage from './pages/UserPage'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LogoutButton from './components/LogoutButton'
import axios from './config.js'

export default function App(){
    
      useEffect(() => {
        const lenis = new Lenis({duration: 1.5, smooth: true, infinite: false})
        function raf(time) {
          lenis.raf(time)
          requestAnimationFrame(raf)
        } 
        requestAnimationFrame(raf)
        return () => lenis.destroy()
   }, [])

   const [isLoggedIn,setIsLoggedIn] = useState(false)
   const location = useLocation()
   const ROUTES = ['/login', '/signup', '/verify-email']
    
       useLayoutEffect(() => {

        //  const controller = new AbortController()

        //  try {
        //   axios.get('/api/v1/user/auth-check', {withCredentials: true})
        //   .then(res => {
        //      if(res.data.isLoggedIn) {
        //           setIsLoggedIn(true)
        //      } else setIsLoggedIn(false)
        //   })
        // } catch(error) {
        //   console.error(error)
        //   setIsLoggedIn(false)
        // }
       },[])

  //  console.log(Cookies.get("jwt"))

 return <main className="relative w-full bg-black">

   <ToastContainer position='top-center' />
    
     <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={isLoggedIn ? <Navigate to={'/'}/> : <LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/verify-email' element={<VerifyEmail />}/>
        <Route path='/forgot-password' element={<ForgotPassword />}/>
        <Route path='/reset-password/:token' element={<ResetPassword />}/>
        <Route path='/:username' element={<UserPage />}/>
     </Routes>

    {!ROUTES.includes(location.pathname) && <LogoutButton />}
 </main>
}
