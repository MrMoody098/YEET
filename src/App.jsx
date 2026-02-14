import { useState, useRef, useCallback, useEffect } from 'react'
import './App.css'

const GIF_DURATION_MS = 2000

function App() {
  const [saidYes, setSaidYes] = useState(false)
  const [showGif, setShowGif] = useState(false)
  const [noPos, setNoPos] = useState(null) // null = in flow (right of Yes); { x, y } = absolute, running away
  const [noClickCount, setNoClickCount] = useState(0) // Track how many times No was clicked
  const [mounted, setMounted] = useState(true)
  const cardRef = useRef(null)
  const noButtonRef = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    // Try to autoplay the background music
    if (audioRef.current) {
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Autoplay blocked, will play on user interaction:', error)
        })
      }
    }
    
    // Fallback: play on any user interaction
    const playOnInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {})
      }
    }
    
    document.addEventListener('click', playOnInteraction, { once: true })
    document.addEventListener('touchstart', playOnInteraction, { once: true })
    
    return () => {
      document.removeEventListener('click', playOnInteraction)
      document.removeEventListener('touchstart', playOnInteraction)
    }
  }, [])

  const moveNoButton = useCallback((e) => {
    // Only move away after first click
    if (noClickCount === 0) return
    
    const card = cardRef.current
    if (!card || !noButtonRef.current) return
    const rect = card.getBoundingClientRect()
    const btn = noButtonRef.current.getBoundingClientRect()
    const btnCenterX = btn.left + btn.width / 2
    const btnCenterY = btn.top + btn.height / 2
    const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY)
    
    if (dist < 120) {
      const padding = 20
      const maxX = rect.width - 120
      const maxY = rect.height - 60
      const mouseInCardX = e.clientX - rect.left
      const mouseInCardY = e.clientY - rect.top
      let newX = padding + Math.random() * maxX
      let newY = padding + Math.random() * maxY
      
      // Make sure new position is far from mouse
      let attempts = 0
      while (Math.hypot(newX - mouseInCardX, newY - mouseInCardY) < 150 && attempts < 10) {
        newX = padding + Math.random() * maxX
        newY = padding + Math.random() * maxY
        attempts++
      }
      
      setNoPos({
        x: Math.max(0, Math.min(newX, rect.width - 100)),
        y: Math.max(0, Math.min(newY, rect.height - 50)),
      })
    }
  }, [noClickCount])

  useEffect(() => {
    if (!saidYes || !showGif) return
    const t = setTimeout(() => setShowGif(false), GIF_DURATION_MS)
    return () => clearTimeout(t)
  }, [saidYes, showGif])

  return (
    <>
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}Pag-Ibig ay Kanibalismo II.mp3`}
        loop
        preload="auto"
        playsInline
      />
      <div className="bg-hearts" aria-hidden="true">
        <span>💕</span><span>💗</span><span>💖</span><span>💝</span><span>❤️</span>
      </div>

      {!saidYes ? (
        <div
          className={`ask-container ${mounted ? 'mounted' : ''}`}
        >
          <div
            ref={cardRef}
            className="ask-card"
            onMouseEnter={() => setMounted(true)}
            onMouseMove={moveNoButton}
            onTouchMove={(e) => {
              // Only move away after first click
              if (noClickCount === 0) return
              
              const touch = e.touches[0]
              if (touch && noButtonRef.current && cardRef.current) {
                const btn = noButtonRef.current.getBoundingClientRect()
                const tx = btn.left + btn.width / 2
                const ty = btn.top + btn.height / 2
                if (Math.hypot(touch.clientX - tx, touch.clientY - ty) < 120) {
                  const rect = cardRef.current.getBoundingClientRect()
                  setNoPos({
                    x: Math.max(0, Math.min(rect.width - 100, Math.random() * rect.width)),
                    y: Math.max(0, Math.min(rect.height - 50, Math.random() * rect.height)),
                  })
                }
              }
            }}
          >
            <p className="question">Will you be my Valentine?</p>
            <p className="sub">(Please say yes 💕)</p>
            <div className="buttons">
              <button
                className="btn btn-yes"
                onClick={() => { setSaidYes(true); setShowGif(true) }}
              >
                Yes!
              </button>
              <button
                ref={noButtonRef}
                className="btn btn-no"
                style={
                  noPos === null
                    ? undefined
                    : {
                        position: 'absolute',
                        left: noPos.x,
                        top: noPos.y,
                        transition: 'left 0.3s ease-out, top 0.3s ease-out',
                      }
                }
                onClick={(e) => { 
                  e.preventDefault()
                  setNoClickCount(prev => prev + 1)
                  // After first click, trigger initial movement
                  if (noClickCount === 0 && cardRef.current) {
                    const rect = cardRef.current.getBoundingClientRect()
                    setNoPos({
                      x: Math.random() * (rect.width - 140) + 20,
                      y: Math.random() * (rect.height - 80) + 20,
                    })
                  }
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      ) : showGif ? (
        <GifScreen />
      ) : (
        <SuccessScreen />
      )}
    </>
  )
}

function GifScreen() {
  return (
    <div className="gif-wrapper">
      <img
        src={`${import.meta.env.BASE_URL}stephen-curry-space-shot.gif`}
        alt=""
        className="curry-gif"
      />
    </div>
  )
}

const PHOTOS = [
  `${import.meta.env.BASE_URL}610983950_3368924693274372_2066233376959233071_n.jpg`,
  `${import.meta.env.BASE_URL}626484264_840589792356396_5987847625956960686_n.jpg`,
  `${import.meta.env.BASE_URL}626885288_1895137311370804_8371357250499262725_n.jpg`,
  `${import.meta.env.BASE_URL}627643882_1567875071096922_8213328330945948446_n.jpg`,
  `${import.meta.env.BASE_URL}633889598_1545330409911644_2460598087201222235_n.jpg`,
  `${import.meta.env.BASE_URL}634318182_1226189532814495_1868138656139527503_n.jpg`,
]

function SuccessScreen() {
  const [expandedPhotoIndex, setExpandedPhotoIndex] = useState(null)

  return (
    <div className="success-wrapper">
      <div className="flower-scene stem-scene">
        <svg className="stem-branches-svg" viewBox="0 0 320 560" preserveAspectRatio="xMidYMax meet">
          <defs>
            <linearGradient id="stemGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#2d5016" />
              <stop offset="100%" stopColor="#4a7c23" />
            </linearGradient>
            <linearGradient id="branchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B4513" />
              <stop offset="100%" stopColor="#654321" />
            </linearGradient>
          </defs>
          <path
            className="stem-path"
            fill="none"
            stroke="url(#stemGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            d="M 160 560 C 200 500 120 440 160 380 C 200 320 120 260 160 200 C 200 140 120 90 160 70"
          />
          <path className="branch-path branch-path-1" fill="none" stroke="url(#branchGrad)" strokeWidth="6" strokeLinecap="round" d="M 160 480 Q 70 465 30 440" />
          <path className="branch-path branch-path-2" fill="none" stroke="url(#branchGrad)" strokeWidth="6" strokeLinecap="round" d="M 160 400 Q 250 385 290 360" />
          <path className="branch-path branch-path-3" fill="none" stroke="url(#branchGrad)" strokeWidth="6" strokeLinecap="round" d="M 160 320 Q 60 305 25 270" />
          <path className="branch-path branch-path-4" fill="none" stroke="url(#branchGrad)" strokeWidth="6" strokeLinecap="round" d="M 160 250 Q 260 235 295 205" />
          <path className="branch-path branch-path-5" fill="none" stroke="url(#branchGrad)" strokeWidth="6" strokeLinecap="round" d="M 160 180 Q 65 165 40 130" />
          <path className="branch-path branch-path-6" fill="none" stroke="url(#branchGrad)" strokeWidth="6" strokeLinecap="round" d="M 160 130 Q 255 115 280 85" />
        </svg>
        <div className="flower-at-top">
          <div className="flower-center">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`petal petal-${i + 1}`} />
            ))}
            <div className="flower-core" />
          </div>
        </div>
        <div className="branch-ends">
          {PHOTOS.map((src, i) => (
            <div
              key={i}
              className={`branch-end branch-end-${i + 1}`}
              role="button"
              tabIndex={0}
              onClick={(e) => { e.stopPropagation(); setExpandedPhotoIndex(i) }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedPhotoIndex(i) } }}
              aria-label={`View photo ${i + 1}`}
            >
              <div className="branch-photo-wrap">
                <img src={src} alt="" className="branch-photo" />
              </div>
            </div>
          ))}
        </div>
        <p className="flower-message">Yipppeeee! Happy Valentine 0w0 &apos;s 💕</p>
      </div>

      {expandedPhotoIndex !== null && (
        <div
          className="photo-lightbox-backdrop"
          onClick={() => setExpandedPhotoIndex(null)}
          onKeyDown={(e) => e.key === 'Escape' && setExpandedPhotoIndex(null)}
          role="button"
          tabIndex={0}
          aria-label="Close photo"
        >
          <div className="photo-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={PHOTOS[expandedPhotoIndex]}
              alt=""
              className="photo-lightbox-img"
            />
            <button
              type="button"
              className="photo-lightbox-close"
              onClick={() => setExpandedPhotoIndex(null)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
