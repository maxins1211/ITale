// Reference: ImageKit.io documentation
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from '@imagekit/react'
import { useRef, useState } from 'react'

const ImageUpload = ({ onUploadComplete, onUploadError }) => {
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null)
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

  const handleFileChange = () => {
    setUploadedImageUrl(null)
    setProgress(0)
  }

  return (
    <div style={{ marginBottom: '10px' }}>
      <label>Cover Image:</label>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        style={{ width: '100%', padding: '5px', marginTop: '5px' }}
      />

      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading}
        style={{ marginTop: '5px' }}
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>

      {uploading && (
        <div style={{ marginTop: '5px' }}>
          Upload progress: <progress value={progress} max={100}></progress>{' '}
          {Math.round(progress)}%
        </div>
      )}

      {uploadedImageUrl && (
        <div style={{ marginTop: '10px' }}>
          <p>✅ Image uploaded successfully!</p>
          <img
            src={uploadedImageUrl}
            alt="Uploaded preview"
            style={{
              maxWidth: '200px',
              maxHeight: '150px',
              objectFit: 'cover',
            }}
          />
        </div>
      )}
    </div>
  )
}

export default ImageUpload
