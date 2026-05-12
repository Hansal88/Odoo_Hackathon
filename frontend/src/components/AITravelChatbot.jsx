import { useState } from 'react'
import axios from 'axios'
import { MessageCircle, X } from 'lucide-react'

export default function AITravelChatbot() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [destination, setDestination] = useState('')
  const [budget, setBudget] = useState('')
  const [days, setDays] = useState('')

  const [response, setResponse] = useState('')

  const generateTrip = async () => {
    try {
      setLoading(true)

      const res = await axios.post(
        'http://localhost:5000/api/ai/plan-trip',
        {
          destination,
          budget,
          days,
        }
      )

      setResponse(res.data.data)
    } catch (error) {
      console.error(error)

      setResponse('Failed to generate AI trip.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Bubble */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl text-white"
      >
        {open ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {/* Chatbot Box */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[95vw] h-[600px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">

          {/* Header */}
          <div className="bg-blue-600 text-white p-4">
            <h2 className="text-xl font-bold">
              AI Travel Planner
            </h2>

            <p className="text-sm opacity-80">
              Plan your budget-friendly trip ✨
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">

            {/* Destination */}
            <div>
              <label className="block text-sm mb-2 text-slate-300">
                Destination
              </label>

              <input
                type="text"
                placeholder="Goa"
                value={destination}
                onChange={(e) =>
                  setDestination(e.target.value)
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm mb-2 text-slate-300">
                Budget
              </label>

              <input
                type="number"
                placeholder="15000"
                value={budget}
                onChange={(e) =>
                  setBudget(e.target.value)
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none"
              />
            </div>

            {/* Days */}
            <div>
              <label className="block text-sm mb-2 text-slate-300">
                Days
              </label>

              <input
                type="number"
                placeholder="4"
                value={days}
                onChange={(e) =>
                  setDays(e.target.value)
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={generateTrip}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl py-3 font-semibold text-white"
            >
              {loading
                ? 'Generating...'
                : 'Generate AI Trip'}
            </button>

            {/* Response */}
            {response && (
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 whitespace-pre-wrap text-sm leading-7 text-slate-200">
                {response}
              </div>
            )}

          </div>
        </div>
      )}
    </>
  )
}