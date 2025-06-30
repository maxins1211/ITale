const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const middleware = require('../utils/middleware')

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({})
        .populate("user", { username: 1, name: 1, id: 1 })
        .populate({
            path: "comments",
            populate: { path: "user", select: "username name id" }
        });
    response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
    const id = request.params.id
    const blog = await Blog.findById(id)
        .populate("user", { username: 1, name: 1, id: 1 })
        .populate({
            path: "comments",
            populate: { path: "user", select: "username name id" }
        });
    if (blog) {
        response.json(blog);
    } else {
        response.status(404).json({ error: 'Blog not found' });
    }
});

blogsRouter.post("/", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const { body, user } = request;
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user.id,
        comments: []
    });
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    const addedBlog = await Blog.findById(savedBlog._id)
        .populate("user", { username: 1, name: 1, id: 1 })
        .populate({
            path: "comments",
            populate: { path: "user", select: "username name id" }
        })
    response.status(201).json(addedBlog);
});

blogsRouter.delete("/:id", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const user = request.user;
    const id = request.params.id
    const blog = await Blog.findById(id);
    if (blog.user.toString() === user._id.toString()) {
        // Delete all comments associated with this blog
        await Comment.deleteMany({ blog: id });

        await Blog.findByIdAndDelete(id);
        response.status(204).end()
        user.blogs = user.blogs.filter(blogId => blogId.toString() !== id);
        await user.save();
    }
    else {
        response.status(401).json({ error: "this blog doesn't belong to this user" })
    }
})

blogsRouter.put("/:id", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const id = request.params.id
    const { likes, author, url, title } = request.body;
    const authenticatedUser = request.user;
    const blog = await Blog.findById(id);

    if (!blog) {
        return response.status(404).json({ error: 'Blog not found' })
    }

    if (blog.user.toString() !== authenticatedUser._id.toString()) {
        return response.status(403).json({ error: 'Access denied - you can only update your own blogs' })
    }
    blog.likes = likes
    blog.author = author
    blog.url = url
    blog.title = title
    const updatedBlog = await Blog.findByIdAndUpdate(id, { likes, author, url, title }, { new: true })
        .populate("user", { username: 1, name: 1, id: 1 })
        .populate({
            path: "comments",
            populate: { path: "user", select: "username name id" }
        })
    response.status(200).json(updatedBlog)
})

blogsRouter.put("/:id/like", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const id = request.params.id
    const blog = await Blog.findById(id);

    if (!blog) {
        return response.status(404).json({ error: 'Blog not found' })
    }

    blog.likes = blog.likes + 1
    await blog.save()

    const updatedBlog = await Blog.findById(id)
        .populate("user", { username: 1, name: 1, id: 1 })
        .populate({
            path: "comments",
            populate: { path: "user", select: "username name id" }
        })
    response.status(200).json(updatedBlog)
})

blogsRouter.get("/:id/comments", async (request, response) => {
    const blogId = request.params.id
    const comments = await Comment.find({ blog: blogId })
        .populate("user", { username: 1, name: 1, id: 1 })
        .sort({ createdAt: -1 })
    response.json(comments)
})

blogsRouter.post("/:id/comments", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const { content } = request.body
    const user = request.user
    const blogId = request.params.id

    const blog = await Blog.findById(blogId)
    if (!blog) {
        return response.status(404).json({ error: 'Blog not found' })
    }

    if (!content || content.trim().length === 0) {
        return response.status(400).json({ error: 'Comment content is required' })
    }

    const comment = new Comment({
        content: content.trim(),
        blog: blogId,
        user: user._id
    })

    const savedComment = await comment.save()

    // Add comment to blog's comments array
    blog.comments = blog.comments.concat(savedComment._id)
    await blog.save()

    const populatedComment = await Comment.findById(savedComment._id)
        .populate("user", { username: 1, name: 1, id: 1 })

    response.status(201).json(populatedComment)
})

blogsRouter.put("/comments/:commentId", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const { content } = request.body
    const user = request.user
    const commentId = request.params.commentId

    const comment = await Comment.findById(commentId)
    if (!comment) {
        return response.status(404).json({ error: 'Comment not found' })
    }

    if (comment.user.toString() !== user._id.toString()) {
        return response.status(403).json({ error: 'You can only edit your own comments' })
    }

    if (!content || content.trim().length === 0) {
        return response.status(400).json({ error: 'Comment content is required' })
    }

    comment.content = content.trim()
    const updatedComment = await comment.save()
    const populatedComment = await Comment.findById(updatedComment._id)
        .populate("user", { username: 1, name: 1, id: 1 })

    response.json(populatedComment)
})

// Delete a comment
blogsRouter.delete("/comments/:commentId", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const user = request.user
    const commentId = request.params.commentId

    const comment = await Comment.findById(commentId)
    if (!comment) {
        return response.status(404).json({ error: 'Comment not found' })
    }

    if (comment.user.toString() !== user._id.toString()) {
        return response.status(403).json({ error: 'You can only delete your own comments' })
    }

    // Remove comment from blog's comments array
    const blog = await Blog.findById(comment.blog)
    if (blog) {
        blog.comments = blog.comments.filter(commentId => commentId.toString() !== request.params.commentId)
        await blog.save()
    }

    await Comment.findByIdAndDelete(commentId)
    response.status(204).end()
})
module.exports = blogsRouter;
