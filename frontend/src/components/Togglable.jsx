import React, { useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => {
    setVisible(!visible)
  }
  return (
    <div>
      {!visible && (
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      )}
      {visible && (
        <>
          {props.children}
          <button onClick={toggleVisibility}>cancel</button>
        </>
      )}
    </div>
  )
}

export default Togglable
