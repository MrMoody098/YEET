import { useState, useRef, useCallback, useEffect } from 'react'
import './App.css'

const GIF_DURATION_MS = 2000

const REACTION_SOUNDS = [
  'bruh.m4a',
  "that's just mean.m4a",
  'really.m4a',
  'after I went.m4a',
  "didn't think you were gonna.m4a",
  'you have to be atleast curious.m4a',
]

function App() {
  const [saidYes, setSaidYes] = useState(false)
  const [showGif, setShowGif] = useState(false)
  const [noPos, setNoPos] = useState(null) // null = in flow (right of Yes); { x, y } = absolute, running away
  const [noClickCount, setNoClickCount] = useState(0) // Track how many times No was clicked
  const [mounted, setMounted] = useState(true)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [reactionSoundIndex, setReactionSoundIndex] = useState(0)
  const cardRef = useRef(null)
  const noButtonRef = useRef(null)
  const audioRef = useRef(null)
  const reactionAudioRef = useRef(null)

  const ensureAudioPlays = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.volume = 0.3
      audioRef.current.play()
        .then(() => setMusicPlaying(true))
        .catch(() => {})
    }
  }, [])

  useEffect(() => {
    // Set volume levels
    if (audioRef.current) {
      audioRef.current.volume = 0.3 // Background music at 30%
    }
    if (reactionAudioRef.current) {
      reactionAudioRef.current.volume = 1.0 // Reaction sounds at 100%
    }
    
    // Try to autoplay the background music
    if (audioRef.current) {
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setMusicPlaying(true)
          })
          .catch((error) => {
            console.log('Autoplay blocked, will play on user interaction:', error)
            setMusicPlaying(false)
          })
      }
    }
    
    // Fallback: play on any user interaction
    const playOnInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.volume = 0.3
        audioRef.current.play()
          .then(() => {
            setMusicPlaying(true)
          })
          .catch(() => {})
      }
    }
    
    document.addEventListener('click', playOnInteraction, { once: true })
    document.addEventListener('touchstart', playOnInteraction, { once: true })
    
    return () => {
      document.removeEventListener('click', playOnInteraction)
      document.removeEventListener('touchstart', playOnInteraction)
    }
  }, [])

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
      
      <audio
        ref={reactionAudioRef}
        preload="auto"
        playsInline
      />
      
      {!musicPlaying && (
        <button
          className="music-play-btn"
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.volume = 0.3
              audioRef.current.play().then(() => setMusicPlaying(true))
            }
          }}
          aria-label="Play music"
        >
          🔊 Tap to play music
        </button>
      )}
      
      <div className="bg-flowers" aria-hidden="true">
        {[...Array(10)].map((_, i) => (
          <svg key={i} className="bg-flower" viewBox="0 0 120 120">
            <defs>
              <radialGradient id={`petal-grad-${i}`} cx="30%" cy="30%">
                <stop offset="0%" stopColor="#ffe8f0" />
                <stop offset="30%" stopColor="#ffc4d6" />
                <stop offset="60%" stopColor="#ff91b8" />
                <stop offset="85%" stopColor="#ff6b9d" />
                <stop offset="100%" stopColor="#e91e63" />
              </radialGradient>
              <radialGradient id={`small-petal-grad-${i}`} cx="30%" cy="30%">
                <stop offset="0%" stopColor="#fff0f5" />
                <stop offset="40%" stopColor="#ffd1dc" />
                <stop offset="70%" stopColor="#ffadc7" />
                <stop offset="100%" stopColor="#ff91b8" />
              </radialGradient>
              <radialGradient id={`core-grad-${i}`} cx="30%" cy="30%">
                <stop offset="0%" stopColor="#fffde7" />
                <stop offset="35%" stopColor="#fff59d" />
                <stop offset="65%" stopColor="#ffd54f" />
                <stop offset="100%" stopColor="#ffb300" />
              </radialGradient>
              <filter id={`petal-shadow-${i}`}>
                <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
                <feOffset dx="0" dy="1" result="offsetblur"/>
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.3"/>
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {[0, 72, 144, 216, 288].map((angle) => (
              <path
                key={angle}
                d="M 60 60 Q 50 35, 60 20 Q 70 35, 60 60 Z"
                fill={`url(#petal-grad-${i})`}
                stroke="#ff4081"
                strokeWidth="0.5"
                opacity="0.9"
                filter={`url(#petal-shadow-${i})`}
                transform={`rotate(${angle} 60 60)`}
              />
            ))}
            {[36, 108, 180, 252, 324].map((angle) => (
              <path
                key={`small-${angle}`}
                d="M 60 60 Q 54 42, 60 30 Q 66 42, 60 60 Z"
                fill={`url(#small-petal-grad-${i})`}
                stroke="#ff6b9d"
                strokeWidth="0.4"
                opacity="0.85"
                filter={`url(#petal-shadow-${i})`}
                transform={`rotate(${angle} 60 60)`}
              />
            ))}
            <circle cx="60" cy="60" r="9" fill={`url(#core-grad-${i})`} opacity="0.95" />
            <circle cx="60" cy="60" r="7" fill="none" stroke="#ffa726" strokeWidth="0.8" opacity="0.6" />
            {[...Array(12)].map((_, dot) => {
              const dotAngle = (dot * 30) * Math.PI / 180;
              const dotX = 60 + Math.cos(dotAngle) * 5;
              const dotY = 60 + Math.sin(dotAngle) * 5;
              return <circle key={dot} cx={dotX} cy={dotY} r="0.8" fill="#ff6d00" opacity="0.7" />;
            })}
          </svg>
        ))}
      </div>
      
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
          >
            <p className="question">Will you be my Valentine?</p>
            <p className="sub">(Please say yes 💕)</p>
            <div className="buttons">
              <button
                className="btn btn-yes"
                onClick={() => { 
                  ensureAudioPlays()
                  
                  // Play yippie sound
                  if (reactionAudioRef.current) {
                    reactionAudioRef.current.src = `${import.meta.env.BASE_URL}reacts/yippiee.m4a`
                    reactionAudioRef.current.play().catch(() => {})
                  }
                  
                  setSaidYes(true)
                  setShowGif(true)
                }}
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
                  ensureAudioPlays()
                  
                  // Play reaction sound
                  if (reactionAudioRef.current) {
                    reactionAudioRef.current.src = `${import.meta.env.BASE_URL}reacts/${REACTION_SOUNDS[reactionSoundIndex]}`
                    reactionAudioRef.current.play().catch(() => {})
                  }
                  
                  // Cycle to next sound
                  setReactionSoundIndex((prev) => (prev + 1) % REACTION_SOUNDS.length)
                  
                  setNoClickCount(prev => prev + 1)
                  
                  // Move button to new random position on every click
                  if (cardRef.current) {
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
