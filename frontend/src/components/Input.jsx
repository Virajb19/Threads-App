import { useState } from "react"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"

export default function Input({text,value,onChange}) {

    function handleKeyDown(e) {
        if(e.key === 'ArrowDown') {
            console.log('Key pressed')
        }
    }

    const [showPassword, setShowPassword] = useState(false)

    return <div className="relative flex gap-1 items-center justify-center w-full">
    <input onKeyDown={handleKeyDown} value={value} onChange={onChange} 
    className="bg-[#1E1E1E] p-4 rounded-lg text-base focus:outline-none text-white w-4/5 border-2 border-transparent focus:border-blue-600" 
    type={text.includes('Password') ? (showPassword ? "text" : "password") : "text"} placeholder={text} />
    {text.includes('Password') && <span onClick={() => setShowPassword(!showPassword)} className="absolute cursor-pointer rounded-lg text-white text-xl right-14 mb:right-12 tb:right-[13%] p-3 hover:bg-zinc-700 duration-200">{showPassword ? <FaRegEyeSlash />: <FaRegEye />}</span>}
    </div>
  }