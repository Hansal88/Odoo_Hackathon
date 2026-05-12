import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, ArrowLeft, Check, Upload, Users, Calendar,
  Wallet, MapPin, Globe, Sparkles, Plane
} from 'lucide-react'
import { travelStyles } from '../data/mockData'
import CloudinaryImage from '../components/common/CloudinaryImage'
import DestinationSelector from '../components/common/DestinationSelector'
import PlaceImagePreview from '../components/common/PlaceImagePreview'
import { addStoredTrip } from '../utils/tripStorage'
import { getSuggestedCovers, getTravelProfile } from '../utils/travelPlanner'
import { fetchPlaceImage } from '../services/placeImageService'

const STEPS = [
  { id: 1, title: 'Basic Info', desc: 'Name your adventure' },
  { id: 2, title: 'Dates & People', desc: 'When & who' },
  { id: 3, title: 'Budget & Style', desc: 'How you travel' },
  { id: 4, title: 'Cover Image', desc: 'Make it beautiful' },
]

const budgetRanges = [
  { id: 'budget', label: 'Budget', range: 'Under ₹20K', icon: '🎒', color: 'text-green-600' },
  { id: 'moderate', label: 'Moderate', range: '₹20K – ₹60K', icon: '✈️', color: 'text-ocean-600' },
  { id: 'luxury', label: 'Luxury', range: '₹60K – ₹1.5L', icon: '✨', color: 'text-purple-600' },
  { id: 'ultra', label: 'Ultra Luxury', range: '₹1.5L+', icon: '👑', color: 'text-amber-600' },
]

