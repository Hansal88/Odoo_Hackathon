import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MoreVertical, Edit2, Trash2, Eye, Star, Pin, Share2, MessageCircle
} from 'lucide-react'
import CloudinaryImage from './CloudinaryImage'

const statusColors = {
  upcoming: { bg: 'bg-ocean-50 dark:bg-ocean-900/30', text: 'text-ocean-700 dark:text-ocean-300', dot: 'bg-ocean-500' },
  planning: { bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
  completed: { bg: 'bg-green-50 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', dot: 'bg-green-500' },
}

const styleIcons = {
  luxury: '✨',
  backpacking: '🎒',
  adventure: '🏔️',
  family: '👨‍👩‍👧',
  cultural: '🏛️',
  nature: '🌿',
}

export default function InteractiveTripCard({
  trip,
  onDelete,
  onToggleFavorite,
  onTogglePin,
  activeTravelers = [],
  realTimeUpdates = null,
}) {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const status = statusColors[trip.status]
  const progress = trip.budget > 0 ? Math.round((trip.spent / trip.budget) * 100) : 0
  const isFavorite = trip.isFavorite || false
  const isPinned = trip.isPinned || false

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      className={`card overflow-hidden group transition-all ${isPinned ? 'ring-2 ring-ocean-400 dark:ring-ocean-500' : ''}`}
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <CloudinaryImage
          src={trip.coverImageUrl}
          publicId={trip.publicId}
          alt={trip.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          width={900}
          height={600}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Live Indicator */}
        {activeTravelers.length > 0 && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-3 right-12 flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/90 backdrop-blur text-white text-xs font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            {activeTravelers.length} active
          </motion.div>
        )}

        {/* Status Badge */}
        <div
          className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
          {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
        </div>

        {/* Favorite & Pin Buttons */}
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggleFavorite(trip.id)}
            className={`p-1.5 rounded-lg backdrop-blur transition-colors ${
              isFavorite
                ? 'bg-yellow-500/70 text-white'
                : 'bg-black/30 text-white hover:bg-black/50'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onTogglePin(trip.id)}
            className={`p-1.5 rounded-lg backdrop-blur transition-colors ${
              isPinned
                ? 'bg-ocean-500/70 text-white'
                : 'bg-black/30 text-white hover:bg-black/50'
            }`}
          >
            <Pin className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        {/* Style Icon */}
        <span className="absolute top-12 right-3 text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
          {styleIcons[trip.style] || '✈️'}
        </span>

        {/* Title */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-semibold text-base leading-tight">{trip.name}</h3>
          <div className="flex items-center gap-1 text-white/70 text-xs mt-1">
            📍 <span className="truncate">{trip.destinations.join(' → ')}</span>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="absolute top-12 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg bg-black/30 backdrop-blur text-white hover:bg-black/50 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </motion.button>
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute right-0 top-8 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-10"
                >
                  {[
                    { label: 'View', icon: Eye, action: () => navigate(`/trips/${trip.id}`) },
                    { label: 'Edit', icon: Edit2, action: () => {} },
                    { label: 'Share', icon: Share2, action: () => setShowShare(true) },
                    { label: 'Delete', icon: Trash2, action: () => onDelete(trip.id), danger: true },
                  ].map(({ label, icon: Icon, action, danger }) => (
                    <motion.button
                      key={label}
                      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                      onClick={() => {
                        action()
                        setShowMenu(false)
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm transition-colors
                        ${danger ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Trip Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">📅 {new Date(trip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
          <div className="flex items-center gap-1">👥 {trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}</div>
          <div className="flex items-center gap-1">📍 {trip.destinationCount || trip.destinations.length} destinations</div>
          <div className="flex items-center gap-1">💰 ₹{(trip.budget / 1000).toFixed(0)}K</div>
        </div>

        {/* Budget Progress with Enhanced Styling */}
        {trip.spent > 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Spent: ₹{(trip.spent / 1000).toFixed(0)}K</span>
              <span
                className={`font-bold transition-colors ${
                  progress > 90 ? 'text-red-500' : progress > 70 ? 'text-amber-500' : 'text-slate-500'
                }`}
              >
                {progress}%
              </span>
            </div>
            <motion.div
              className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"
              initial={{ backgroundColor: '#e2e8f0' }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full transition-colors ${
                  progress > 90 ? 'bg-gradient-to-r from-red-400 to-red-500' :
                  progress > 70 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                  'bg-gradient-to-r from-ocean-400 to-ocean-500'
                }`}
              />
            </motion.div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/trips/${trip.id}`)}
            className="flex-1 btn-primary text-xs py-2.5 font-medium"
          >
            View Itinerary
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-700"
          >
            <MessageCircle className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Notification Pulse for Real-time Updates */}
      {realTimeUpdates && (
        <motion.div
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300"
        >
          ✨ Updated: {new Date(realTimeUpdates.updatedAt).toLocaleTimeString()}
        </motion.div>
      )}
    </motion.div>
  )
}
