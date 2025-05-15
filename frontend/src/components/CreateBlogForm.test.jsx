import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'

test('the event handler receive right detail when a new blog is created', async () => {
  const createBlog = vi.fn()
  render(<CreateBlogForm createBlog={createBlog} />)
  const user = userEvent.setup()
  const createButton = screen.getByText('create')
  const inputs = screen.getAllByRole('textbox')
  await user.type(inputs[0], 'not a real title')
  await user.type(inputs[1], 'not a real author')
  await user.type(inputs[2], 'not a real url')
  await user.click(createButton)
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('not a real title')
  expect(createBlog.mock.calls[0][0].author).toBe('not a real author')
  expect(createBlog.mock.calls[0][0].url).toBe('not a real url')
})
