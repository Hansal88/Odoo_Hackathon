import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Bell, X, AlertCircle, CheckCircle, Zap, TrendingUp } from 'lucide-react'

export default function NotificationFeed({ events = [], maxVisible = 5 }) {
  const [visible, setVisible] = useState(true)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // Transform events to notifications
    const newNotifications = events.slice(0, maxVisible).map((event, index) => ({
      id: `${event.data.tripId}-${event.timestamp.getTime()}`,
      type: event.type,
      tripName: event.data.name || 'Trip',
      message: getNotificationMessage(event.type),
      icon: getNotificationIcon(event.type),
      color: getNotificationColor(event.type),
      timestamp: event.timestamp,
    }))
    setNotifications(newNotifications)
  }, [events, maxVisible])

  if (!visible || notifications.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-20 right-4 z-50 space-y-2 max-w-sm"
    >
      <AnimatePresence mode="popLayout">
        {notifications.map((notif) => (
          <NotificationItem key={notif.id} notification={notif} />
        ))}
      </AnimatePresence>
      {notifications.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setVisible(false)}
          className="w-full text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-1"
        >
          Clear notifications
        </motion.button>
      )}
    </motion.div>
  )
}

function NotificationItem({ notification }) {
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsClosing(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  const Icon = notification.icon
  const colorClasses = {
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    ocean: 'bg-ocean-50 dark:bg-ocean-900/20 border-ocean-200 dark:border-ocean-800',
    amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    rose: 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800',
  }

  const iconColorClasses = {
    green: 'text-green-600 dark:text-green-400',
    ocean: 'text-ocean-600 dark:text-ocean-400',
    amber: 'text-amber-600 dark:text-amber-400',
    rose: 'text-rose-600 dark:text-rose-400',
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`p-3 rounded-lg border flex gap-3 items-start backdrop-blur ${colorClasses[notification.color]}`}
    >
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColorClasses[notification.color]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
          {notification.tripName}
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
          {notification.message}
        </p>
        <p className="text-xs text-slate-400 mt-1">
          {formatTime(notification.timestamp)}
        </p>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsClosing(true)}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
      >
        <X className="w-4 h-4" />
      </motion.button>
      <motion.div
        animate={{ scaleX: isClosing ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-current origin-left"
        style={{ width: '100%' }}
      />
    </motion.div>
  )
}

function getNotificationMessage(type) {
  const messages = {
    created: 'New trip created',
    updated: 'Trip details updated',
    deleted: 'Trip deleted',
    status: 'Status changed',
  }
  return messages[type] || 'Trip event'
}

function getNotificationIcon(type) {
  const icons = {
    created: CheckCircle,
    updated: Zap,
    deleted: AlertCircle,
    status: TrendingUp,
  }
  return icons[type] || Bell
}

function getNotificationColor(type) {
  const colors = {
    created: 'green',
    updated: 'ocean',
    deleted: 'rose',
    status: 'amber',
  }
  return colors[type] || 'ocean'
}

function formatTime(timestamp) {
  const now = new Date()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)

  if (seconds < 60) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
