import React from 'react'
import PropTypes from 'prop-types'

const Notification = ({ message }) => {
  return (
    <>
      {message && (
        <div className={message.isError ? 'error' : 'message'}>
          {message.content}
        </div>
      )}
    </>
  )
}

Notification.propTypes = {
  message: PropTypes.object,
}
export default Notification
