import React from 'react'
import { useState } from 'react'
import PropTypes from 'prop-types'
const CreateBlogForm = (props) => {
  const { createBlog } = props
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const addBlog = (e) => {
    e.preventDefault()
    createBlog(newBlog)
    setNewBlog({ title: '', author: '', url: '' })
  }
  return (
    <div>
      <h2>Create new</h2>
      <form action="" onSubmit={addBlog}>
        <label>title:</label>
        <input
          type="text"
          value={newBlog.title}
          data-testid="blog-title"
          onChange={(e) => {
            setNewBlog({ ...newBlog, title: e.target.value })
          }}
        />
        <br />
        <label>author:</label>
        <input
          type="text"
          value={newBlog.author}
          data-testid="blog-author"
          onChange={(e) => {
            setNewBlog({ ...newBlog, author: e.target.value })
          }}
        />
        <br />
        <label>url:</label>
        <input
          type="text"
          value={newBlog.url}
          data-testid="blog-url"
          onChange={(e) => {
            setNewBlog({ ...newBlog, url: e.target.value })
          }}
        />
        <br />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

CreateBlogForm.prototype = {
  createBlog: PropTypes.func.isRequired,
}
export default CreateBlogForm
