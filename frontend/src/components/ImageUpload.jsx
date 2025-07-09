// Reference: ImageKit.io documentation
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from '@imagekit/react'
import { useRef, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

const ImageUpload = ({ onUploadComplete, onUploadError }) => {
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null)
  const [selectedFileName, setSelectedFileName] = useState('')
  const fileInputRef = useRef(null)
  const abortController = new AbortController()

  const authenticator = async () => {
    try {
      const response = await fetch('/api/blogs/upload-auth')
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`,
        )
      }
      const data = await response.json()
      const { signature, expire, token, publicKey } = data
      return { signature, expire, token, publicKey }
    } catch (error) {
      console.error('Authentication error:', error)
      throw new Error('Authentication request failed')
    }
  }

  const handleUpload = async () => {
    const fileInput = fileInputRef.current
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert('Please select a file to upload')
      return
    }

    const file = fileInput.files[0]
    setUploading(true)
    setProgress(0)

    try {
      const authParams = await authenticator()
      const { signature, expire, token, publicKey } = authParams

      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: `blog-${Date.now()}-${file.name}`,
        folder: '/blogs',
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100)
        },
        abortSignal: abortController.signal,
      })

      console.log('Upload response:', uploadResponse)
      setUploadedImageUrl(uploadResponse.url)
      onUploadComplete && onUploadComplete(uploadResponse.url)
    } catch (error) {
      console.error('Upload error:', error)
      onUploadError && onUploadError(error)

      if (error instanceof ImageKitAbortError) {
        console.error('Upload aborted:', error.reason)
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error('Invalid request:', error.message)
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error('Network error:', error.message)
      } else if (error instanceof ImageKitServerError) {
        console.error('Server error:', error.message)
      }
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (event) => {
    setUploadedImageUrl(null)
    setProgress(0)

    // Update the button text to show selected file name
    const file = event.target.files[0]
    if (file) {
      setSelectedFileName(file.name)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
      />

      {/* File selection and upload section */}
      <div className="space-y-3">
        {/* Custom file selection button - matches Input styling exactly */}
        <div
          onClick={handleButtonClick}
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer hover:bg-accent/50 transition-colors ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span
            className={
              selectedFileName ? 'text-foreground' : 'text-muted-foreground'
            }
          >
            {selectedFileName || 'Choose Image File'}
          </span>
        </div>

        {/* Upload button - only show when file is selected */}
        {selectedFileName && (
          <Button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            variant="outline"
            size="sm"
            className="w-auto"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        )}
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-muted-foreground">
            Upload progress: {Math.round(progress)}%
          </p>
        </div>
      )}

      {uploadedImageUrl && (
        <div className="space-y-2">
          <p className="text-sm text-green-600 font-medium">
            ✅ Image uploaded successfully!
          </p>
          <img
            src={uploadedImageUrl}
            alt="Uploaded preview"
            className="max-w-sm h-32 object-cover border"
          />
        </div>
      )}
    </div>
  )
}

export default ImageUpload
