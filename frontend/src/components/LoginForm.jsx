import React from 'react'

const LoginForm = (props) => {
  const { handleLogin, username, setUsername, password, setPassword } = props
  return (
    <div>
      <form action="" onSubmit={handleLogin}>
        <label>username</label>{' '}
        <input
          type="text"
          data-testid="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />{' '}
        <br />
        <label>password</label>{' '}
        <input
          type="password"
          name=""
          data-testid="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />{' '}
        <br />
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
