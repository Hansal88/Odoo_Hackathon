const express = require('express')
const router = express.Router()

const OpenAI = require('openai')
<<<<<<< HEAD
const TripExplore = require('../models/TripExplore')
const TripBudget = require('../models/TripBudget')
const TripPacking = require('../models/TripPacking')
const authMiddleware = require('../middleware/authMiddleware')
=======
>>>>>>> a50ef801b0859d710a0c82e1bb15db0cf3c41bb0

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

<<<<<<< HEAD
function stripCodeFences(content) {
  return String(content || '')
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim()
}

function parseExploreJson(content, fallback) {
  const cleaned = stripCodeFences(content)

  try {
    const parsed = JSON.parse(cleaned)
    return {
      ...fallback,
      ...parsed,
    }
  } catch (error) {
    return {
      ...fallback,
      tagline: cleaned || fallback.tagline,
      tipsForStyle: cleaned || fallback.tipsForStyle,
      placesToExplore: fallback.placesToExplore,
      localExperiences: fallback.localExperiences,
    }
  }
}

function normalizePackingSeason(value) {
  const season = String(value || '').trim().toLowerCase()
  if (['summer', 'monsoon', 'autumn', 'winter'].includes(season)) {
    return season
  }

  return 'summer'
}

function buildExploreFallback({
  resolvedTripName,
  resolvedDestination,
  resolvedStyle,
  resolvedTravelers,
  resolvedBudget,
  resolvedCategory,
}) {
  const title = resolvedTripName || 'Explore Guide'
  const destination = resolvedDestination || resolvedCategory || 'your trip'
  const category = String(resolvedCategory || 'general').toLowerCase()

  return {
    title,
    tagline: `Destination-aware ideas for ${destination} with a ${resolvedStyle} travel style.`,
    placesToExplore: [
      {
        name: `${destination} highlights`,
        description: `Start with the most iconic spots in ${destination} and keep the pace comfortable for ${resolvedTravelers} traveler(s).`,
      },
      {
        name: 'Local markets and neighborhoods',
        description: `Look for walkable areas where you can find food, culture, and budget-friendly experiences near your ₹${resolvedBudget} plan.`,
      },
      {
        name: 'Scenic viewpoint or nature stop',
        description: `Add one relaxed outdoor stop that fits the ${category} theme of the trip.`,
      },
      {
        name: 'Cultural landmark',
        description: `Include a place that gives your ${resolvedStyle} trip some local context and memorable photos.`,
      },
    ],
    localExperiences: [
      {
        name: 'Try a local meal',
        description: 'Plan one meal that stays within budget while still feeling special for the group.',
      },
      {
        name: 'Guided walk or short excursion',
        description: `Choose a short activity that works well for ${resolvedTravelers} traveler(s) and avoids overpacking the day.`,
      },
      {
        name: 'Evening stroll or cultural event',
        description: `Leave room for a low-cost experience that matches the ${resolvedStyle} style of the trip.`,
      },
    ],
    tipsForStyle: `For a ${resolvedStyle} trip to ${destination}, keep a daily buffer in the ₹${resolvedBudget} budget, group nearby stops together, and prefer flexible activities that suit ${resolvedTravelers} traveler(s).`,
  }
}

=======
>>>>>>> a50ef801b0859d710a0c82e1bb15db0cf3c41bb0
router.post('/plan-trip', async (req, res) => {
  try {
    const { destination, budget, days } = req.body

    const completion = await client.chat.completions.create({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `
Create a budget-friendly travel plan.

Destination: ${destination}
Budget: ₹${budget}
Days: ${days}

Include:
- daily itinerary
- places to visit
- affordable hotels
- food suggestions
- transport
- activities
- estimated costs
          `,
        },
      ],
    })

    res.json({
      success: true,
      data: completion.choices[0].message.content,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: 'AI planning failed',
    })
  }
})

