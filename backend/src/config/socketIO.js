const socketIO = require('socket.io')
const jwt = require('jsonwebtoken')

// Store active connections
const activeConnections = new Map()

// Initialize Socket.IO
const initializeSocketIO = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  })

  // Middleware for authentication
  io.use((socket, next) => {
    try {
      const { userId } = socket.handshake.auth
      if (!userId) {
        return next(new Error('Authentication failed: userId not provided'))
      }
      socket.userId = userId
      socket.joinedAt = new Date()
      next()
    } catch (error) {
      console.error('Socket authentication error:', error)
      next(new Error('Authentication failed'))
    }
  })

  // Connection handler
  io.on('connection', (socket) => {
    const userId = socket.userId
    console.log(`User ${userId} connected: ${socket.id}`)

    // Track active connections
    if (!activeConnections.has(userId)) {
      activeConnections.set(userId, [])
    }
    activeConnections.get(userId).push(socket.id)

    // Emit connected event
    socket.emit('socket:connected', {
      socketId: socket.id,
      userId,
      timestamp: new Date(),
    })

    // Trip creation handler
    socket.on('trip:create', (data) => {
      console.log(`Trip created by ${userId}:`, data)
      io.emit('trip:created', {
        ...data,
        createdBy: userId,
        createdAt: new Date(),
      })
    })

    // Trip update handler
    socket.on('trip:update', (data) => {
      console.log(`Trip updated by ${userId}:`, data)
      io.emit('trip:updated', {
        ...data,
        updatedBy: userId,
        updatedAt: new Date(),
      })
    })

    // Trip delete handler
    socket.on('trip:delete', (data) => {
      console.log(`Trip deleted by ${userId}:`, data)
      io.emit('trip:deleted', {
        ...data,
        deletedBy: userId,
        deletedAt: new Date(),
      })
    })

    // Trip status change handler
    socket.on('trip:status-change', (data) => {
      console.log(`Trip status changed by ${userId}:`, data)
      io.emit('trip:status-changed', {
        ...data,
        changedBy: userId,
        changedAt: new Date(),
      })
    })

    // Budget update handler
    socket.on('trip:budget-update', (data) => {
      console.log(`Trip budget updated by ${userId}:`, data)
      io.emit('trip:budget-updated', {
        ...data,
        updatedBy: userId,
        updatedAt: new Date(),
      })
    })

    // Toggle favorite handler
    socket.on('trip:toggle-favorite', (data) => {
      io.emit('trip:favorite-toggled', {
        ...data,
        toggledBy: userId,
        toggledAt: new Date(),
      })
    })

    // Get active travelers for a trip
    socket.on('trip:get-active-travelers', (data) => {
      const { tripId } = data
      // This would be fetched from your database in a real scenario
      socket.emit('user:active', {
        tripId,
        travelers: Array.from(activeConnections.keys()).map((uid) => ({
          userId: uid,
          isActive: activeConnections.get(uid).length > 0,
        })),
      })
    })

    // Add collaborator handler
    socket.on('trip:add-collaborator', (data) => {
      const { tripId, userId: collaboratorId } = data
      io.emit('trip:collaborator-added', {
        tripId,
        collaboratorId,
        addedBy: userId,
        addedAt: new Date(),
      })
    })

    // Remove collaborator handler
    socket.on('trip:remove-collaborator', (data) => {
      const { tripId, userId: collaboratorId } = data
      io.emit('trip:collaborator-removed', {
        tripId,
        collaboratorId,
        removedBy: userId,
        removedAt: new Date(),
      })
    })

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected: ${socket.id}`)
      const userConnections = activeConnections.get(userId) || []
      const updatedConnections = userConnections.filter((id) => id !== socket.id)

      if (updatedConnections.length > 0) {
        activeConnections.set(userId, updatedConnections)
      } else {
        activeConnections.delete(userId)
      }

      // Emit user offline event
      io.emit('user:offline', {
        userId,
        offlineAt: new Date(),
      })
    })

    // Error handler
    socket.on('error', (error) => {
      console.error(`Socket error for user ${userId}:`, error)
    })
  })

  return io
}

// Helper function to get active user count
const getActiveUserCount = () => activeConnections.size

// Helper function to get active users
const getActiveUsers = () => Array.from(activeConnections.keys())

// Helper function to check if user is online
const isUserOnline = (userId) => activeConnections.has(userId)

module.exports = {
  initializeSocketIO,
  getActiveUserCount,
  getActiveUsers,
  isUserOnline,
}
