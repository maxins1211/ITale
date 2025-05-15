import { useState } from 'react'

const Blog = ({ blog, increaseLike, removeBlog, currentUser }) => {
  const [visible, setVisible] = useState(false)
  const changeVisibility = () => {
    setVisible(!visible)
  }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const addLike = () => {
    increaseLike(blog.id, {
      user: blog.user.id,
      author: blog.author,
      title: blog.title,
      url: blog.url,
      likes: ++blog.likes,
    })
  }

  const deleteBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlog(blog.id)
    }
  }
  return (
    <div className="blog" style={blogStyle}>
      <div className="blog-header">
        {blog.title} {blog.author}{' '}
        <button onClick={changeVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      <div className="blog-body" style={showWhenVisible}>
        {blog.url} <br />
        <span data-testid="number-of-like">likes {blog.likes}</span>{' '}
        <button onClick={addLike}>like</button> <br />
        {blog.user.name} <br />
        {currentUser.name === blog.user.name && (
          <button onClick={deleteBlog}>remove</button>
        )}
      </div>
    </div>
  )
}

export default Blog