<<<<<<< HEAD
router.post('/explore-details', async (req, res) => {
  try {
    const { tripData = {}, destination, travelStyle } = req.body

    const resolvedTripName = tripData.savedTripName || tripData.trip || tripData.name || 'Your trip'
    const resolvedDestination =
      tripData.destination ||
      tripData.destinations?.[0] ||
      tripData.trip ||
      tripData.savedTripName ||
      destination ||
      tripData.category ||
      resolvedTripName
    const resolvedStyle = tripData.style || travelStyle || 'general'
    const resolvedTravelers = tripData.travelers || 1
    const resolvedBudget = tripData.budget || tripData.totalBudget || 'Not specified'
    const resolvedCategory = tripData.category || tripData.theme || 'General'
    const fallbackContent = buildExploreFallback({
      resolvedTripName,
      resolvedDestination,
      resolvedStyle,
      resolvedTravelers,
      resolvedBudget,
      resolvedCategory,
    })

    const prompt = `You are a travel expert creating destination-aware Explore content for a saved trip.

Return ONLY valid JSON with this exact shape:
{
  "title": string,
  "tagline": string,
  "placesToExplore": [{ "name": string, "description": string }],
  "localExperiences": [{ "name": string, "description": string }],
  "tipsForStyle": string
}

Trip context:
- Trip name: ${resolvedTripName}
- Destination: ${resolvedDestination}
- Style: ${resolvedStyle}
- Travelers: ${resolvedTravelers}
- Budget in INR: ${resolvedBudget}
- Category: ${resolvedCategory}

Rules:
- Make the places and experiences specific to this exact trip context.
- Mention the trip style, budget, and traveler count naturally in the recommendations.
- Include 4 to 6 placesToExplore items and 3 to 5 localExperiences items.
- Keep descriptions practical and concise.
- Do not wrap the JSON in markdown or code fences.`

    let parsedContent = fallbackContent

    try {
      const completion = await client.chat.completions.create({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You generate strictly valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      })

      const rawContent = completion?.choices?.[0]?.message?.content || ''
      parsedContent = parseExploreJson(rawContent, fallbackContent)
    } catch (aiError) {
      console.error('OpenRouter explore generation failed, using fallback content:', aiError?.message || aiError)
    }

    res.json({
      success: true,
      data: {
        ...parsedContent,
        destination: resolvedDestination,
        travelStyle: resolvedStyle,
        tripName: resolvedTripName,
        category: resolvedCategory,
        travelers: resolvedTravelers,
        budget: resolvedBudget,
        fullContent: JSON.stringify(parsedContent, null, 2),
      },
    })
  } catch (error) {
    console.error('Explore details error:', error)
    const fallback = buildExploreFallback({
      resolvedTripName: req.body?.tripData?.savedTripName || req.body?.tripData?.trip || req.body?.tripData?.name || 'Your trip',
      resolvedDestination:
        req.body?.tripData?.destination ||
        req.body?.tripData?.destinations?.[0] ||
        req.body?.destination ||
        req.body?.tripData?.category ||
        'your trip',
      resolvedStyle: req.body?.tripData?.style || req.body?.travelStyle || 'general',
      resolvedTravelers: req.body?.tripData?.travelers || 1,
      resolvedBudget: req.body?.tripData?.budget || req.body?.tripData?.totalBudget || 'Not specified',
      resolvedCategory: req.body?.tripData?.category || req.body?.tripData?.theme || 'General',
    })

    return res.json({
      success: true,
      data: {
        ...fallback,
        destination: req.body?.tripData?.destination || req.body?.destination || req.body?.tripData?.category || 'your trip',
        travelStyle: req.body?.tripData?.style || req.body?.travelStyle || 'general',
        tripName: req.body?.tripData?.savedTripName || req.body?.tripData?.trip || req.body?.tripData?.name || 'Your trip',
        category: req.body?.tripData?.category || req.body?.tripData?.theme || 'General',
        travelers: req.body?.tripData?.travelers || 1,
        budget: req.body?.tripData?.budget || req.body?.tripData?.totalBudget || 'Not specified',
        fullContent: JSON.stringify(fallback, null, 2),
        fallbackUsed: true,
      },
    })
  }
})

