import React from 'react'
import { useState } from 'react'
import PropTypes from 'prop-types'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import ImageUpload from './ImageUpload'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent } from './ui/card'

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
    <Card>
      <CardContent className="p-6">
        <form onSubmit={addBlog} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              value={newBlog.title}
              data-testid="blog-title"
              onChange={(e) => {
                setNewBlog({ ...newBlog, title: e.target.value })
              }}
              placeholder="Enter your blog title..."
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Cover Image</Label>
            <ImageUpload onUploadComplete={handleImageUpload} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <div className="prose-editor">
              <ReactQuill
                value={newBlog.content}
                onChange={(content) => setNewBlog({ ...newBlog, content })}
                data-testid="blog-content"
                theme="snow"
                placeholder="Share your story..."
                className="bg-background"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Create Blog
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

CreateBlogForm.prototype = {
  createBlog: PropTypes.func.isRequired,
}
export default CreateBlogForm
