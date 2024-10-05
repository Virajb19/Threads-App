import { useState } from "react"
import { twMerge } from "tailwind-merge"

export default function LoginPage() {
  
  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")   

    return <main className="relative w-full min-h-screen bg-black flex-center">
      <img className="absolute top-0 hidden sm:block" src='https://static.cdninstagram.com/rsrc.php/yC/r/jxB9GUOHTf2.webp'/>
      <img width={100} className="absolute top-[10%] sm:hidden" src="https://imgs.search.brave.com/rTqLp49IG2f1b1cKq2vgT8Rswfjt-ZRQ1D6AjteAsTw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YXByb3h5LnNub3Bl/cy5jb20vd2lkdGgv/NjAwL2h0dHBzOi8v/bWVkaWEuc25vcGVz/LmNvbS8yMDIzLzA3/L3RocmVhZHNfbG9n/by5wbmc"/>
        <div className="flex flex-col p-1 gap-1 w-[30%] items-center">
          <h1 className="text-white text-xl mb-2">Log in with your Instagram account</h1>
          <div className="flex flex-col w-full items-center gap-2">
          <Input text="Username" value={username} onChange={e => setUsername(e.target.value)}/>
          <Input text="Password" value={password} onChange={e => setPassword(e.target.value)}/>
          <button className={twMerge("w-4/5 bg-white rounded-lg p-4 text-lg font-extrabold", username.length === 0 || password.length === 0 && "cursor-not-allowed text-gray-500")}>Log in</button>
          </div>
          <a href="/forgot-password" className="text-[#777777] text-sm mt-3 tracking-wider">Forgot Password ?</a>
        </div>
        </main>
}

function Input({text,value,onChange}) {
  return <input value={value} onChange={onChange} className="bg-[#1E1E1E] z-10 p-4 rounded-lg text-base focus:outline-none text-white w-4/5 border-2 border-transparent focus:border-gray-500" type={text == "Username" ? "text" : "password"} placeholder={text}/>
}