router.post('/budget-breakdown', async (req, res) => {
  try {
    const { destination, totalBudget, days, travelers, style } = req.body

    const completion = await client.chat.completions.create({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `You are a travel budget consultant. Create a detailed budget breakdown for a ${style} trip.

Trip Details:
- Destination: ${destination}
- Total Budget: ₹${totalBudget}
- Days: ${days}
- Travelers: ${travelers}

Provide:
1. Budget allocation percentages (accommodation, food, transport, activities, shopping, emergency)
2. Detailed breakdown with specific recommendations:
   - Accommodation options (budget, mid-range, luxury) with estimated prices
   - Daily food budget breakdown (street food, restaurants, cafes)
   - Transport costs (local transport, inter-city, airport transfers)
   - Activity costs (entry fees, tours, experiences)
3. Money-saving tips for this destination
4. Hidden costs to watch out for
5. Alternatives to save money
6. Where to splurge vs where to save
7. Seasonal pricing variations
8. Recommended daily spending limit
9. Payment methods (cash, card, UPI)
10. Emergency fund recommendations

Format with clear categories and realistic Indian prices.`,
        },
      ],
    })

    res.json({
      success: true,
      data: completion.choices[0].message.content,
    })
  } catch (error) {
    console.error('Budget breakdown error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch budget details',
    })
  }
})

router.post('/packing-guide', async (req, res) => {
  try {
    const { destination, days, travelers, season, style } = req.body

    const completion = await client.chat.completions.create({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `You are a travel packing expert. Create a comprehensive packing list and guide.

Trip Details:
- Destination: ${destination}
- Duration: ${days} days
- Travelers: ${travelers}
- Season: ${season}
- Travel Style: ${style}

Provide:
1. Weather-specific clothing recommendations (temperature ranges, what to wear)
2. Complete packing checklist organized by category:
   - Clothing (specifics for the climate and activities)
   - Footwear (shoes, sandals, etc. for different situations)
   - Toiletries and personal care
   - Medications and first aid
   - Electronics and chargers
   - Documents and essentials
   - Optional items based on destination
3. Destination-specific items (beach wear, mountain gear, etc.)
4. Activity-specific gear (if applicable)
5. Packing tips and tricks:
   - How to pack efficiently
   - What to pack in carry-on vs checked baggage
   - Weight optimization tips
6. Items to avoid bringing
7. Items you can buy there (to save luggage space)
8. Local customs regarding clothing
9. Shopping tips if you forget something
10. Pre-trip preparations (insurance, vaccinations, etc.)

Format with clear sections, bullet points, and practical advice.`,
        },
      ],
    })

    res.json({
      success: true,
      data: completion.choices[0].message.content,
    })
  } catch (error) {
    console.error('Packing guide error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch packing guide',
    })
  }
})

// GET explore data for trip
router.get('/explore/:tripId', authMiddleware, async (req, res) => {
  try {
    const { tripId } = req.params
    const userId = req.user.userId || req.user._id

    const exploreData = await TripExplore.findOne({ tripId, userId })

    if (exploreData) {
      return res.json({
        success: true,
        data: exploreData,
      })
    }

    res.status(404).json({
      success: false,
      message: 'Explore data not found',
    })
  } catch (error) {
    console.error('Error fetching explore data:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch explore data',
    })
  }
})

// SAVE explore data for trip
router.post('/explore/save/:tripId', authMiddleware, async (req, res) => {
  try {
    const { tripId } = req.params
    const userId = req.user.userId || req.user._id
    const { destination, travelStyle, fullContent } = req.body

    if (!destination || !fullContent) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      })
    }

    let exploreData = await TripExplore.findOne({ tripId, userId })

    if (exploreData) {
      exploreData.destination = destination
      exploreData.travelStyle = travelStyle || 'adventure'
      exploreData.fullContent = fullContent
      exploreData.generatedAt = new Date()
    } else {
      exploreData = new TripExplore({
        tripId,
        userId,
        destination,
        travelStyle: travelStyle || 'adventure',
        fullContent,
      })
    }

    await exploreData.save()

    res.json({
      success: true,
      data: exploreData,
      message: 'Explore data saved successfully',
    })
  } catch (error) {
    console.error('Error saving explore data:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to save explore data',
    })
  }
})

