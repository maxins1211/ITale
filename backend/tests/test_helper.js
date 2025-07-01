const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [{
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    content: "<p>This blog discusses React patterns and best practices for modern React development.</p>",
    likes: 7,
    __v: 0
},
{
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    content: "<p>A classic paper discussing the problems with goto statements in programming languages.</p>",
    likes: 5,
    __v: 0
},]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb, usersInDb
}