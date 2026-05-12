import io from 'socket.io-client'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

class SocketService {
  constructor() {
    this.socket = null
    this.isConnected = false
    this.listeners = {}
  }

  connect(userId) {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(API_URL, {
          auth: {
            userId,
            timestamp: new Date().getTime(),
          },
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
          transports: ['websocket', 'polling'],
        })

        this.socket.on('connect', () => {
          this.isConnected = true
          console.log('Socket connected:', this.socket.id)
          resolve(this.socket)
        })

        this.socket.on('disconnect', () => {
          this.isConnected = false
          console.log('Socket disconnected')
          this.emit('socket:disconnected')
        })

        this.socket.on('error', (error) => {
          console.error('Socket error:', error)
          this.emit('socket:error', error)
          reject(error)
        })

        // Setup default listeners
        this.socket.on('trip:updated', (data) => this.emit('trip:updated', data))
        this.socket.on('trip:deleted', (data) => this.emit('trip:deleted', data))
        this.socket.on('trip:created', (data) => this.emit('trip:created', data))
        this.socket.on('trip:status-changed', (data) => this.emit('trip:status-changed', data))
        this.socket.on('user:active', (data) => this.emit('user:active', data))
        this.socket.on('notification:new', (data) => this.emit('notification:new', data))
      } catch (error) {
        console.error('Socket connection failed:', error)
        reject(error)
      }
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.isConnected = false
    }
  }

  // Emit events to listeners
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data))
    }
  }

  // Subscribe to events
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)

    // Return unsubscribe function
    return () => {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback)
    }
  }

  // Send events to server
  send(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data)
    } else {
      console.warn('Socket not connected')
    }
  }

  // Trip operations
  createTrip(tripData) {
    this.send('trip:create', tripData)
  }

  updateTrip(tripId, updates) {
    this.send('trip:update', { tripId, updates })
  }

  deleteTrip(tripId) {
    this.send('trip:delete', { tripId })
  }

  updateTripStatus(tripId, status) {
    this.send('trip:status-change', { tripId, status })
  }

  addCollaborator(tripId, userId) {
    this.send('trip:add-collaborator', { tripId, userId })
  }

  removeCollaborator(tripId, userId) {
    this.send('trip:remove-collaborator', { tripId, userId })
  }

  updateTripBudget(tripId, spent) {
    this.send('trip:budget-update', { tripId, spent })
  }

  // Get active users on a trip
  getActiveTravelers(tripId) {
    this.send('trip:get-active-travelers', { tripId })
  }

  // Mark trip as favorite
  toggleFavorite(tripId) {
    this.send('trip:toggle-favorite', { tripId })
  }

  // Check if socket is ready
  isReady() {
    return this.socket && this.isConnected
  }

  // Get socket ID
  getId() {
    return this.socket ? this.socket.id : null
  }

  // Reconnect manually
  reconnect() {
    if (this.socket) {
      this.socket.connect()
    }
  }
}

// Export singleton instance
export default new SocketService()
