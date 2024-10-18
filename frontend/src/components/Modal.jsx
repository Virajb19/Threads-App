import { useRef, useState } from "react"
import { X } from 'lucide-react'

export default function Modal({image, onClose}) {

    const modalRef = useRef(null)

    const [bio, setBio] = useState("")
    const [name,setName] = useState("")

    return <main ref={modalRef} onClick={e => { if(e.target === modalRef.current) onClose() }} className="fixed flex-center w-full min-h-screen backdrop-blur-sm">
           <span onClick={onClose} className="absolute top-24 left-[65%] text-white p-2 rounded-full cursor-pointer hover:bg-red-500 duration-200"><X width={30} height={30}/></span>
              <div className="bg-zinc-900 p-3 w-[30%] text-white rounded-lg">
                <h3 className="font-bold uppercase text-4xl text-center">User Profile Edit</h3>
                <span>User icon</span>
                <div className="flex p-1 gap-7 items-center">
                    <img className="rounded-full" width={100} src={image}/>
                    <button className="p-2 grow rounded-lg bg-[#3D4757] hover:scale-105 duration-100">Change profile picture</button>
                </div> 
                <div className="flex flex-col p-1 gap-2">
                    <h3 className="text-2xl font-semibold tracking-wide uppercase">Enter new name</h3>
                    <input onInput={e => setName(e.target.value)} className="py-2 border border-gray-500 px-3 focus:outline-none focus:ring-2 focus:ring-gray-400 duration-100 rounded-lg bg-[#2D3646]" type="text" placeholder="enter you name" />
                </div>
                <div className="flex flex-col p-1 gap-2">
                    <h3 className="text-2xl font-semibold tracking-wide uppercase">Enter new bio</h3>
                    <textarea onInput={e => setBio(e.target.value)} className="focus:outline-none scrollbar-none overflow-y-auto resize-none border-gray-500 focus:ring-2 focus:ring-gray-400 duration-100 bg-[#2D3646] rounded-xl p-2" placeholder="Enter your bio..."/>
                </div>
                <div id="buttons" className="flex justify-around p-1 gap-7 mt-3">
                     <button onClick={onClose} className="basis-1/2 rounded-xl py-2 bg-red-500 font-semibold hover:scale-105 duration-100">Cancel</button>
                     <button className="basis-1/2 rounded-xl py-2 bg-blue-600 font-semibold hover:scale-105 duration-100">Submit</button>
                </div>
              </div>
        </main>
}

