import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, MapPin, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80'

export default function DestinationCarousel({ destinations = [], destinationImages = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  const images = destinationImages.length > 0 ? destinationImages : []
  const hasImages = images.length > 0
  const currentImage = hasImages ? images[currentIndex] : null

  useEffect(() => {
    if (!autoPlay || !hasImages) return

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [autoPlay, hasImages, images.length])

  const goToPrevious = () => {
    setAutoPlay(false)
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setAutoPlay(false)
    setCurrentIndex(prev => (prev + 1) % images.length)
  }

  const goToSlide = (index) => {
    setAutoPlay(false)
    setCurrentIndex(index)
  }

  if (!hasImages && (!destinations || destinations.length === 0)) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="relative group">
        {/* Carousel container */}
        <div className="relative h-96 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
          <AnimatePresence mode="fade">
            {hasImages && (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <img
                  src={currentImage.imageUrl || FALLBACK_IMAGE}
                  alt={currentImage.placeName}
                  className="w-full h-full object-cover"
                  onError={e => {
                    e.currentTarget.src = FALLBACK_IMAGE
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Info section */}
          {hasImages && (
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <motion.div
                key={`info-${currentIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      <p className="text-sm font-medium text-white/80">{currentImage.placeName}</p>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{currentImage.title}</h3>
                    {currentImage.description && (
                      <p className="text-sm text-white/70 line-clamp-2">{currentImage.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs whitespace-nowrap">
                    <Sparkles className="w-3 h-3" />
                    {currentImage.provider}
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Navigation buttons */}
          {hasImages && images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
                aria-label="Previous destination"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
                aria-label="Next destination"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Indicators and info */}
        {hasImages && images.length > 1 && (
          <div className="flex items-center justify-between gap-4 mt-4">
            {/* Indicators */}
            <div className="flex gap-2">
              {images.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-ocean-600 w-8'
                      : 'bg-slate-300 dark:bg-slate-600 w-2 hover:bg-slate-400 dark:hover:bg-slate-500'
                  }`}
                  aria-label={`Go to destination ${index + 1}`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </div>

            {/* Counter */}
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Auto-play toggle */}
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                autoPlay
                  ? 'bg-ocean-100 dark:bg-ocean-900/30 text-ocean-700 dark:text-ocean-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {autoPlay ? '▶ Auto' : '⏸ Paused'}
            </button>
          </div>
        )}
      </div>

      {/* Destination list */}
      {destinations && destinations.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Destinations</p>
          <div className="flex flex-wrap gap-2">
            {destinations.map((dest, index) => (
              <button
                key={dest}
                onClick={() => goToSlide(index)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  index === currentIndex
                    ? 'bg-ocean-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <MapPin className="inline w-3 h-3 mr-1" />
                {dest}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
