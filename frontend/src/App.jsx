import { useEffect } from 'react'
import Lenis from 'lenis'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'

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

 return <main className="w-full">
    
   <BrowserRouter>
     <Routes>
        <Route path='/login' element={<LoginPage />}></Route>
     </Routes>
   </BrowserRouter>

 </main>
}
