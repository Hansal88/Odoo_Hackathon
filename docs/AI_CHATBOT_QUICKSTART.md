# AI Chatbot Quick Start - Explore, Budget & Packing

## What's New? 🤖

Three new AI-powered chatbots provide intelligent guidance for:
- **🗺️ Explore** - Detailed destination information
- **💰 Budget** - Smart budget planning
- **🧳 Packing** - Complete packing checklist

All powered by OpenRouter's GPT-3.5-turbo AI model!

## Installation & Setup

### Prerequisites
Ensure you have an **OpenRouter API key**:
1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up for a free account
3. Get your API key from dashboard
4. Add to `.env` file: `OPENROUTER_API_KEY=your_key_here`

### Quick Setup
```bash
# Backend already configured - no additional dependencies needed
# Frontend already has required packages

# Just restart servers:
cd backend && npm run dev
cd frontend && npm run dev
```

## How to Use

### 🗺️ Explore Guide
1. Create a trip in Traveloop
2. Go to **Explore** page
3. Click the green 🗺️ button (bottom-right)
4. Chatbot loads with:
   - Top attractions & hidden gems
   - Local experiences
   - Pro tips & safe areas
   - Best times to visit
   - Budget estimates

### 💰 Budget Advisor
1. Go to **Budget** page
2. Click the orange 💰 button (bottom-right)
3. Get detailed breakdown:
   - Budget allocation %
   - Hotel recommendations
   - Food estimates
   - Money-saving tips
   - Daily spending limits

### 🧳 Packing Expert
1. Go to **Packing** page
2. Click the purple 🧳 button (bottom-right)
3. Receive:
   - Weather-specific clothing
   - Complete packing list
   - Category-organized items
   - Activity-specific gear
   - Packing tips

## Feature Highlights

### Available Actions
- **📋 Copy** - Copy all content to clipboard
- **🔊 Speak** - Listen to recommendations (text-to-speech)
- **🔄 Refresh** - Get new AI response

### Smart Features
- ✅ Destination-specific recommendations
- ✅ Budget-aware suggestions
- ✅ Travel style customization
- ✅ Auto-season detection
- ✅ Real-time AI generation
- ✅ Error handling with retry
- ✅ Dark mode support
- ✅ Mobile responsive

## Content Examples

### What Explore Guide Includes
```
- Top 10 attractions with opening hours
- 5+ hidden gems
- Local food recommendations
- Safe areas to explore
- Transport tips
- Activity time estimates
- Budget breakdowns
```

### What Budget Advisor Includes
```
- Budget allocation (30% stay, 20% food, etc.)
- Specific hotel price ranges
- Daily food budget breakdown
- Transport cost estimates
- Money-saving alternatives
- Where to splurge vs save
- Seasonal price variations
```

### What Packing Expert Includes
```
- Weather-appropriate clothing
- Footwear recommendations
- Toiletries & medications
- Electronics to bring
- Documents & essentials
- Destination-specific items
- Luggage optimization
- Pre-trip preparations
```

## Pro Tips

1. **Best Timing:** Generate content right after creating trip
2. **Copy & Save:** Copy recommendations to notes/document
3. **Listen Mode:** Use speak feature while doing other tasks
4. **Refresh Option:** Click refresh for alternative suggestions
5. **Multiple Destinations:** Run explore guide for each major destination

## Examples

### Simple Usage
```javascript
// User navigates to Explore page
// Clicks 🗺️ Explore Guide button
// Gets detailed information about Paris
```

### With Custom Trip
```javascript
Trip Data:
- Destination: Tokyo
- Budget: ₹200,000
- Days: 7
- Travelers: 2
- Style: Cultural

Result:
- Cultural attractions
- Budget restaurants
- Temple visits
- Shopping areas
- 7-day itinerary suggestions
```

## Common Questions

**Q: How long does it take to load?**
A: 2-5 seconds depending on internet speed

**Q: Can I get different suggestions?**
A: Yes! Click "Refresh" button for alternative content

**Q: Does it work offline?**
A: No, requires internet connection for AI

**Q: Can I share the content?**
A: Yes, copy it and share anywhere

**Q: Is my data secure?**
A: Yes, only trip metadata is sent, no personal info stored

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Chatbot doesn't open | Refresh page, check browser console |
| Loading spinner stuck | Check internet, wait 10 seconds, refresh |
| API error | Verify OPENROUTER_API_KEY in .env |
| Text-to-speech silent | Check volume, speaker permissions |
| Slow responses | Check API quota, try again later |

## Browser Requirements

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome)

## Keyboard Shortcuts

- **Esc** - Close chatbot (if implemented)
- **Tab** - Navigate through buttons
- **Enter** - Activate buttons

## Performance Tips

1. **First Load:** Chatbot initializes on demand
2. **Subsequent Uses:** Faster since APIs are cached
3. **Mobile:** Responsive design adapts automatically
4. **Dark Mode:** Supported natively

## File Locations

Files created for AI chatbots:
- Backend: `src/routes/aiRoutes.js` (updated)
- Frontend: `src/components/ContextualAIChatbot.jsx` (new)
- Frontend: `src/services/aiService.js` (new)
- Frontend: `src/pages/PlaceholderPages.jsx` (updated)

## Cost Considerations

OpenRouter pricing:
- Free tier: Limited requests
- Paid tier: Based on tokens used
- Estimated cost per request: ₹1-5 depending on response length
- Budget accordingly for production use

## API Endpoints

All endpoints are POST requests to:
- `/api/ai/explore-details` - Explore information
- `/api/ai/budget-breakdown` - Budget recommendations
- `/api/ai/packing-guide` - Packing checklist

Each requires trip context for personalization.

## Next Steps

1. ✅ Set up OpenRouter API key
2. ✅ Test with sample trips
3. ✅ Try all three chatbots
4. ✅ Copy recommendations to notes
5. ✅ Use text-to-speech while traveling
6. ✅ Share feedback and improvements

---

**Ready?** Create a trip and click any floating AI button to get started! 🚀

**Questions?** Check the full documentation in `AI_CHATBOT_GUIDE.md`
