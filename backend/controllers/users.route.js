const Blog = require("../models/blog");
const User = require("../models/user")
const usersRouter = require('express').Router()
const bcrypt = require("bcryptjs")
const middleware = require('../utils/middleware')

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body
    if (!password || password.length < 3) {
        return response.status(400).json({ error: 'password length must be at least 3 characters long' })
    }
    const checkUser = await User.findOne({ username });
    console.log(checkUser);
    if (checkUser) {
        return response.status(400).json({ error: 'username already existed' })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate("blogs", { url: 1, title: 1, author: 1, id: 1 })
    response.json(users)
})

// Delete user 
usersRouter.delete('/:id', middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const currentUser = request.user
    const targetUserId = request.params.id

    if (!currentUser.isAdmin) {
        return response.status(403).json({ error: 'Only admins can delete users' })
    }

    const targetUser = await User.findById(targetUserId)
    if (!targetUser) {
        return response.status(404).json({ error: 'User not found' })
    }

    if (targetUser._id.toString() === currentUser._id.toString()) {
        return response.status(400).json({ error: 'Cannot delete yourself' })
    }

    await Blog.deleteMany({ user: targetUserId })

    await User.findByIdAndDelete(targetUserId)

    response.json({ message: `User ${targetUser.username} and all their blogs have been deleted` })
})


module.exports = usersRouter