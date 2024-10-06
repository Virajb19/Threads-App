import { useState } from "react"
import { twMerge } from "tailwind-merge"
import { ChevronRight } from 'lucide-react';
import axios from "axios";
import { BACKEND_URL } from '../config.js'
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")  
  
  const navigate = useNavigate()

    return <main className="relative w-full min-h-screen bg-black flex-center">
      <img className="absolute top-0 hidden sm:block" src='https://static.cdninstagram.com/rsrc.php/yC/r/jxB9GUOHTf2.webp'/>
      <img width={100} className="absolute top-[10%] sm:hidden" src="https://imgs.search.brave.com/rTqLp49IG2f1b1cKq2vgT8Rswfjt-ZRQ1D6AjteAsTw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YXByb3h5LnNub3Bl/cy5jb20vd2lkdGgv/NjAwL2h0dHBzOi8v/bWVkaWEuc25vcGVz/LmNvbS8yMDIzLzA3/L3RocmVhZHNfbG9n/by5wbmc"/>
        <div className="flex flex-col z-10 p-1 gap-1 w-[30%] mb:w-full tb:w-1/2 items-center">
          <h1 className="text-white text-xl mb:text-lg mb-2">Log in with your Instagram account</h1>
          <div className="flex flex-col w-full items-center gap-2">
          <Input text="email" value={email} onChange={e => setEmail(e.target.value)}/>
          <Input text="Password" value={password} onChange={e => setPassword(e.target.value)}/>
          <button onClick={async () => {
            const res = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {email, password},{withCredentials : true})
            console.log(res)
            navigate('/')
          }} className={twMerge("w-4/5 bg-white rounded-lg p-4 text-lg font-extrabold", (email == "" || password == "") && "cursor-not-allowed text-gray-400")}>Log in</button>
          </div>
          <a href="/forgot-password" className="text-[#777777] text-sm mt-3 tracking-wider">Forgot Password ?</a>
          <div className="flex p-1 gap-5 items-center w-3/4 justify-around mt-4">
               <div className="grow w-10 h-[0.05rem] bg-zinc-600"></div>
               <h3 className="text-gray-600 text-sm">Or</h3>
               <div className="grow w-10 h-[0.05rem] bg-zinc-600"></div>
          </div>
          <div className="flex p-5 mb:p-3 tb:p-3 gap-1 text-white items-center border rounded-xl w-4/5 mb:w-[90%] justify-between mt-5">
                <img width={50} src="https://imgs.search.brave.com/sNTKp2mTf9wCBQjEmpUUkixC-kJI_5g3cCB_vqqnpHw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG40/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvc29jaWFsLW1l/c3NhZ2luZy11aS1j/b2xvci1zaGFwZXMt/Mi1mcmVlLzEyOC9z/b2NpYWwtaW5zdGFn/cmFtLW5ldy1zcXVh/cmUyLTEyOC5wbmc"/>
                <p className="text-lg mb:text-sm tb:text-c-xs font-bold">Continue with Instagram</p>
                <span><ChevronRight /></span>
          </div>
        </div>
        </main>
}

function Input({text,value,onChange}) {
  return <input value={value} onChange={onChange} className="bg-[#1E1E1E] p-4 rounded-lg text-base focus:outline-none text-white w-4/5 border-2 border-transparent focus:border-gray-500" type={text == "email" ? "text" : "password"} placeholder={text}/>
}