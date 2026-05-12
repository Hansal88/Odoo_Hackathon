import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { TrendingUp, Zap, Bookmark, MapPin } from 'lucide-react'

function StatCard({ icon: Icon, label, value, trend, color = 'ocean' }) {
  const colorClasses = {
    ocean: 'text-ocean-500 bg-ocean-50 dark:bg-ocean-900/20',
    amber: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
    green: 'text-green-500 bg-green-50 dark:bg-green-900/20',
    rose: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20',
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card p-4 space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
            <TrendingUp className="w-3 h-3" />
            {trend}%
          </div>
        )}
      </div>
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
      </div>
    </motion.div>
  )
}

export default function TripStats({ trips, recentEvents = [] }) {
  const [animatedCounts, setAnimatedCounts] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    totalBudget: 0,
  })

  // Animate counters
  useEffect(() => {
    const counts = {
      total: trips.length,
      upcoming: trips.filter((t) => t.status === 'upcoming').length,
      completed: trips.filter((t) => t.status === 'completed').length,
      totalBudget: trips.reduce((sum, t) => sum + (t.budget || 0), 0),
    }

    let frame = 0
    const frames = 30
    const frameInterval = setInterval(() => {
      frame++
      const progress = frame / frames
      setAnimatedCounts({
        total: Math.floor(counts.total * progress),
        upcoming: Math.floor(counts.upcoming * progress),
        completed: Math.floor(counts.completed * progress),
        totalBudget: Math.floor(counts.totalBudget * progress),
      })
      if (frame === frames) clearInterval(frameInterval)
    }, 20)

    return () => clearInterval(frameInterval)
  }, [trips])

  const upcomingTrend = trips.length > 0
    ? Math.round((animatedCounts.upcoming / animatedCounts.total) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3"
    >
      <StatCard
        icon={MapPin}
        label="Total Trips"
        value={animatedCounts.total}
        color="ocean"
      />
      <StatCard
        icon={Zap}
        label="Upcoming"
        value={animatedCounts.upcoming}
        trend={upcomingTrend}
        color="amber"
      />
      <StatCard
        icon={Bookmark}
        label="Completed"
        value={animatedCounts.completed}
        trend={animatedCounts.completed > 0 ? 100 : 0}
        color="green"
      />
      <StatCard
        icon={TrendingUp}
        label="Total Budget"
        value={`₹${(animatedCounts.totalBudget / 100000).toFixed(1)}L`}
        color="rose"
      />
    </motion.div>
  )
}
