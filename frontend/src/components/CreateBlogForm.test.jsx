import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'

test('the event handler receive right detail when a new blog is created', async () => {
  const createBlog = vi.fn()
  render(<CreateBlogForm createBlog={createBlog} />)
  const user = userEvent.setup()
  const createButton = screen.getByText('Create')
  const titleInput = screen.getByLabelText('Title:')

  await user.type(titleInput, 'not a real title')

  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  const formData = createBlog.mock.calls[0][0]
  expect(formData).toBeInstanceOf(FormData)
})
