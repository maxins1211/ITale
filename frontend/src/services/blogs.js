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

const addBlog = async (blogObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = await axios.post(baseUrl, blogObject, config)
  return request.data
}

const increaseLike = async (id, blogObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const url = baseUrl + `/${id}`
  const request = await axios.put(url, blogObject, config)
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
export default { getAll, setToken, addBlog, increaseLike, deleteBlog }
