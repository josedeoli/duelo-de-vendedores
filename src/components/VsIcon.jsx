import { useState } from 'react'
import './VsIcon.css'

export default function VsIcon() {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="vs-icon">
      {imgError ? (
        <span className="vs-text">VS</span>
      ) : (
        <img
          src={`${import.meta.env.BASE_URL}assets/vs-logo.png`}
          alt="VS"
          className="vs-img"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  )
}
