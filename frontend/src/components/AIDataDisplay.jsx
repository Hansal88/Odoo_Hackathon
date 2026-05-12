import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'
import aiService from '../services/aiService'

function stripCodeFences(content) {
  return String(content || '')
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim()
}

function normalizeExploreContent(payload, tripData = {}) {
  if (!payload) {
    return {
      title: tripData.savedTripName || tripData.trip || tripData.name || 'Explore Guide',
      tagline: `Explore ideas for ${tripData.destination || tripData.category || 'your trip'}`,
      placesToExplore: [],
      localExperiences: [],
      tipsForStyle: '',
      fullContent: '',
    }
  }

  if (typeof payload === 'object') {
    if (payload.fullContent && typeof payload.fullContent === 'string') {
      const parsedFromFullContent = normalizeExploreContent(payload.fullContent, tripData)
      return {
        ...payload,
        ...parsedFromFullContent,
      }
    }

    return {
      title: payload.title || tripData.savedTripName || tripData.trip || tripData.name || 'Explore Guide',
      tagline: payload.tagline || `Explore ideas for ${tripData.destination || tripData.category || 'your trip'}`,
      placesToExplore: payload.placesToExplore || [],
      localExperiences: payload.localExperiences || [],
      tipsForStyle: payload.tipsForStyle || payload.tips || '',
      fullContent: payload.fullContent || JSON.stringify(payload, null, 2),
      ...payload,
    }
  }

  const cleaned = stripCodeFences(payload)

  try {
    const parsed = JSON.parse(cleaned)
    return normalizeExploreContent(parsed, tripData)
  } catch (error) {
    return {
      title: tripData.savedTripName || tripData.trip || tripData.name || 'Explore Guide',
      tagline: `Explore ideas for ${tripData.destination || tripData.category || 'your trip'}`,
      placesToExplore: [],
      localExperiences: [],
      tipsForStyle: cleaned,
      fullContent: cleaned,
    }
  }
}

function getCacheKey(context, tripId) {
  return `traveloop-ai-${context}-${tripId}`
}

function readCachedContent(context, tripId) {
  if (!tripId) return null

  try {
    const raw = localStorage.getItem(getCacheKey(context, tripId))
    if (!raw) return null

    const parsed = JSON.parse(raw)
    return parsed?.data || parsed || null
  } catch (error) {
    return null
  }
}

function writeCachedContent(context, tripId, data) {
  if (!tripId) return

  try {
    localStorage.setItem(
      getCacheKey(context, tripId),
      JSON.stringify({ data, cachedAt: new Date().toISOString() })
    )
  } catch (error) {
    // Ignore storage quota / availability issues.
  }
}

function extractContent(response) {
  if (!response) return ''
  if (typeof response === 'string') return response
  if (typeof response.data === 'string') return response.data
  if (response.data && typeof response.data.fullContent === 'string') return response.data.fullContent
  if (response.data && typeof response.data === 'object') return JSON.stringify(response.data, null, 2)
  return JSON.stringify(response, null, 2)
}

function getSeason(dateString) {
  if (!dateString) return 'summer'

  try {
    const date = new Date(dateString)
    const month = date.getMonth() + 1

    if (month >= 3 && month <= 5) return 'summer'
    if (month >= 6 && month <= 8) return 'monsoon'
    if (month >= 9 && month <= 11) return 'autumn'
    return 'winter'
  } catch {
    return 'summer'
  }
}

