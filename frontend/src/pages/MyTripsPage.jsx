import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutGrid, List, Plus, Search, MapPin, Calendar, Users, Wallet,
  Edit2, Trash2, Eye, MoreVertical, Filter, SlidersHorizontal, Star, Pin, Zap
} from 'lucide-react'
import { mockTrips } from '../data/mockData'
import CloudinaryImage from '../components/common/CloudinaryImage'
import InteractiveTripCard from '../components/common/InteractiveTripCard'
import TripStats from '../components/common/TripStats'
import NotificationFeed from '../components/common/NotificationFeed'
import { loadStoredTrips, saveStoredTrips } from '../utils/tripStorage'
import { useAuth } from '../hooks/useAuthHook'
import { useTripsSocket } from '../hooks/useSocket'

const statusColors = {
  upcoming: { bg: 'bg-ocean-50 dark:bg-ocean-900/30', text: 'text-ocean-700 dark:text-ocean-300', dot: 'bg-ocean-500' },
  planning: { bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
  completed: { bg: 'bg-green-50 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', dot: 'bg-green-500' },
}

const styleIcons = {
  luxury: '✨', backpacking: '🎒', adventure: '🏔️', family: '👨‍👩‍👧', cultural: '🏛️', nature: '🌿',
}

function TripCardList({ trip, onDelete, onToggleFavorite, onTogglePin }) {
  const navigate = useNavigate()
  const status = statusColors[trip.status]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`card p-4 flex gap-4 items-center hover:shadow-md transition-all group cursor-pointer ${trip.isPinned ? 'ring-2 ring-ocean-400' : ''}`}
      onClick={() => navigate(`/trips/${trip.id}`)}
    >
      <CloudinaryImage
        src={trip.coverImageUrl}
        publicId={trip.publicId}
        alt={trip.name}
        className="w-20 h-20 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
        width={320}
        height={320}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-slate-900 dark:text-white truncate">{trip.name}</h3>
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${status.bg} ${status.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
            {trip.status}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{trip.destinations.join(' → ')}</span>
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(trip.startDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{trip.travelers} people</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-slate-900 dark:text-white">₹{(trip.budget / 1000).toFixed(0)}K</p>
        <p className="text-xs text-slate-400">Budget</p>
      </div>
      <div className="flex gap-1" onClick={e => e.stopPropagation()}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggleFavorite(trip.id)}
          className={`p-2 rounded-lg transition-colors ${trip.isFavorite ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'text-slate-400 hover:text-yellow-500'}`}
        >
          <Star className={`w-4 h-4 ${trip.isFavorite ? 'fill-current' : ''}`} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onTogglePin(trip.id)}
          className={`p-2 rounded-lg transition-colors ${trip.isPinned ? 'text-ocean-500 bg-ocean-50 dark:bg-ocean-900/20' : 'text-slate-400 hover:text-ocean-500'}`}
        >
          <Pin className={`w-4 h-4 ${trip.isPinned ? 'fill-current' : ''}`} />
        </motion.button>
        <button
          onClick={() => onDelete(trip.id)}
          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

export default function MyTripsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isConnected, tripEvents, stats } = useTripsSocket(user?.id)
  
  const [view, setView] = useState('grid')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [trips, setTrips] = useState([])
  const [showSortMenu, setShowSortMenu] = useState(false)

  useEffect(() => {
    const storedTrips = loadStoredTrips(user)
    setTrips(storedTrips)
  }, [user])

  const displayedTrips = useMemo(() => trips, [trips])

  const handleDelete = (id) => {
    setTrips((t) => {
      const nextTrips = t.filter((trip) => trip.id !== id)
      saveStoredTrips(nextTrips, user)
      return nextTrips
    })
  }

  const handleToggleFavorite = (id) => {
    setTrips((t) => {
      const nextTrips = t.map((trip) =>
        trip.id === id ? { ...trip, isFavorite: !trip.isFavorite } : trip
      )
      saveStoredTrips(nextTrips, user)
      return nextTrips
    })
  }

  const handleTogglePin = (id) => {
    setTrips((t) => {
      const nextTrips = t.map((trip) =>
        trip.id === id ? { ...trip, isPinned: !trip.isPinned } : trip
      )
      saveStoredTrips(nextTrips, user)
      return nextTrips
    })
  }

  const filtered = displayedTrips.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.destinations.some((d) => d.toLowerCase().includes(search.toLowerCase()))
    const matchFilter = filter === 'all' || t.status === filter
    return matchSearch && matchFilter
  })

  // Sorting logic
  const sorted = useMemo(() => {
    let result = [...filtered]
    
    switch (sort) {
      case 'pinned':
        return result.sort((a, b) => {
          if (a.isPinned === b.isPinned) {
            return b.isFavorite ? 1 : -1
          }
          return a.isPinned ? -1 : 1
        })
      case 'favorite':
        return result.sort((a, b) => (b.isFavorite ? 1 : -1) - (a.isFavorite ? 1 : -1))
      case 'budget-high':
        return result.sort((a, b) => b.budget - a.budget)
      case 'budget-low':
        return result.sort((a, b) => a.budget - b.budget)
      case 'upcoming':
        return result.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      case 'newest':
      default:
        return result.sort((a, b) => new Date(b.createdAt || b.startDate) - new Date(a.createdAt || a.startDate))
    }
  }, [filtered, sort])

  const counts = {
    all: displayedTrips.length,
    upcoming: displayedTrips.filter((t) => t.status === 'upcoming').length,
    planning: displayedTrips.filter((t) => t.status === 'planning').length,
    completed: displayedTrips.filter((t) => t.status === 'completed').length,
  }

  return (
    <div className="space-y-6">
      {/* Notification Feed */}
      <NotificationFeed events={tripEvents} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="page-header flex items-center gap-2">
            My Trips
            {isConnected && (
              <span className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live
              </span>
            )}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{displayedTrips.length} trips planned</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/create-trip')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Trip
        </motion.button>
      </motion.div>

      {/* Stats Dashboard */}
      {displayedTrips.length > 0 && <TripStats trips={displayedTrips} recentEvents={tripEvents} />}

      {/* Filters + Search + Sort */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="input pl-10 py-2.5"
            placeholder="Search trips..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1 flex-wrap">
          {Object.entries(counts).map(([key, count]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize
                ${
                  filter === key
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
            >
              {key} ({count})
            </button>
          ))}
        </div>

        {/* Sort + View toggle */}
        <div className="flex gap-2">
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Zap className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Sort</span>
            </motion.button>
            <AnimatePresence>
              {showSortMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute right-0 top-10 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700 z-10"
                >
                  {[
                    { key: 'pinned', label: '📌 Pinned First' },
                    { key: 'favorite', label: '⭐ Favorites First' },
                    { key: 'upcoming', label: '📅 Upcoming' },
                    { key: 'newest', label: '✨ Newest' },
                    { key: 'budget-high', label: '💰 Budget (High)' },
                    { key: 'budget-low', label: '💸 Budget (Low)' },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSort(key)
                        setShowSortMenu(false)
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 ${
                        sort === key ? 'text-ocean-600 dark:text-ocean-400 bg-slate-50 dark:bg-slate-700' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* View toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {[
              { key: 'grid', icon: LayoutGrid },
              { key: 'list', icon: List },
            ].map(({ key, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className={`p-2 rounded-lg transition-all ${
                  view === key ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Empty state */}
      {sorted.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-12 text-center"
        >
          <p className="text-4xl mb-4">🗺️</p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No trips added yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Create a trip and it will appear here automatically</p>
          <button onClick={() => navigate('/create-trip')} className="btn-primary mx-auto">
            Create a Trip
          </button>
        </motion.div>
      )}

      {/* Trips */}
      <AnimatePresence mode="wait">
        {view === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {sorted.map((trip) => (
              <InteractiveTripCard
                key={trip.id}
                trip={trip}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
                onTogglePin={handleTogglePin}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {sorted.map((trip) => (
              <TripCardList
                key={trip.id}
                trip={trip}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
                onTogglePin={handleTogglePin}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
