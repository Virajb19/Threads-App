import { atom } from 'recoil'
import Cookies from 'js-cookie'

export const userAtom = atom({
    key: 'userAtom',
    default: () => {
        const cookie = Cookies.get('jwt') 
        console.log(cookie)
        return cookie ? JSON.parse(cookie) : null
    }
})