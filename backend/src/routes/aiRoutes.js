const express = require('express')
const router = express.Router()

const OpenAI = require('openai')

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

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

module.exports = router