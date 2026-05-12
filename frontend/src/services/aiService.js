import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function stripCodeFences(content) {
  return String(content || '')
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim()
}

function normalizeExploreContent(payload, tripData = {}) {
  if (!payload) {
    return {
      title: tripData.savedTripName || tripData.trip || tripData.name || 'Explore Guide',
      tagline: `Explore ideas for ${tripData.destination || tripData.category || 'your trip'}`,
      placesToExplore: [],
      localExperiences: [],
      tipsForStyle: 'Your Explore guide will appear here once the AI response is available.',
      fullContent: '',
    }
  }

  if (typeof payload === 'object') {
    if (payload.fullContent && typeof payload.fullContent === 'string') {
      const parsedFromFullContent = normalizeExploreContent(payload.fullContent, tripData)
      return {
        ...payload,
        ...parsedFromFullContent,
      }
    }

    return {
      title: payload.title || tripData.savedTripName || tripData.trip || tripData.name || 'Explore Guide',
      tagline: payload.tagline || `Explore ideas for ${tripData.destination || tripData.category || 'your trip'}`,
      placesToExplore: payload.placesToExplore || [],
      localExperiences: payload.localExperiences || [],
      tipsForStyle: payload.tipsForStyle || payload.tips || '',
      fullContent: payload.fullContent || JSON.stringify(payload, null, 2),
      ...payload,
    }
  }

  const cleaned = stripCodeFences(payload)

  try {
    const parsed = JSON.parse(cleaned)
    return normalizeExploreContent(parsed, tripData)
  } catch (error) {
    return {
      title: tripData.savedTripName || tripData.trip || tripData.name || 'Explore Guide',
      tagline: `Explore ideas for ${tripData.destination || tripData.category || 'your trip'}`,
      placesToExplore: [],
      localExperiences: [],
      tipsForStyle: cleaned,
      fullContent: cleaned,
    }
  }
}

const aiService = {
  // Plan a complete trip
  async planTrip(destination, budget, days) {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/plan-trip`, {
        destination,
        budget,
        days,
      })
      return response.data
    } catch (error) {
      console.error('Error planning trip:', error)
      throw error
    }
  },

  // Get detailed exploration information
  async getExploreDetails(destination, travelStyle = 'general') {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/explore-details`, {
        destination,
        travelStyle,
      })
      return response.data
    } catch (error) {
      console.error('Error fetching explore details:', error)
      throw error
    }
  },

  async generateExploreContent(tripData = {}) {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/explore-details`, {
        tripData,
        destination:
          tripData.destination ||
          tripData.destinations?.[0] ||
          tripData.trip ||
          tripData.name ||
          tripData.category ||
          '',
        travelStyle: tripData.style || tripData.travelStyle || 'general',
      })

      const normalized = normalizeExploreContent(response.data?.data, tripData)

      return {
        ...response.data,
        data: normalized,
      }
    } catch (error) {
      console.error('Error generating explore content:', error)
      throw error
    }
  },

  // Get budget breakdown
  async getBudgetBreakdown(destination, totalBudget, days, travelers, style) {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/budget-breakdown`, {
        destination,
        totalBudget,
        days,
        travelers,
        style,
      })
      return response.data
    } catch (error) {
      console.error('Error fetching budget breakdown:', error)
      throw error
    }
  },

  // Get packing guide
  async getPackingGuide(destination, days, travelers, season, style) {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/packing-guide`, {
        destination,
        days,
        travelers,
        season,
        style,
      })
      return response.data
    } catch (error) {
      console.error('Error fetching packing guide:', error)
      throw error
    }
  },

  // Fetch explore data from MongoDB
  async fetchExploreData(tripId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/ai/explore/${tripId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('traveloop-token')}`,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching explore data:', error)
      throw error
    }
  },

  // Save explore data to MongoDB
  async saveExploreData(tripId, destination, travelStyle, fullContent) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ai/explore/save/${tripId}`,
        {
          destination,
          travelStyle,
          fullContent,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('traveloop-token')}`,
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Error saving explore data:', error)
      throw error
    }
  },

  // Fetch budget data from MongoDB
  async fetchBudgetData(tripId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/ai/budget/${tripId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('traveloop-token')}`,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching budget data:', error)
      throw error
    }
  },

  // Save budget data to MongoDB
  async saveBudgetData(tripId, destination, totalBudget, days, travelers, travelStyle, fullContent) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ai/budget/save/${tripId}`,
        {
          destination,
          totalBudget,
          days,
          travelers,
          travelStyle,
          fullContent,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('traveloop-token')}`,
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Error saving budget data:', error)
      throw error
    }
  },

  // Fetch packing data from MongoDB
  async fetchPackingData(tripId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/ai/packing/${tripId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('traveloop-token')}`,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching packing data:', error)
      throw error
    }
  },

  // Save packing data to MongoDB
  async savePackingData(tripId, destination, days, travelers, season, travelStyle, fullContent) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ai/packing/save/${tripId}`,
        {
          destination,
          days,
          travelers,
          season,
          travelStyle,
          fullContent,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('traveloop-token')}`,
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Error saving packing data:', error)
      throw error
    }
  },
}

export default aiService
