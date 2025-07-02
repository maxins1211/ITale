
const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true }, // Keep author field but auto-populate
    content: { type: String, required: true },
    coverImage: { type: String }, // URL/path to the cover image
    likes: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {
    timestamps: true
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        if (returnedObject._id) {
            returnedObject.id = returnedObject._id.toString()
        }
        delete returnedObject._id
        delete returnedObject.__v
    }
})
const Blog = mongoose.model('Blog', blogSchema)


module.exports = Blog