import { createPostSchema } from "../types/postTypes.js"
import { prisma } from "../utils/db.js"

export async function createPost(req,res) {
    try {
        const parsedData = createPostSchema.safeParse(req.body)
        if(!parsedData.success) return res.status(400).json({success: false, msg: 'Invalid inputs'})
        const {content, image} = parsedData.data

        const user = await prisma.user.findFirst({where: {id: req.userId}})
        if(!user) return res.status(404).json({success: false, msg: 'User not found'})
        
        await prisma.post.create({data: {content, imageUrl: image, user: {connect: {id: user.id}}}})
        res.status(201).json({success: true, msg: 'Post created successfully'})
    } catch(e) {
        console.error(e)
        res.status(500).json({success: false, msg: 'Error while creating a post'})
    }
}

export async function getUserPosts(req,res) {
    try {
       const id = req.params.id
       if(!id || isNaN(id)) return res.status(400).json({success: false, msg: 'Invalid id'})
       const userId = parseInt(id)

       const user = await prisma.user.findUnique({where: {id: userId}, include: {posts: true}})
       if(!user) return res.status(404).json({success: false, msg: 'User not found'})

       res.status(200).json({success: true, msg: 'user posts fetched successfully', posts: user.posts})
    } catch(e) {
        console.error(e)
        res.status(500).json({success: false, msg: 'Error while getting user posts'})
    }
}

export async function getPost(req,res) {
    try {
        const id = req.params.id
        if(!id) return res.status(400).json({success: false, msg: 'Invalid id'})

        const post = await prisma.post.findUnique({where: {id}})
        if(!post) return res.status(404).json({success: false, msg: 'Post not found'})

        res.status(200).json({success: true, msg: 'post fetched successfully', post})
    } catch(e) {
        console.error(e)
        res.status(500).json({success: false, msg: 'Error while getting a post'})
    }
}
export async function deletePost(req,res) {
    try {
        const postId = req.params.id
        if(!postId) return res.status(400).json({success: false, msg: 'Invalid Post id'})
        
        const post = await prisma.post.findUnique({where: {id: postId}})
        if(!post) return res.status(404).json({success: false, msg: 'Post not found'})
            
        if(post.userId !== req.userId) return res.status(403).json({success: false, msg: 'You cannot delete someone else post'})
        await prisma.post.delete({where: {id: postId}})

        res.status(200).json({success: true, msg: 'Post deleted successfully'})
    } catch(e) {
        console.error(e)
        res.status(500).json({success: false, msg: 'Error while deleting the user post'})
    }
}