export default function AIDataDisplay({
  context = 'explore', // 'explore', 'budget', 'packing'
  tripId = '',
  destination = '',
  tripData = {},
}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isExplore = context === 'explore'

  const normalizeContent = value => {
    if (isExplore) {
      return normalizeExploreContent(value, tripData)
    }

    if (!value) {
      return { fullContent: '' }
    }

    if (typeof value === 'string') {
      return { fullContent: value }
    }

    if (typeof value === 'object') {
      return {
        ...value,
        fullContent: value.fullContent || JSON.stringify(value, null, 2),
      }
    }

    return { fullContent: String(value) }
  }

  const persistContent = normalized => {
    setData(normalized)
    writeCachedContent(context, tripId, normalized)
  }

  const fetchSavedContent = async () => {
    const fetchMethod = {
      explore: aiService.fetchExploreData,
      budget: aiService.fetchBudgetData,
      packing: aiService.fetchPackingData,
    }[context]

    try {
      const response = await fetchMethod(tripId)
      if (response.success && response.data) {
        persistContent(normalizeContent(response.data))
        return true
      }

      return false
    } catch (error) {
      if (error?.response?.status === 404) {
        return false
      }

      throw error
    }
  }

  const generateContent = async () => {
    if (isExplore) {
      const response = await aiService.generateExploreContent({
        ...tripData,
        destination: destination || tripData.destination || tripData.destinations?.[0] || tripData.name || tripData.category || '',
      })
      const normalized = normalizeContent(response.data)
      persistContent(normalized)

      try {
        await aiService.saveExploreData(
          tripId,
          destination || tripData.destination || tripData.category || tripData.name || 'Unknown destination',
          tripData.style || tripData.travelStyle || 'general',
          JSON.stringify(normalized, null, 2)
        )
      } catch (saveError) {
        console.error('Failed to save explore data:', saveError)
      }

      return
    }

    const season = getSeason(tripData.startDate)

    if (context === 'budget') {
      const response = await aiService.getBudgetBreakdown(
        destination,
        tripData.budget || 50000,
        tripData.days || 5,
        tripData.travelers || 1,
        tripData.style || 'moderate'
      )

      const content = extractContent(response)
      persistContent(normalizeContent(content))

      try {
        await aiService.saveBudgetData(
          tripId,
          destination,
          tripData.budget || 50000,
          tripData.days || 5,
          tripData.travelers || 1,
          tripData.style || 'moderate',
          content
        )
      } catch (saveError) {
        console.error('Failed to save budget data:', saveError)
      }

      return
    }

    if (context === 'packing') {
      const response = await aiService.getPackingGuide(
        destination,
        tripData.days || 5,
        tripData.travelers || 1,
        season,
        tripData.style || 'general'
      )

      const content = extractContent(response)
      persistContent(normalizeContent(content))

      try {
        await aiService.savePackingData(
          tripId,
          destination,
          tripData.days || 5,
          tripData.travelers || 1,
          season,
          tripData.style || 'general',
          content
        )
      } catch (saveError) {
        console.error('Failed to save packing data:', saveError)
      }
    }
  }

  const loadContent = async ({ forceGenerate = false } = {}) => {
    if (!tripId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (!forceGenerate) {
        const cached = readCachedContent(context, tripId)
        if (cached) {
          persistContent(normalizeContent(cached))
          return
        }

        try {
          const fetched = await fetchSavedContent()
          if (fetched) return
        } catch (fetchError) {
          if (fetchError?.response?.status !== 404) {
            throw fetchError
          }
        }
      }

      await generateContent()
    } catch (err) {
      console.error('AI Data Load Error:', err)
      setError('Could not load AI content yet. Please try retrying.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!tripId) return
    loadContent()
  }, [tripId, context, destination, tripData])

  const handleRefresh = async () => {
    localStorage.removeItem(getCacheKey(context, tripId))
    await loadContent({ forceGenerate: true })
  }

  if (loading) {
    return (
      <div className="card p-6 space-y-4 animate-pulse">
        <div className="h-5 w-40 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-20 rounded-3xl bg-slate-100 dark:bg-slate-800" />
        <div className="grid gap-3 md:grid-cols-2">
          <div className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800" />
          <div className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-900 dark:text-blue-200">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 text-xs px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  const exploreData = isExplore ? normalizeExploreContent(data, tripData) : null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {isExplore ? (
        <div className="card p-6 space-y-5">
          <div className="rounded-3xl bg-gradient-to-br from-ocean-600 to-sky-700 text-white p-6 shadow-lg">
            <p className="text-xs uppercase tracking-[0.25em] text-white/70 mb-3">Explore plan</p>
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">{exploreData.title}</h2>
            <p className="text-white/80 max-w-3xl">{exploreData.tagline}</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ContentGroup title="Places to Explore" items={exploreData.placesToExplore} />
            <ContentGroup title="Local Experiences" items={exploreData.localExperiences} />
          </div>

          <div className="rounded-2xl border border-ocean-100 dark:border-ocean-900/40 bg-ocean-50/70 dark:bg-ocean-950/20 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ocean-700 dark:text-ocean-300 mb-2">
              Tips for this style
            </h3>
            <p className="text-sm leading-7 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
              {exploreData.tipsForStyle}
            </p>
          </div>

          <button
            onClick={handleRefresh}
            className="text-xs px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
        </div>
      ) : (
        <div className="card p-6">
          <div className="prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-h-[800px] overflow-y-auto">
              {data.fullContent}
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="mt-4 text-xs px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
        </div>
      )}
    </motion.div>
  )
}

function ContentGroup({ title, items }) {
  const safeItems = Array.isArray(items) ? items : []

  return (
    <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/60 p-5 space-y-4">
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      {safeItems.length ? (
        <div className="space-y-3">
          {safeItems.map((item, index) => (
            <div key={`${item.name}-${index}`} className="rounded-2xl border border-white/70 dark:border-slate-700 bg-white dark:bg-slate-950/40 p-4 shadow-sm">
              <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-6">{item.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">No items generated yet.</p>
      )}
    </div>
  )
}
