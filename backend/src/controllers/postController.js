import { createPostSchema, replyPostSchema } from "../types/postTypes.js"
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

        res.status(204).json({success: true, msg: 'Post deleted successfully'})
    } catch(e) {
        console.error(e)
        res.status(500).json({success: false, msg: 'Error while deleting the user post'})
    }
}

export async function likeUnlikePost(req,res) {
    try {
    const postId = req.params.id
    if(!postId) return res.status(400).json({success: false, msg: 'Invalid id'})
    
    const post = await prisma.post.findUnique({where: {id: postId}, include: {likes: {where: {userId: req.userId}}}})
    if(!post) return res.status(404).json({success: false, msg: 'Post not found'})

    const isLiked = post.likes?.length > 0

    if(isLiked) {
        await prisma.like.delete({where: {id: post.likes[0].id}})
    } else {
        await prisma.like.create({data: {post: {connect: {id: postId}}, user: {connect: {id: req.userId}}}})
    }

    res.status(201).json({success: true, msg: 'Post liked or unliked successfully', post})
   } catch (e) {
       console.error(e)
       res.status(500).json({success: false, msg: 'Error while liking or unliking a post'})
   }
}

export async function replyToPost(req,res) {
    try {
         const parsedData = replyPostSchema.safeParse(req.body)
         if(!parsedData.success) return res.status(400).json({success: false, msg: 'Invalid inputs', error: parsedData.error})
         const { text, image} = parsedData.data

         const postId = req.params.id
         if(!postId) return res.status(400).json({success: false, msg: 'Invalid Id'}) // THROW AN ERROR
         const post = await prisma.post.findUnique({where: {id: postId}})
         if(!post) return res.status(404).json({success: false, msg: 'Post not found'})

        const reply =  await prisma.reply.create({data: {content: text, image, user: {connect: {id: req.userId}}, post: {connect: {id: postId}}}})

        res.status(201).json({success: true, msg: 'replied to post successfully', reply})

    } catch(e) {
        console.error(e)
        res.status(500).json({success: false, msg: 'replied to post successfully', post})
    }
}

export async function deleteReply(req,res) {
    try {
         const replyId = req.params.id
         if(!replyId) throw new Error('Error : invalid Id')

        const reply = await prisma.reply.findUnique({where: {id: replyId}, include: {user: true}})
        if(!reply) return res.status(404).json({success: false, msg: 'Reply not found'})
        // const { user } = reply
        if(req.userId !== reply.user.id) return res.status(403).json({success: false, msg: 'You cannot delete someone else reply'})

        await prisma.reply.delete({where: {id: replyId}})

        res.status(200).json({success: true, msg: 'reply deleted successfully'})
    } catch(e) {
        console.error(e)
        res.status(500).json({success: false, msg: 'Error while deleting reply'})
    }
}

export async function getFeedPosts(req,res) {
    try {
        const userId = req.userId
        const user = await prisma.user.findUnique({where: {id: userId}})
        if(!user) return res.status(404).json({success: false, msg: 'User not found'})
        // userId: { in: user.following.map(followingUser => followingUser.id) }
        const feedposts = await prisma.post.findMany({where: {userId: {in: user.following}}, orderBy: {createdAt: 'desc'}})
        if(feedposts.length == 0) return res.status(404).json({success: false, msg: 'No posts found'})
        
        res.status(200).json({success: true, msg: 'Posts fetched successfully', feedposts})
    } catch(e) {
        console.error(e)
        res.status(500).json({success: false, msg: 'Error while getting feed posts'})
    }
}
