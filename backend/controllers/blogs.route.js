const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require('../utils/middleware')

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1, id: 1 });
    response.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
    const { body, user } = request;
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user.id
    });
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    const addedBlog = await Blog.findById(savedBlog._id).populate("user", { username: 1, name: 1, id: 1 })
    response.status(201).json(addedBlog);
});

blogsRouter.delete("/:id", middleware.userExtractor, async (request, response) => {
    const user = request.user;
    const id = request.params.id
    const blog = await Blog.findById(id);
    if (blog.user.toString() === user._id.toString()) {
        await Blog.findByIdAndDelete(id);
        response.status(204).end()
        user.blogs = user.blogs.filter(blogId => blogId.toString() !== id);
        await user.save();
    }
    else {
        response.status(401).json({ error: "this blog doesn't belong to this user" })
    }
})

blogsRouter.put("/:id", async (request, response) => {
    const id = request.params.id
    const { user, likes, author, url, title } = request.body;
    const blog = await Blog.findById(id);
    if (!blog || blog.user.toString() !== user) {
        response.status(404).end()
    }
    blog.likes = likes
    blog.author = author
    blog.url = url
    blog.title = title
    const updatedBlog = await Blog.findByIdAndUpdate(id, { likes, author, url, title }, { new: true }).populate("user", { username: 1, name: 1, id: 1 })
    response.status(200).json(updatedBlog)
})
module.exports = blogsRouter;
