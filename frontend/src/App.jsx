import { useEffect } from 'react'
import Lenis from 'lenis'

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


 return <main className="w-full min-h-screen">
     Hello
 </main>
}