export default function CreateTripPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [creating, setCreating] = useState(false)
  const [created, setCreated] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    destinations: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    budgetRange: '',
    customBudget: '',
    style: '',
    coverImage: 'cld-sample-3',
  })

  const travelProfile = useMemo(() => getTravelProfile(`${form.name} ${form.destinations}`), [form.name, form.destinations])
  const coverImages = useMemo(() => getSuggestedCovers(`${form.name} ${form.destinations}`), [form.name, form.destinations])
  const primaryDestination = useMemo(
    () => form.destinations.split(',').map(item => item.trim()).filter(Boolean)[0] || '',
    [form.destinations]
  )

  useEffect(() => {
    if (step === 4) {
      const hasSelectedCover = coverImages.some(image => image.publicId === form.coverImage)
      if (!hasSelectedCover && coverImages[0]) {
        update('coverImage', coverImages[0].publicId)
      }
    }
  }, [step, coverImages, form.coverImage])

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const canNext = () => {
    if (step === 1) return form.name.trim().length > 0 && form.destinations.trim().length > 0
    if (step === 2) return form.startDate && form.endDate && form.travelers > 0
    if (step === 3) return form.budgetRange && form.style
    return true
  }

  const handleCreate = async () => {
    setCreating(true)
    const destinationList = form.destinations
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)

    const budgetMap = {
      budget: 20000,
      moderate: 60000,
      luxury: 150000,
      ultra: 300000,
    }
    const budget = form.customBudget
      ? Number(form.customBudget)
      : (budgetMap[form.budgetRange] || 0)

    let coverImageUrl = ''
    let destinationImages = []

    if (destinationList.length > 0) {
      try {
        const imageResponses = await Promise.all(
          destinationList.map(dest => fetchPlaceImage(dest).catch(() => null))
        )
        destinationImages = imageResponses
          .filter(response => response && response.data)
          .map(response => ({
            placeName: response.data.placeName,
            imageUrl: response.data.imageUrl,
            provider: response.data.provider,
            title: response.data.title,
            description: response.data.description,
          }))
        coverImageUrl = destinationImages[0]?.imageUrl || ''
      } catch (error) {
        coverImageUrl = ''
        destinationImages = []
      }
    }

    const newTrip = {
      id: `trip-${Date.now()}`,
      name: form.name,
      description: form.description,
      destinations: destinationList,
      destinationCount: destinationList.length,
      startDate: form.startDate,
      endDate: form.endDate,
      travelers: Number(form.travelers),
      budgetRange: form.budgetRange,
      budget,
      spent: 0,
      style: form.style,
      publicId: form.coverImage,
      coverImageUrl,
      destinationImages,
      status: new Date(form.startDate) <= new Date() ? 'upcoming' : 'planning',
      createdAt: new Date().toISOString(),
    }

    addStoredTrip(newTrip)
    await new Promise(r => setTimeout(r, 1200))
    setCreated(true)
    await new Promise(r => setTimeout(r, 900))
    navigate('/trips')
  }

  if (created) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">Trip Created!</h2>
          <p className="text-slate-500 dark:text-slate-400">Redirecting you to your trips...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="page-header mb-2">Plan a New Trip</h1>
        <p className="text-slate-500 dark:text-slate-400">Fill in the details to start your adventure</p>
      </motion.div>

      {/* Step Progress */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-8">
        <div className="flex items-center gap-0">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <motion.div
                  animate={{
                    backgroundColor: step > s.id ? '#0284c7' : step === s.id ? '#0ca4e8' : 'rgba(0, 0, 0, 0)',
                    borderColor: step >= s.id ? '#0ca4e8' : '#e2e8f0',
                  }}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all
                    ${step > s.id ? 'text-white' : step === s.id ? 'text-white' : 'text-slate-400 dark:text-slate-600'}`}
                >
                  {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                </motion.div>
                <span className={`text-xs font-medium hidden sm:block ${step === s.id ? 'text-ocean-600' : 'text-slate-400'}`}>
                  {s.title}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 mx-2 mb-5">
                  <div className="h-0.5 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                    <motion.div
                      animate={{ width: step > s.id ? '100%' : '0%' }}
                      transition={{ duration: 0.4 }}
                      className="h-full bg-ocean-500"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card p-6 md:p-8"
      >
        <AnimatePresence mode="wait">

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-5"
            >
              <div>
                <h2 className="text-xl font-display font-semibold text-slate-900 dark:text-white mb-1">Basic Information</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Tell us about your trip</p>
              </div>

              <div>
                <label className="label" htmlFor="trip-name">Trip Name *</label>
                <input
                  id="trip-name"
                  name="tripName"
                  className="input"
                  placeholder="e.g. Bali Summer Escape 2024"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                />
              </div>

              <DestinationSelector
                value={form.destinations}
                onChange={value => update('destinations', value)}
              />

              <PlaceImagePreview placeName={primaryDestination} />

              <div>
                <label className="label" htmlFor="trip-description">Description</label>
                <textarea
                  id="trip-description"
                  name="description"
                  className="input resize-none"
                  rows={3}
                  placeholder="What's the vibe of this trip? Any special occasions?"
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Dates & People */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-5"
            >
              <div>
                <h2 className="text-xl font-display font-semibold text-slate-900 dark:text-white mb-1">Dates & People</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">When are you going and with whom?</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="trip-start-date">Start Date *</label>
                  <input
                    id="trip-start-date"
                    name="startDate"
                    type="date"
                    className="input"
                    value={form.startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => update('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label" htmlFor="trip-end-date">End Date *</label>
                  <input
                    id="trip-end-date"
                    name="endDate"
                    type="date"
                    className="input"
                    value={form.endDate}
                    min={form.startDate || new Date().toISOString().split('T')[0]}
                    onChange={e => update('endDate', e.target.value)}
                  />
                </div>
              </div>

              {/* Duration display */}
              {form.startDate && form.endDate && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-ocean-50 dark:bg-ocean-900/20 rounded-xl"
                >
                  <Calendar className="w-4 h-4 text-ocean-600" />
                  <p className="text-sm text-ocean-700 dark:text-ocean-300">
                    {Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24))} days trip
                  </p>
                </motion.div>
              )}

              <div>
                <div className="label">Number of Travelers *</div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => update('travelers', Math.max(1, form.travelers - 1))}
                    className="w-10 h-10 rounded-xl btn-secondary flex items-center justify-center text-xl font-bold"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center">
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{form.travelers}</p>
                    <p className="text-xs text-slate-400">traveler{form.travelers > 1 ? 's' : ''}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => update('travelers', Math.min(20, form.travelers + 1))}
                    className="w-10 h-10 rounded-xl btn-primary flex items-center justify-center text-xl font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Budget & Style */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-display font-semibold text-slate-900 dark:text-white mb-1">Budget & Style</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">How do you like to travel?</p>
              </div>

              {/* Budget Range */}
              <div>
                <div className="label">Budget Range *</div>
                <div className="grid grid-cols-2 gap-3">
                  {budgetRanges.map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => update('budgetRange', b.id)}
                      className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all text-left
                        ${form.budgetRange === b.id
                          ? 'border-ocean-500 bg-ocean-50 dark:bg-ocean-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                    >
                      <span className="text-2xl mb-1">{b.icon}</span>
                      <p className={`font-semibold text-sm ${form.budgetRange === b.id ? 'text-ocean-700 dark:text-ocean-300' : 'text-slate-900 dark:text-white'}`}>{b.label}</p>
                      <p className="text-xs text-slate-500">{b.range}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Style */}
              <div>
                <div className="label">Travel Style *</div>
                <div className="grid grid-cols-3 gap-2">
                  {travelStyles.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => update('style', s.id)}
                      className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all text-center
                        ${form.style === s.id
                          ? 'border-ocean-500 bg-ocean-50 dark:bg-ocean-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                    >
                      <span className="text-xl mb-1">{s.icon}</span>
                      <p className={`font-medium text-xs ${form.style === s.id ? 'text-ocean-700 dark:text-ocean-300' : 'text-slate-700 dark:text-slate-300'}`}>{s.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Cover Image */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-5"
            >
              <div>
                <h2 className="text-xl font-display font-semibold text-slate-900 dark:text-white mb-1">Cover Image</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Pick a cover related to {travelProfile.label.toLowerCase()}</p>
              </div>

              {/* Selected preview */}
              <div className="relative h-48 rounded-2xl overflow-hidden">
                <CloudinaryImage
                  publicId={form.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                  width={1200}
                  height={700}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-display font-bold text-xl">{form.name || 'Your Trip'}</p>
                  <p className="text-white/70 text-sm">{form.destinations || 'Destination'}</p>
                </div>
              </div>

              {/* Gallery */}
              <div className="grid grid-cols-3 gap-2">
                {coverImages.map(img => (
                  <button
                    key={img.publicId}
                    type="button"
                    onClick={() => update('coverImage', img.publicId)}
                    className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all
                      ${form.coverImage === img.publicId ? 'border-ocean-500 scale-95' : 'border-transparent hover:border-slate-300'}`}
                  >
                    <CloudinaryImage
                      publicId={img.publicId}
                      alt={img.label}
                      className="w-full h-full object-cover"
                      width={500}
                      height={350}
                    />
                    {form.coverImage === img.publicId && (
                      <div className="absolute inset-0 bg-ocean-600/30 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-1 left-0 right-0 text-center">
                      <span className="text-white text-xs font-medium drop-shadow">{img.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Upload option */}
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-ocean-400 hover:text-ocean-600 transition-all text-sm font-medium">
                <Upload className="w-4 h-4" />
                Upload custom image
              </button>

              {/* Summary */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Trip Summary</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-slate-400">Name: </span><span className="font-medium text-slate-900 dark:text-white">{form.name || '—'}</span></div>
                  <div><span className="text-slate-400">Style: </span><span className="font-medium text-slate-900 dark:text-white capitalize">{form.style || '—'}</span></div>
                  <div><span className="text-slate-400">Dates: </span><span className="font-medium text-slate-900 dark:text-white">{form.startDate ? `${form.startDate} → ${form.endDate}` : '—'}</span></div>
                  <div><span className="text-slate-400">People: </span><span className="font-medium text-slate-900 dark:text-white">{form.travelers}</span></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/trips')}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          <div className="flex items-center gap-2">
            {STEPS.map(s => (
              <div
                key={s.id}
                className={`w-2 h-2 rounded-full transition-all ${step === s.id ? 'w-6 bg-ocean-500' : step > s.id ? 'bg-ocean-300' : 'bg-slate-200 dark:bg-slate-700'}`}
              />
            ))}
          </div>

          {step < 4 ? (
            <button
              type="button"
              disabled={!canNext()}
              onClick={() => setStep(s => s + 1)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200
                ${canNext()
                  ? 'btn-primary'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={handleCreate}
              disabled={creating}
              className="btn-primary flex items-center gap-2"
            >
              {creating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Create Trip
                </>
              )}
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
