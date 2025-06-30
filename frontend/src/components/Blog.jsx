import { useState } from 'react'
import { Link } from 'react-router-dom'

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
    increaseLike(blog.id)
  }

  const deleteBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlog(blog.id)
    }
  }
  return (
    <div className="blog" style={blogStyle}>
      <div className="blog-header">
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> {blog.author}{' '}
        <button onClick={changeVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      <div className="blog-body" style={showWhenVisible}>
        <div
          style={{
            marginBottom: '10px',
            maxHeight: '100px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        <span data-testid="number-of-like">likes {blog.likes}</span>{' '}
        {currentUser && increaseLike && <button onClick={addLike}>like</button>}{' '}
        <br />
        {blog.user.name} <br />
        {currentUser && currentUser.name === blog.user.name && (
          <button onClick={deleteBlog}>remove</button>
        )}
      </div>
    </div>
  )
}

export default Blog
