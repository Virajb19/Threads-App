import { useState } from "react"
import Input from "../components/Input"
import { twMerge } from "tailwind-merge"
import axios from "axios"
import { BACKEND_URL } from "../config"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

export default function SignUpPage() {

    const [username, setUsername] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("") 

    const navigate = useNavigate()

    async function sendRequest() {
       try {
       const res = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {username,email,password}, {withCredentials: true, headers: {"Content-Type": 'application/json'}})
       console.log("Response: ",res)
       } catch(error) {
          console.log("Error: ",error.response.data)
          toast.error(`${error.response.data.msg}`)
       }
    }

    return <main className="bg-black w-full min-h-screen flex-center">
             <img className="absolute top-0 hidden sm:block" src='https://static.cdninstagram.com/rsrc.php/yC/r/jxB9GUOHTf2.webp'/>
             <img width={100} className="absolute top-[10%] sm:hidden" src="https://imgs.search.brave.com/rTqLp49IG2f1b1cKq2vgT8Rswfjt-ZRQ1D6AjteAsTw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YXByb3h5LnNub3Bl/cy5jb20vd2lkdGgv/NjAwL2h0dHBzOi8v/bWVkaWEuc25vcGVz/LmNvbS8yMDIzLzA3/L3RocmVhZHNfbG9n/by5wbmc"/>
             <div className="flex flex-col z-10 p-1 gap-1 w-[30%] mb:w-full tb:w-1/2 items-center">
               <h1 className="text-white text-xl mb:text-lg mb-2 tracking-wider font-semibold">Create an account</h1>
               <div id="inputs" className="flex flex-col w-full items-center gap-2">
                  <Input text="Username" value={username} onChange={e => setUsername(e.target.value)}/>
                  <Input text="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                  <Input text="Password" value={password} onChange={e => setPassword(e.target.value)}/>
                  <button onClick={sendRequest} disabled={(username == "" || email == "" || password == "")} className={twMerge("w-4/5 bg-white rounded-lg p-4 text-lg font-extrabold hover:scale-95", (username == "" || email == "" || password == "") && "cursor-not-allowed bg-gray-400 text-zinc-500")}>Sign up</button>
               </div>
               <a href="/login" className="text-[#777777] text-sm mt-3 tracking-normal">Already have an account ? <span className="text-blue-500 font-medium hover:underline hover:underline-offset-2">Sign in</span></a>
          </div>
        </main>
}