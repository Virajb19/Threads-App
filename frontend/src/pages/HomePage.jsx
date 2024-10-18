import posts from '../../data.js'
import Sidebar from '../components/Sidebar.jsx'

export default function HomePage() {

    return <main className="relative w-full h-screen flex justify-center">
               <Sidebar />
            <div id='posts' className='flex flex-col p-1 gap-1 w-[45%] text-white bg-[#252424] rounded-tl-3xl rounded-tr-3xl mt-20 overflow-auto'>
                 {posts.map((post,i) => {
                    return <div key={i} className='p-1'>
                         <div className='flex p-1 gap-2 w-fit items-center'>
                          <img width={40} className='rounded-full' src={post.userImage}/>
                          <h3 className='text-sm tracking-wider'>{post.username}</h3>
                        </div>
                        <div id='text' className='text-[0.8rem] text-left'>
                           {post.content}
                        </div>  
                        <img width={200} className='rounded-md' src='https://imgs.search.brave.com/yFLPbMIn1BcTxuf2Sqm0lzSzvXIsfTju2QOAnbQ-buk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAwLzQzLzkwLzM3/LzM2MF9GXzQzOTAz/NzMyX1gxWjJnenk0/OTdhaXNnTUU2MmNy/bVUwMFNmOHNtUDU5/LmpwZw'/>
                    </div>
                 })}
            </div>
        </main>
}