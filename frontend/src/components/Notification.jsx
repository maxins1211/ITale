import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
const Notification = () => {
  const message = useSelector((state) => state.notification)
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
