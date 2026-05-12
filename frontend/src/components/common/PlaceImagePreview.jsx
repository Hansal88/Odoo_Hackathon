import { useEffect, useState } from 'react'
import { Loader2, ImageOff, Sparkles } from 'lucide-react'
import { fetchPlaceImage } from '../../services/placeImageService'

const FALLBACK_IMAGE_URL =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80'

export default function PlaceImagePreview({ placeName, className = '' }) {
  const [state, setState] = useState({
    loading: false,
    error: '',
    data: null,
  })

  useEffect(() => {
    const trimmedPlace = String(placeName || '').trim()

    if (!trimmedPlace) {
      setState({ loading: false, error: '', data: null })
      return undefined
    }

    let active = true
    const timer = window.setTimeout(async () => {
      setState(prev => ({ ...prev, loading: true, error: '' }))

      try {
        const response = await fetchPlaceImage(trimmedPlace)

        if (!active) {
          return
        }

        setState({
          loading: false,
          error: '',
          data: response?.data || null,
        })
      } catch (error) {
        if (!active) {
          return
        }

        setState({
          loading: false,
          error: error?.response?.data?.message || error?.message || 'Unable to load image',
          data: null,
        })
      }
    }, 350)

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [placeName])

  const trimmedPlace = String(placeName || '').trim()

  if (!trimmedPlace) {
    return (
      <div className={`rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 text-sm text-slate-500 dark:text-slate-400 ${className}`}>
        Enter a place name to preview the image source.
      </div>
    )
  }

  if (state.loading) {
    return (
      <div className={`rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 overflow-hidden ${className}`}>
        <div className="aspect-[16/9] flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Looking up image...</span>
          </div>
        </div>
      </div>
    )
  }

  const imageUrl = state.data?.imageUrl || FALLBACK_IMAGE_URL
  const provider = state.data?.provider || 'fallback'

  return (
    <div className={`rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm ${className}`}>
      <div className="relative aspect-[16/9] bg-slate-100 dark:bg-slate-800">
        <img
          src={imageUrl}
          alt={state.data?.title || trimmedPlace}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={event => {
            event.currentTarget.src = FALLBACK_IMAGE_URL
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute left-4 right-4 bottom-4 flex items-end justify-between gap-3 text-white">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/70">Place preview</p>
            <h3 className="text-xl font-semibold leading-tight">{state.data?.title || trimmedPlace}</h3>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur">
            <Sparkles className="w-3.5 h-3.5" />
            {provider}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 p-4 text-sm text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <ImageOff className="w-4 h-4 text-slate-400" />
          <span>{state.data?.cached ? 'Served from cache' : 'Fresh lookup'}</span>
        </div>
        <span className="text-xs text-slate-400 capitalize">{provider}</span>
      </div>

      {state.error ? (
        <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-3 text-sm text-rose-600 dark:text-rose-300 bg-rose-50/70 dark:bg-rose-950/20">
          {state.error}
        </div>
      ) : null}
    </div>
  )
}