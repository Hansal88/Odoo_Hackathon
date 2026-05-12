import { useEffect, useState, useCallback, useRef } from 'react'
import socketService from '../services/socketService'

export function useSocket(userId) {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const unsubscribeRef = useRef([])

  useEffect(() => {
    const initSocket = async () => {
      try {
        if (!userId) {
          setIsLoading(false)
          return
        }

        if (socketService.isReady()) {
          setIsConnected(true)
          setIsLoading(false)
          return
        }

        await socketService.connect(userId)
        setIsConnected(true)
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Socket initialization error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    initSocket()

    return () => {
      unsubscribeRef.current.forEach((unsubscribe) => unsubscribe())
      unsubscribeRef.current = []
    }
  }, [userId])

  const subscribe = useCallback((event, callback) => {
    const unsubscribe = socketService.on(event, callback)
    unsubscribeRef.current.push(unsubscribe)
    return unsubscribe
  }, [])

  const emit = useCallback((event, data) => {
    socketService.send(event, data)
  }, [])

  return {
    isConnected,
    isLoading,
    error,
    subscribe,
    emit,
    socket: socketService,
  }
}

export function useTripSocket(tripId, userId) {
  const { subscribe, emit, ...rest } = useSocket(userId)
  const [activeTravelers, setActiveTravelers] = useState([])
  const [tripUpdates, setTripUpdates] = useState(null)

  useEffect(() => {
    if (!tripId) return

    // Subscribe to trip updates
    const unsubTrip = subscribe('trip:updated', (data) => {
      if (data.tripId === tripId) {
        setTripUpdates(data)
      }
    })

    const unsubStatus = subscribe('trip:status-changed', (data) => {
      if (data.tripId === tripId) {
        setTripUpdates((prev) => ({ ...prev, status: data.status, updatedAt: new Date() }))
      }
    })

    const unsubActive = subscribe('user:active', (data) => {
      if (data.tripId === tripId) {
        setActiveTravelers(data.travelers)
      }
    })

    // Request active travelers
    socketService.getActiveTravelers(tripId)

    return () => {
      unsubTrip()
      unsubStatus()
      unsubActive()
    }
  }, [tripId, subscribe])

  return {
    ...rest,
    emit,
    activeTravelers,
    tripUpdates,
    updateTrip: (updates) => emit('trip:update', { tripId, updates }),
    updateStatus: (status) => emit('trip:status-change', { tripId, status }),
    updateBudget: (spent) => emit('trip:budget-update', { tripId, spent }),
  }
}

export function useTripsSocket(userId) {
  const { subscribe, emit, ...rest } = useSocket(userId)
  const [tripEvents, setTripEvents] = useState([])
  const [stats, setStats] = useState({ created: 0, updated: 0, deleted: 0 })

  useEffect(() => {
    const unsubCreate = subscribe('trip:created', (data) => {
      setTripEvents((prev) => [{ type: 'created', data, timestamp: new Date() }, ...prev.slice(0, 9)])
      setStats((prev) => ({ ...prev, created: prev.created + 1 }))
    })

    const unsubUpdate = subscribe('trip:updated', (data) => {
      setTripEvents((prev) => [{ type: 'updated', data, timestamp: new Date() }, ...prev.slice(0, 9)])
      setStats((prev) => ({ ...prev, updated: prev.updated + 1 }))
    })

    const unsubDelete = subscribe('trip:deleted', (data) => {
      setTripEvents((prev) => [{ type: 'deleted', data, timestamp: new Date() }, ...prev.slice(0, 9)])
      setStats((prev) => ({ ...prev, deleted: prev.deleted + 1 }))
    })

    return () => {
      unsubCreate()
      unsubUpdate()
      unsubDelete()
    }
  }, [subscribe])

  return {
    ...rest,
    emit,
    tripEvents,
    stats,
    createTrip: (tripData) => emit('trip:create', tripData),
    updateTrip: (tripId, updates) => emit('trip:update', { tripId, updates }),
    deleteTrip: (tripId) => emit('trip:delete', { tripId }),
    toggleFavorite: (tripId) => emit('trip:toggle-favorite', { tripId }),
  }
}
