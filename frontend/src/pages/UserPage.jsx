import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "../config.js";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from 'framer-motion'
import { CircleEllipsis, Flashlight } from 'lucide-react';
import Modal from "../components/Modal.jsx";

export default function UserPage() {

   const { username } =  useParams()
   const [user,setUser] = useState(null)
   const [showModal, setShowModal] = useState(false)

    useEffect(() => {
         try {
              axios.get(`/api/v1/user/profile/${username}`, {withCredentials: true})
              .then(res => setUser(res.data.user))
         } catch(error) {
              toast.error(error?.response?.data?.msg)
         }
    }, [username])

    return <main className="relative w-full h-screen flex justify-center">
             <Sidebar />
             <div id="user" className="relative flex flex-col p-2 gap-1 w-[45%] mb:w-full text-white bg-[#252424] rounded-tl-3xl rounded-tr-3xl mb:rounded-none mt-20 overflow-auto">
                 <div className="flex p-1 gap-5 justify-between text-left">
                     <div id="name" className="flex flex-col w-fit">
                         <h3 className="font-semibold">{user?.name}</h3>
                         <span>{user?.username}</span>
                     </div>
                       <img width={70} height={70} className="rounded-full object-cover" src={user?.profilePicture}/>
                 </div>
                 <p id="bio" className="text-base max-w-xs">{user?.bio || "write something into bio"}</p>
                 <div id="followers+edit" className="flex p-1 justify-between">
                 <span className="w-fit p-1 text-sm text-zinc-500">{user?.followers.length}{user?.followers.length > 1 ? " followers" : " follower"}</span>
                 <motion.button onClick={() => setShowModal(true)} whileTap={{scale: 0.9}} className="px-2 py-1 rounded-full bg-white text-black font-semibold">Edit</motion.button>
                 </div>
             </div>
             {showModal && <Modal image={user?.profilePicture} onClose={() => setShowModal(false)}/>}
        </main>
}