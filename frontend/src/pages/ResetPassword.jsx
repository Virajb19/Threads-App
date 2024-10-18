import { useState } from "react";
import Input from "../components/Input";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

export default function ResetPassword() {

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    return <main className="w-full min-h-screen flex-center">
             <img className="absolute top-0 hidden sm:block" src='https://static.cdninstagram.com/rsrc.php/yC/r/jxB9GUOHTf2.webp'/>
             <img width={100} className="absolute top-[10%] sm:hidden" src="https://imgs.search.brave.com/rTqLp49IG2f1b1cKq2vgT8Rswfjt-ZRQ1D6AjteAsTw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YXByb3h5LnNub3Bl/cy5jb20vd2lkdGgv/NjAwL2h0dHBzOi8v/bWVkaWEuc25vcGVz/LmNvbS8yMDIzLzA3/L3RocmVhZHNfbG9n/by5wbmc"/>
             <div className="flex flex-col z-10 px-1 py-4 gap-3 w-[30%] mb:w-full tb:w-1/2 items-center border rounded-xl">
                   <h3 className="text-white tracking-wide mb:text-xl">Enter new Password</h3>
                   <Input text="Password" onChange={e => setPassword(e.target.value)}/>
                   <Input text="Confirm Password" onChange={e => setConfirmPassword(e.target.value)}/>
                   <motion.button disabled={(password === "" || confirmPassword === "")} whileHover={{scale: 1.07}} whileTap={{scale: 0.95}} className={twMerge("bg-white text-black py-2 px-4 font-bold rounded-full", (password === "" || confirmPassword === "") && "cursor-not-allowed bg-gray-400 text-zinc-500")}>Change password</motion.button>
             </div>
        </main>
}