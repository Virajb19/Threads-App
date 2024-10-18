import { useCallback, useEffect, useRef, useState } from "react"
import { motion } from 'framer-motion'
import { twMerge } from "tailwind-merge"
import axios from "axios"
import { BACKEND_URL } from "../config"

export default function VerifyEmail() {

   const inputRefs = useRef([])
   const buttonRef = useRef(null)
   const [code,setCode] = useState(new Array(6).fill(""))

   useEffect(() => {
       inputRefs.current[0].focus()
   }, [])

   useEffect(() => {
      if(code.every(d => d != "")) buttonRef.current.click()
   },[code])

   const handleOnInput = useCallback((e,i) => {
    let value = e.target.value
     if(/^\d$/.test(value)){
        setCode(prevCode => {
            const newCode = [...prevCode]
            newCode[i] = value
            return newCode
        })  
        
        if(i < 5) inputRefs.current[i + 1].focus()

     } else e.target.value = ""

     if(value.length === 6) {
        const pastedCode = value.slice(0,6).split('')
        setCode(pastedCode) 

        const lastIdx = pastedCode.findLastIndex(d => d != "")
        inputRefs.current[lastIdx].focus()
     }

   }, []) 

   const handleKeyUp = useCallback((e,i) => {
    if(e.key === 'Backspace') {
        setCode(prevCode => {
            const newCode = [...prevCode]
            newCode[i] = ""
            return newCode
        })
        
        if(i > 0) inputRefs.current[i - 1].focus()

     }
   }, [code])

   const handleKeyDown = useCallback((e,i) => {
       if(e.key === 'ArrowLeft' && i > 0) inputRefs.current[i - 1].focus()
       else if(e.key === 'ArrowRight' && i < 5) inputRefs.current[i + 1].focus()
   }, [])  

    return <main className="w-full min-h-screen flex-center">
             <img className="absolute top-0 hidden sm:block" src='https://static.cdninstagram.com/rsrc.php/yC/r/jxB9GUOHTf2.webp'/>
             <img width={100} className="absolute top-[10%] sm:hidden" src="https://imgs.search.brave.com/rTqLp49IG2f1b1cKq2vgT8Rswfjt-ZRQ1D6AjteAsTw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YXByb3h5LnNub3Bl/cy5jb20vd2lkdGgv/NjAwL2h0dHBzOi8v/bWVkaWEuc25vcGVz/LmNvbS8yMDIzLzA3/L3RocmVhZHNfbG9n/by5wbmc"/>
            <div className="flex flex-col z-10 px-1 py-5 gap-5 w-[30%] mb:w-[90%] tb:w-1/2 items-center border rounded-xl">
                 <h3 className="text-white tracking-wide mb:text-2xl lp:text-4xl font-semibold">Verify the code</h3>
                 <div className="flex p-1 gap-2 tb:gap-4 lp:gap-3">
                 {code.map((digit,i) => {
                    return <input value={digit} onKeyDown={e => handleKeyDown(e,i)} onKeyUp={e => handleKeyUp(e,i)} onInput={e => handleOnInput(e,i)} ref={el => inputRefs.current[i] = el} key={i} 
                    className="size-10 text-center font-bold text-white text-lg lp:text-xl lp:size-14 border-2 border-gray-500 focus:border-blue-500 duration-100 bg-transparent focus:outline-none rounded-xl" />
                 })}
                 </div> 
                <motion.button ref={buttonRef} onClick={async () => {
                    if(code.every(d => d != "")) {
                    try {
                    const res = axios.post(`${BACKEND_URL}/api/v1/user/verify-email`, {code: code.join('')})
                    console.log(res)
                    } catch(e) {
                        console.error(e)
                    }
                    }
                }} disabled={code.some(d => d === "")} whileHover={{scale: 1.07}} whileTap={{scale: 0.95}} 
                className={twMerge("text-black bg-white rounded-full px-4 py-2 font-bold transition-colors", code.some(d => d === "") && "cursor-not-allowed bg-gray-400 text-zinc-500")}>Verify Email</motion.button>
            </div>
        </main>
}