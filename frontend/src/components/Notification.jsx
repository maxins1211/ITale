import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertCircle } from 'lucide-react'

const Notification = () => {
  const message = useSelector((state) => state.notification)

  if (!message) return null

  return (
    <div className="fixed top-4 right-4 z-50 w-96">
      <Alert variant={message.isError ? 'destructive' : 'default'}>
        {message.isError ? (
          <AlertCircle className="h-4 w-4" />
        ) : (
          <CheckCircle className="h-4 w-4" />
        )}
        <AlertDescription>{message.content}</AlertDescription>
      </Alert>
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.object,
}
export default Notification
