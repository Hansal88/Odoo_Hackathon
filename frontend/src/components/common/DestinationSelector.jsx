import { useState, useRef, useEffect } from 'react'
import { MapPin, X, Plus } from 'lucide-react'
import { famousDestinations } from '../../data/destinations'

export default function DestinationSelector({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customDestination, setCustomDestination] = useState('')
  const dropdownRef = useRef(null)

  // Parse destinations from comma-separated string
  const selectedDestinations = value
    .split(',')
    .map(d => d.trim())
    .filter(d => d.length > 0)

  // Combine all destination suggestions
  const allSuggestions = [
    ...new Set([
      ...famousDestinations.countries,
      ...famousDestinations.indianCities,
      ...famousDestinations.indianStates,
      ...famousDestinations.internationalCities,
      ...famousDestinations.popularRoutes,
    ]),
  ].sort()

  // Filter suggestions based on search term
  const filteredSuggestions = searchTerm
    ? allSuggestions.filter(
      dest =>
        dest.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedDestinations.includes(dest)
    )
    : allSuggestions.filter(dest => !selectedDestinations.includes(dest))

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
        setShowCustomInput(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const addDestination = destination => {
    const updated = [...selectedDestinations, destination].join(', ')
    onChange(updated)
    setSearchTerm('')
  }

  const removeDestination = destination => {
    const updated = selectedDestinations
      .filter(d => d !== destination)
      .join(', ')
    onChange(updated)
  }

  const addCustomDestination = () => {
    if (customDestination.trim()) {
      addDestination(customDestination.trim())
      setCustomDestination('')
      setShowCustomInput(false)
    }
  }

  return (
    <div className="space-y-3">
      <label className="label">Destinations *</label>

      {/* Selected Destinations Display */}
      {selectedDestinations.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedDestinations.map(dest => (
            <div
              key={dest}
              className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-sm font-medium"
            >
              <MapPin className="w-3.5 h-3.5" />
              {dest}
              <button
                onClick={() => removeDestination(dest)}
                className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search & Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
          <input
            className="input pl-10"
            placeholder={
              selectedDestinations.length > 0
                ? 'Add more destinations...'
                : 'Search destinations or click to browse...'
            }
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
          />
        </div>

        {/* Dropdown Menu */}
        {open && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
            {/* Search Results */}
            {filteredSuggestions.length > 0 ? (
              <div className="max-h-56 overflow-y-auto">
                {filteredSuggestions.slice(0, 10).map(dest => (
                  <button
                    key={dest}
                    onClick={() => {
                      addDestination(dest)
                      setOpen(false)
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 transition text-slate-900 dark:text-white"
                  >
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {dest}
                  </button>
                ))}

                {filteredSuggestions.length > 10 && (
                  <div className="px-4 py-2 text-xs text-slate-500 text-center">
                    +{filteredSuggestions.length - 10} more matches
                  </div>
                )}
              </div>
            ) : searchTerm ? (
              <div className="px-4 py-3 text-center text-slate-500 dark:text-slate-400">
                No destinations found
              </div>
            ) : (
              <div className="max-h-56 overflow-y-auto">
                {allSuggestions.slice(0, 10).map(dest => (
                  <button
                    key={dest}
                    onClick={() => {
                      addDestination(dest)
                      setOpen(false)
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 transition text-slate-900 dark:text-white"
                  >
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {dest}
                  </button>
                ))}

                <div className="px-4 py-2 text-xs text-slate-500 text-center border-t border-slate-200 dark:border-slate-700">
                  Showing 10 of {allSuggestions.length} destinations
                </div>
              </div>
            )}

            {/* Custom Destination Section */}
            <div className="border-t border-slate-200 dark:border-slate-700 p-3">
              {showCustomInput ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter custom destination..."
                    value={customDestination}
                    onChange={e => setCustomDestination(e.target.value)}
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        addCustomDestination()
                      }
                    }}
                    className="flex-1 input px-2 py-1.5 text-sm"
                    autoFocus
                  />
                  <button
                    onClick={addCustomDestination}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowCustomInput(false)
                      setCustomDestination('')
                    }}
                    className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="w-full flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-2 rounded-lg transition text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Custom Destination
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 mt-1">
        {selectedDestinations.length > 0
          ? `${selectedDestinations.length} destination${selectedDestinations.length > 1 ? 's' : ''} added`
          : 'Select from popular destinations or add your own'}
      </p>
    </div>
  )
}
