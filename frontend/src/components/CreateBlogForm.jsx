import React from 'react'
import { useState } from 'react'
import PropTypes from 'prop-types'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import ImageUpload from './ImageUpload'

const CreateBlogForm = (props) => {
  const { createBlog } = props
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    coverImage: '',
  })

  const handleImageUpload = (imageUrl) => {
    setNewBlog({ ...newBlog, coverImage: imageUrl })
  }

  const addBlog = (e) => {
    e.preventDefault()
    createBlog({
      title: newBlog.title,
      content: newBlog.content,
      coverImage: newBlog.coverImage,
    })
    setNewBlog({ title: '', content: '', coverImage: '' })
  }
  return (
    <div>
      <h2>Create new</h2>
      <form action="" onSubmit={addBlog}>
        <div style={{ marginBottom: '10px' }}>
          <label>Title:</label>
          <input
            type="text"
            value={newBlog.title}
            data-testid="blog-title"
            onChange={(e) => {
              setNewBlog({ ...newBlog, title: e.target.value })
            }}
            style={{ width: '100%', padding: '5px', marginTop: '5px' }}
            required
          />
        </div>

        <ImageUpload onUploadComplete={handleImageUpload} />

        <div style={{ marginBottom: '10px' }}>
          <label>Content:</label>
          <ReactQuill
            value={newBlog.content}
            onChange={(content) => setNewBlog({ ...newBlog, content })}
            data-testid="blog-content"
            style={{ marginTop: '5px' }}
            theme="snow"
          />
        </div>

        <button
          type="submit"
          style={{ marginTop: '10px', padding: '10px 20px' }}
        >
          Create
        </button>
      </form>
    </div>
  )
}

CreateBlogForm.prototype = {
  createBlog: PropTypes.func.isRequired,
}
export default CreateBlogForm
