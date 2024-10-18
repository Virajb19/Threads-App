import { useState } from "react";
import Input from "../components/Input";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { BACKEND_URL } from "../config";

export default function ForgotPassword() {

   const [email,setEmail] = useState("")

    return <main className="w-full min-h-screen flex-center">
             <img className="absolute top-0 hidden sm:block" src='https://static.cdninstagram.com/rsrc.php/yC/r/jxB9GUOHTf2.webp'/>
             <img width={100} className="absolute top-[10%] sm:hidden" src="https://imgs.search.brave.com/rTqLp49IG2f1b1cKq2vgT8Rswfjt-ZRQ1D6AjteAsTw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YXByb3h5LnNub3Bl/cy5jb20vd2lkdGgv/NjAwL2h0dHBzOi8v/bWVkaWEuc25vcGVz/LmNvbS8yMDIzLzA3/L3RocmVhZHNfbG9n/by5wbmc"/>
             <div className="flex flex-col items-center px-1 py-5 gap-5 w-[30%] mb:w-[90%] tb:w-1/2 border border-gray-600 rounded-xl">
                  <h3 className="text-white tracking-wide">Enter your email</h3>
                  <Input text="email" value={email} onChange={e => setEmail(e.target.value)}/>
                  <motion.button onClick={async () => {
                    const res = await axios.post(`${BACKEND_URL}/api/v1/user/forgot-password`, {email}, {withCredentials: true})
                    console.log(res)
                  }} disabled={email === ""} whileHover={{scale: 1.07}} whileTap={{scale: 0.95}} className={twMerge("text-black bg-white py-1 px-3 text-lg font-bold rounded-full", email === "" && "cursor-not-allowed bg-gray-400 text-zinc-500")}>Send mail</motion.button>
             </div>
        </main>
}