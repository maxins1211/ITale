import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}
const getAll = async () => {
  const config = {
    headers: { Authorization: token },
  }
  const request = await axios.get(baseUrl, config)
  return request.data
}

const getById = async (id) => {
  const request = await axios.get(`${baseUrl}/${id}`)
  return request.data
}

const addBlog = async (blogData) => {
  const config = {
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
  }
  const request = await axios.post(baseUrl, blogData, config)
  return request.data
}

const increaseLike = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const url = baseUrl + `/${id}/like`
  const request = await axios.put(url, {}, config)
  return request.data
}

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const url = baseUrl + `/${id}`
  const request = await axios.delete(url, config)
  return request.data
}

const updateBlog = async (id, blogData) => {
  const config = {
    headers: { Authorization: token },
  }
  const url = baseUrl + `/${id}`
  const request = await axios.put(url, blogData, config)
  return request.data
}

const updateBlogWithImage = async (id, formData) => {
  const config = {
    headers: {
      Authorization: token,
      'Content-Type': 'multipart/form-data'
    },
  }
  const url = baseUrl + `/${id}`
  const request = await axios.put(url, formData, config)
  return request.data
}

const getComments = async (blogId) => {
  const request = await axios.get(`${baseUrl}/${blogId}/comments`)
  return request.data
}

const addComment = async (blogId, content) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = await axios.post(`${baseUrl}/${blogId}/comments`, { content }, config)
  return request.data
}

const updateComment = async (commentId, content) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = await axios.put(`${baseUrl}/comments/${commentId}`, { content }, config)
  return request.data
}

const deleteComment = async (commentId) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = await axios.delete(`${baseUrl}/comments/${commentId}`, config)
  return request.data
}

export default { getAll, getById, setToken, addBlog, increaseLike, deleteBlog, updateBlog, updateBlogWithImage, getComments, addComment, updateComment, deleteComment }
