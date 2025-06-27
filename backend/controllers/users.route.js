const Blog = require("../models/blog");
const User = require("../models/user")
const usersRouter = require('express').Router()
const bcrypt = require("bcryptjs")

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


module.exports = usersRouter