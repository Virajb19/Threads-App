import axios from 'axios'
import { motion } from 'framer-motion'
import { BACKEND_URL } from '../config'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export default function LogoutButton() {

   const navigate = useNavigate() // res.redirect

    return <motion.button onClick={async () => {
        try {   
          const res = await axios.post(`${BACKEND_URL}/api/v1/user/signout`, null, {withCredentials: true})
          toast.success(res.data.msg)
          navigate('/login')
    } catch (e) {
        toast.error(e.response?.data?.error || "Log out failed")
    }
    }} whileHover={{scale: 1.04}} whileTap={{scale: 0.95}} 
    className="absolute top-5 right-5 z-[100] px-3 py-2 font-semibold rounded-2xl text-black bg-white">
              Log out
        </motion.button>
}