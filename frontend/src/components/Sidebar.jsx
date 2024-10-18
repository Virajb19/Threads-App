import { House, Search, Plus, Heart, User, Pin, ChartNoAxesGantt } from 'lucide-react'
import { useMediaQuery } from 'react-responsive'
import { twMerge } from 'tailwind-merge'
import axios from '../config.js'
import { useNavigate } from 'react-router-dom'

export default function Sidebar() {

    const icons = [<House />, <Search />, <Plus />, <Heart />, <User />]

    const isMobile = useMediaQuery({ maxWidth: 640})

    const navigate = useNavigate()

    async function sendRequest(i) {

       if(i != 4) return

       try{
       const res = await axios.get('/api/v1/user/auth-check', {withCredentials: true})
       navigate(`/${res.data.user.username}`)
       } catch(e) {
         console.error(e)
       }
    }

    if(isMobile) {
        return <div className='absolute bottom-0 z-50 flex p-1 gap-2 backdrop-blur-lg justify-around w-full'>
           {icons.map((icon,i) => {
             return <span onClick={() => sendRequest(i)} key={i} className='text-zinc-500 flex-center p-3 rounded-lg w-full cursor-pointer hover:bg-zinc-900 duration-150'>{icon}</span>
           })}
        </div>
    }
         
    return  <div id="sidebar" className="absolute top-0 left-0 flex flex-col p-1 gap-1 text-white w-fit h-screen justify-between">
       <img width={50} className="mt-4" src="https://imgs.search.brave.com/rTqLp49IG2f1b1cKq2vgT8Rswfjt-ZRQ1D6AjteAsTw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YXByb3h5LnNub3Bl/cy5jb20vd2lkdGgv/NjAwL2h0dHBzOi8v/bWVkaWEuc25vcGVz/LmNvbS8yMDIzLzA3/L3RocmVhZHNfbG9n/by5wbmc"/>
      <div id="icons" className="flex flex-col items-center p-1 gap-6">
         {icons.map((icon,i) => {
            return <span onClick={() => sendRequest(i)} key={i} className={twMerge('text-zinc-500 p-3 rounded-lg w-full cursor-pointer', i == 0 && "text-white", i == 2 && "text-zinc-400 bg-zinc-800", i != 2 && "hover:bg-zinc-800 duration-150")}>{icon}</span>
         })}
      </div>
      <div id='icons2' className='flex flex-col p-1 gap-5 items-center mb-3'>
          <span className='text-zinc-500 p-3 rounded-lg w-full cursor-pointer hover:bg-zinc-800 duration-150'><Pin /></span>
          <span className='text-zinc-500 p-3 cursor-pointer hover:text-white duration-100'><ChartNoAxesGantt /></span>
      </div>
    </div>
  
}