// GET budget data for trip
router.get('/budget/:tripId', authMiddleware, async (req, res) => {
  try {
    const { tripId } = req.params
    const userId = req.user.userId || req.user._id

    const budgetData = await TripBudget.findOne({ tripId, userId })

    if (budgetData) {
      return res.json({
        success: true,
        data: budgetData,
      })
    }

    res.status(404).json({
      success: false,
      message: 'Budget data not found',
    })
  } catch (error) {
    console.error('Error fetching budget data:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch budget data',
    })
  }
})

// SAVE budget data for trip
router.post('/budget/save/:tripId', authMiddleware, async (req, res) => {
  try {
    const { tripId } = req.params
    const userId = req.user.userId || req.user._id
    const { destination, totalBudget, days, travelers, travelStyle, fullContent } = req.body

    if (!destination || !fullContent) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      })
    }

    let budgetData = await TripBudget.findOne({ tripId, userId })

    if (budgetData) {
      budgetData.destination = destination
      budgetData.totalBudget = totalBudget || 0
      budgetData.days = days || 0
      budgetData.travelers = travelers || 1
      budgetData.travelStyle = travelStyle || 'adventure'
      budgetData.fullContent = fullContent
      budgetData.generatedAt = new Date()
    } else {
      budgetData = new TripBudget({
        tripId,
        userId,
        destination,
        totalBudget: totalBudget || 0,
        days: days || 0,
        travelers: travelers || 1,
        travelStyle: travelStyle || 'adventure',
        fullContent,
      })
    }

    await budgetData.save()

    res.json({
      success: true,
      data: budgetData,
      message: 'Budget data saved successfully',
    })
  } catch (error) {
    console.error('Error saving budget data:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to save budget data',
    })
  }
})

// GET packing data for trip
router.get('/packing/:tripId', authMiddleware, async (req, res) => {
  try {
    const { tripId } = req.params
    const userId = req.user.userId || req.user._id

    const packingData = await TripPacking.findOne({ tripId, userId })

    if (packingData) {
      return res.json({
        success: true,
        data: packingData,
      })
    }

    res.status(404).json({
      success: false,
      message: 'Packing data not found',
    })
  } catch (error) {
    console.error('Error fetching packing data:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch packing data',
    })
  }
})

// SAVE packing data for trip
router.post('/packing/save/:tripId', authMiddleware, async (req, res) => {
  try {
    const { tripId } = req.params
    const userId = req.user.userId || req.user._id
    const { destination, days, travelers, season, travelStyle, fullContent } = req.body

    if (!destination || !fullContent) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      })
    }

    let packingData = await TripPacking.findOne({ tripId, userId })

    if (packingData) {
      packingData.destination = destination
      packingData.days = days || 0
      packingData.travelers = travelers || 1
      packingData.season = normalizePackingSeason(season)
      packingData.travelStyle = travelStyle || 'adventure'
      packingData.fullContent = fullContent
      packingData.generatedAt = new Date()
    } else {
      packingData = new TripPacking({
        tripId,
        userId,
        destination,
        days: days || 0,
        travelers: travelers || 1,
        season: normalizePackingSeason(season),
        travelStyle: travelStyle || 'adventure',
        fullContent,
      })
    }

    await packingData.save()

    res.json({
      success: true,
      data: packingData,
      message: 'Packing data saved successfully',
    })
  } catch (error) {
    console.error('Error saving packing data:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to save packing data',
    })
  }
})

=======
>>>>>>> a50ef801b0859d710a0c82e1bb15db0cf3c41bb0
module.exports = router