import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Loader, Copy, Check, Volume2 } from 'lucide-react'
import aiService from '../services/aiService'

export default function ContextualAIChatbot({
  context = 'explore', // 'explore', 'budget', 'packing'
  destination = '',
  tripData = {},
  tripId = '',
  onDataLoad = null, // Callback when data is loaded
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [content, setContent] = useState('')
  const [copied, setCopied] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  // Determine title and color based on context
  const config = {
    explore: {
      title: '🗺️ Explore Guide',
      subtitle: 'Detailed destination information',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-600',
      icon: '🌍',
    },
    budget: {
      title: '💰 Budget Advisor',
      subtitle: 'Smart budget planning advice',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-600',
      icon: '💵',
    },
    packing: {
      title: '🧳 Packing Expert',
      subtitle: 'Complete packing checklist',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-600',
      icon: '📋',
    },
  }

  const currentConfig = config[context] || config.explore

  const extractContent = response => {
    if (!response) return ''
    if (typeof response === 'string') return response
    if (typeof response.data === 'string') return response.data
    if (response.data && typeof response.data.fullContent === 'string') return response.data.fullContent
    if (response.data && typeof response.data === 'object') return JSON.stringify(response.data, null, 2)
    return JSON.stringify(response, null, 2)
  }

  // Auto-load data on component mount
  useEffect(() => {
    if (!tripId || !destination) return

    const loadInitialData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Try to fetch from MongoDB first
        const fetchMethod = {
          explore: aiService.fetchExploreData,
          budget: aiService.fetchBudgetData,
          packing: aiService.fetchPackingData,
        }[context]

        const response = await fetchMethod(tripId)
        if (response.success && response.data) {
          setContent(extractContent(response.data))
          setDataLoaded(true)
          if (onDataLoad) onDataLoad(response.data)
        } else {
          // If not found, fetch from AI and save
          await generateAndSaveAIContent()
        }
      } catch (err) {
        console.log('Data not in MongoDB, generating from AI...')
        // If error (likely 404), generate from AI
        try {
          await generateAndSaveAIContent()
        } catch (aiErr) {
          setError('Failed to load data. Please try again.')
          console.error('AI Generation Error:', aiErr)
        }
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [tripId, context, destination])

  // Generate AI content and save to MongoDB
  const generateAndSaveAIContent = async () => {
    setLoading(true)
    setError(null)
    try {
      let response
      let saveMethod
      let saveData
      const season = getSeason(tripData.startDate)

      switch (context) {
        case 'explore':
          response = await aiService.generateExploreContent({
            ...tripData,
            destination,
            savedTripName: tripData.savedTripName || tripData.name || tripData.trip,
          })
          saveMethod = aiService.saveExploreData
          saveData = [
            tripId,
            destination,
            tripData.style || 'general',
            response.data.fullContent || JSON.stringify(response.data, null, 2),
          ]
          break
        case 'budget':
          response = await aiService.getBudgetBreakdown(
            destination,
            tripData.budget || 50000,
            tripData.days || 5,
            tripData.travelers || 1,
            tripData.style || 'moderate'
          )
          saveMethod = aiService.saveBudgetData
          saveData = [
            tripId,
            destination,
            tripData.budget || 50000,
            tripData.days || 5,
            tripData.travelers || 1,
            tripData.style || 'moderate',
            extractContent(response.data),
          ]
          break
        case 'packing':
          response = await aiService.getPackingGuide(
            destination,
            tripData.days || 5,
            tripData.travelers || 1,
            season,
            tripData.style || 'general'
          )
          saveMethod = aiService.savePackingData
          saveData = [
            tripId,
            destination,
            tripData.days || 5,
            tripData.travelers || 1,
            season,
            tripData.style || 'general',
            extractContent(response.data),
          ]
          break
        default:
          throw new Error('Unknown context')
      }

      if (response.success) {
        setContent(extractContent(response.data))
        setDataLoaded(true)

        // Save to MongoDB
        try {
          const saveResponse = await saveMethod(...saveData)
          if (onDataLoad) onDataLoad(saveResponse.data)
        } catch (saveErr) {
          console.error('Failed to save data:', saveErr)
          // Data is still displayed, just not saved
        }
      } else {
        setError(response.message || 'Failed to fetch information')
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch AI recommendations')
      console.error('AI Service Error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch AI content on button click (when panel opens and no data loaded yet)
  useEffect(() => {
    if (!open || dataLoaded || content) return

    generateAndSaveAIContent()
  }, [open])

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(content)
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl text-white transition-all ${
          open ? `${currentConfig.bgColor} ring-4 ring-offset-2` : currentConfig.bgColor
        } hover:shadow-lg`}
      >
        {open ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.button>

      {/* Chatbot Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-40 w-[420px] max-w-[95vw] h-[600px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800"
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${currentConfig.color} text-white p-5`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentConfig.icon}</span>
                  <div>
                    <h2 className="text-lg font-bold">{currentConfig.title}</h2>
                    <p className="text-xs opacity-90">{currentConfig.subtitle}</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader className="w-8 h-8 text-slate-400" />
                  </motion.div>
                  <p className="text-sm text-slate-500">Loading AI recommendations...</p>
                  <p className="text-xs text-slate-400">This may take a few seconds</p>
                </div>
              ) : error ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full gap-3 text-red-600 dark:text-red-400"
                >
                  <p className="text-2xl">⚠️</p>
                  <p className="text-sm font-medium">{error}</p>
                  <button
                    onClick={() => {
                      setError(null)
                      setContent('')
                    }}
                    className="text-xs underline hover:no-underline"
                  >
                    Try again
                  </button>
                </motion.div>
              ) : content ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap"
                >
                  {/* Parse content into sections */}
                  {content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="text-justify">
                      {paragraph}
                    </p>
                  ))}
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <p className="text-center text-sm">
                    Click the button to load {context} recommendations for {destination}
                  </p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {content && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 flex gap-2"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors text-xs font-medium"
                >
                  {copied ? (
                    <>
                      <Check size={16} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSpeak}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors text-xs font-medium"
                >
                  <Volume2 size={16} />
                  Speak
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generateAndSaveAIContent}
                  className="flex-1 px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors text-xs font-medium"
                >
                  Refresh
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Helper function to determine season from date
function getSeason(dateString) {
  if (!dateString) return 'moderate'

  try {
    const date = new Date(dateString)
    const month = date.getMonth() + 1

    if (month >= 3 && month <= 5) return 'summer'
    if (month >= 6 && month <= 8) return 'monsoon'
    if (month >= 9 && month <= 11) return 'autumn'
    return 'winter'
  } catch {
    return 'moderate'
  }
}
