import { motion } from 'framer-motion'
import { Search, Bell, TrendingUp, MapPin, Calendar, ChevronRight, Plus, Wallet, Compass } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuthHook'
import { mockTrips, recommendedCities } from '../data/mockData'
import CloudinaryImage from '../components/common/CloudinaryImage'
import { loadStoredTrips } from '../utils/tripStorage'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' } }),
}

const statusColors = {
  upcoming: 'bg-ocean-50 text-ocean-700 dark:bg-ocean-900/30 dark:text-ocean-300',
  planning: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  completed: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
}

function SkeletonCard() {
  return (
    <div className="card p-4 space-y-3">
      <div className="skeleton h-36 w-full rounded-xl" />
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-1/2" />
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [loading] = useState(false)
  const storedTrips = loadStoredTrips(user)
  const trips = storedTrips.length > 0 ? storedTrips : mockTrips

  const upcomingTrips = trips.filter(t => t.status !== 'completed').slice(0, 3)

  const totalBudget = trips.reduce((s, t) => s + t.budget, 0)
  const totalSpent = trips.reduce((s, t) => s + t.spent, 0)
  const plannedTrips = trips.filter(t => t.status !== 'completed').length
  const completedTrips = trips.filter(t => t.status === 'completed').length
  const displayName = user?.name || 'Traveler'
  const displayEmail = user?.email || ''
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        custom={0} variants={fadeUp} initial="hidden" animate="show"
        className="flex items-start justify-between"
      >
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Good morning ☀️</p>
          <h1 className="page-header">Hello, {displayName.split(' ')[0]}!</h1>
          {displayEmail && <p className="text-slate-500 dark:text-slate-400 mt-1">{displayEmail}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-sm transition-all">
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ocean-500 to-coral-500 text-white flex items-center justify-center font-semibold">
            {initials || 'TL'}
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            className="input pl-12 pr-4 py-4 text-base shadow-sm"
            placeholder="Search destinations, activities, cities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Planned Trips', value: plannedTrips, icon: '✈️', change: 'Current itinerary count' },
            { label: 'Completed Trips', value: completedTrips, icon: '✅', change: 'Trips already finished' },
            { label: 'Total Budget', value: `₹${(totalBudget / 100000).toFixed(1)}L`, icon: '💰', change: 'Across all trips' },
            { label: 'Spent So Far', value: `₹${(totalSpent / 1000).toFixed(0)}K`, icon: '📍', change: 'Budget used to date' },
          ].map((stat) => (
            <div key={stat.label} className="card p-4 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">{stat.label}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.change}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Plan New Trip', icon: Plus, color: 'from-ocean-500 to-ocean-700', path: '/create-trip' },
            { label: 'Explore Cities', icon: Compass, color: 'from-purple-500 to-purple-700', path: '/explore' },
            { label: 'View Budget', icon: Wallet, color: 'from-coral-500 to-rose-600', path: '/budget' },
          ].map(({ label, icon: Icon, color, path }) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium text-center leading-tight">{label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Budget Overview */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show">
        <div className="card p-5 bg-gradient-to-r from-ocean-600 to-purple-600 border-0 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/70 text-sm">Total Budget Across Trips</p>
              <p className="text-3xl font-bold mt-1">₹{(totalBudget / 100000).toFixed(1)}L</p>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-sm">Spent so far</p>
              <p className="text-xl font-semibold mt-1">₹{(totalSpent / 1000).toFixed(0)}K</p>
            </div>
          </div>
          <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(totalSpent / totalBudget) * 100}%` }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              className="absolute top-0 left-0 h-full bg-white rounded-full"
            />
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-white/60 text-xs">{((totalSpent / totalBudget) * 100).toFixed(0)}% used</p>
            <p className="text-white/60 text-xs">₹{((totalBudget - totalSpent) / 1000).toFixed(0)}K remaining</p>
          </div>
        </div>
      </motion.div>

      {/* Upcoming Trips */}
      <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Upcoming Trips</h2>
          <button
            onClick={() => navigate('/trips')}
            className="flex items-center gap-1 text-sm text-ocean-600 hover:text-ocean-700 font-medium"
          >
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {upcomingTrips.map((trip, i) => (
              <motion.div
                key={trip.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                whileHover={{ y: -4 }}
                className="card overflow-hidden cursor-pointer group"
                onClick={() => navigate(`/trips/${trip.id}`)}
              >
                <div className="relative h-40 overflow-hidden">
                  <CloudinaryImage
                    src={trip.coverImageUrl}
                    publicId={trip.publicId}
                    alt={trip.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    width={900}
                    height={600}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className={`absolute top-3 right-3 badge text-xs ${statusColors[trip.status]}`}>
                    {trip.status}
                  </span>
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white font-semibold text-sm">{trip.name}</p>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs">
                    <MapPin className="w-3 h-3" />
                    {trip.destinations.join(' → ')}
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs">
                    <Calendar className="w-3 h-3" />
                    {new Date(trip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} –{' '}
                    {new Date(trip.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      ₹{(trip.budget / 1000).toFixed(0)}K
                    </span>
                    <span className="text-xs text-slate-400">{trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Recommended Cities */}
      <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Recommended Cities</h2>
          <button className="flex items-center gap-1 text-sm text-ocean-600 hover:text-ocean-700 font-medium">
            See all <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {recommendedCities.map((city, i) => (
            <motion.div
              key={city.id}
              whileHover={{ y: -4 }}
              className="flex-shrink-0 w-48 card overflow-hidden group"
            >
              <button
                type="button"
                onClick={() => navigate(`/explore?place=${encodeURIComponent(city.name)}`)}
                className="w-full text-left"
                aria-label={`Explore ${city.name}`}
              >
                <div className="relative h-32 overflow-hidden">
                  <CloudinaryImage
                    publicId={city.publicId}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    width={800}
                    height={600}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${city.color} text-white font-medium`}>
                    {city.tag}
                  </span>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{city.name}</p>
                  <p className="text-xs text-slate-400">{city.country}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{city.estCost}</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-amber-500" />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{city.rating}</span>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
