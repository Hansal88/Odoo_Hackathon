import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Calendar, MapPin, Wallet, Users, Sparkles, ArrowRight, Compass, CheckCircle2, Clock3, Mail, UserCircle2, Copy, ExternalLink, Plus, X, RefreshCcw, LogOut, Save, Edit3, MapPinned, ShieldCheck } from 'lucide-react'
import CloudinaryImage from '../components/common/CloudinaryImage'
import DestinationCarousel from '../components/common/DestinationCarousel'
import ContextualAIChatbot from '../components/ContextualAIChatbot'
import AIDataDisplay from '../components/AIDataDisplay'
import { authService } from '../services/authService'
import { getStoredTripById, loadStoredTrips } from '../utils/tripStorage'
import { useAuth } from '../hooks/useAuthHook'
import { getExploreSuggestions, getTravelProfile } from '../utils/travelPlanner'

export function ExplorePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()
  const storedTrips = loadStoredTrips(user)
  const selectedTripId = searchParams.get('tripId')
  const selectedPlace = searchParams.get('place')
  const trip = resolveTrip(storedTrips, selectedTripId)

  if (selectedPlace) {
    const profile = getTravelProfile(selectedPlace)
    const suggestions = getExploreSuggestions(selectedPlace)
    const cover = profile.publicIds?.[0]

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <section className="card overflow-hidden">
          <div className="relative h-72">
            {cover ? (
              <CloudinaryImage
                publicId={cover.publicId}
                alt={selectedPlace}
                className="w-full h-full object-cover"
                width={1400}
                height={700}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-ocean-600 to-sky-700" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-semibold mb-3 w-fit">
                <Compass className="w-3.5 h-3.5" />
                {profile.label}
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{selectedPlace}</h1>
              <p className="text-white/80 max-w-2xl">{suggestions.intro}</p>
            </div>
          </div>

          <div className="p-5 md:p-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr] items-start">
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
              <SummaryStat label="City" value={selectedPlace} icon={MapPin} />
              <SummaryStat label="Style" value={profile.label} icon={Sparkles} />
              <SummaryStat label="Cover" value={cover?.label || 'Curated view'} icon={Compass} />
              <SummaryStat label="Plan" value="Tap below for trip ideas" icon={Users} />
            </div>

            <div className="card p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Explore destination</p>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{selectedPlace}</h2>
                </div>
                <button onClick={() => navigate('/dashboard')} className="btn-secondary text-xs px-3 py-2">
                  Back to Dashboard
                </button>
              </div>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Browse the places and highlights below for this city.</p>
            </div>
          </div>
        </section>

        <section className="card p-6 space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">Places to explore</p>
            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">{profile.label}</h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <SimpleExploreList title="Must-see spots" items={suggestions.spots} />
            <SimpleExploreList title="Highlights" items={suggestions.highlights.map(item => ({ name: item, description: 'Top local highlight for this destination.' }))} />
          </div>
        </section>
      </motion.div>
    )
  }

  if (!trip) {
    return <PlaceholderPage title="Explore Cities" emoji="🌍" desc="Create a trip first so Explore can show destination-specific places." />
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* AI Explore Chatbot */}
      <ContextualAIChatbot
        context="explore"
        destination={trip.destinations[0]}
        tripData={trip}
        tripId={trip.id}
      />

      <section className="card overflow-hidden">
        <div className="relative h-72">
          <CloudinaryImage
            src={trip.coverImageUrl}
            publicId={trip.publicId}
            alt={trip.name}
            className="w-full h-full object-cover"
            width={1400}
            height={700}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-semibold mb-3 w-fit">
              <Compass className="w-3.5 h-3.5" />
              Explore plan
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{trip.name}</h1>
            <p className="text-white/80 max-w-2xl">Destination-aware spots to explore for {trip.destinations.join(' → ')}.</p>
          </div>
        </div>

        <div className="p-5 md:p-6 grid gap-4 lg:grid-cols-[1.3fr_0.9fr] items-start">
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
            <SummaryStat label="Trip" value={trip.destinations.join(' → ')} icon={MapPin} />
            <SummaryStat label="Style" value={capitalize(trip.style)} icon={Sparkles} />
            <SummaryStat label="Travelers" value={`${trip.travelers}`} icon={Users} />
            <SummaryStat label="Budget" value={formatCurrency(trip.budget)} icon={Wallet} />
          </div>

          <div className="card p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Saved trip</p>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{trip.name}</h2>
              </div>
              <button onClick={() => navigate('/packing')} className="btn-secondary text-xs px-3 py-2">
                View Packing
              </button>
            </div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Switch trips below to see different exploration ideas for each saved plan.</p>
            <TripSelector trips={storedTrips} selectedTripId={trip.id} onSelect={value => setSearchParams({ tripId: value })} />
          </div>
        </div>
      </section>

      <AIDataDisplay
        context="explore"
        tripId={trip.id}
        destination={trip.destinations[0]}
        tripData={trip}
      />
    </motion.div>
  )
}

export function BudgetPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()
  const storedTrips = loadStoredTrips(user)
  const selectedTripId = searchParams.get('tripId')
  const trip = resolveTrip(storedTrips, selectedTripId)

  if (!trip) {
    return <PlaceholderPage title="Budget Tracker" emoji="💰" desc="Create a trip first so Budget can show stay, food, and travel costs." />
  }

  const tripBudget = Number(trip.budget || 0)
  const tripDays = Number(trip.days || 0)
  const budgetPerDay = tripDays > 0 ? tripBudget / tripDays : tripBudget

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* AI Budget Advisor Chatbot */}
      <ContextualAIChatbot
        context="budget"
        destination={trip.destinations[0]}
        tripData={trip}
        tripId={trip.id}
      />

      <section className="card overflow-hidden">
        <div className="relative h-72">
          <CloudinaryImage
            src={trip.coverImageUrl}
            publicId={trip.publicId}
            alt={trip.name}
            className="w-full h-full object-cover"
            width={1400}
            height={700}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-semibold mb-3 w-fit">
              <Wallet className="w-3.5 h-3.5" />
              Budget plan
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{trip.name}</h1>
            <p className="text-white/80 max-w-2xl">Recommended stay, food, and travel spending based on your saved trip.</p>
          </div>
        </div>

        <div className="p-5 md:p-6 grid gap-4 lg:grid-cols-[1.3fr_0.9fr] items-start">
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
            <SummaryStat label="Total budget" value={formatCurrency(tripBudget)} icon={Wallet} />
            <SummaryStat label="Days" value={`${tripDays || '—'}`} icon={Calendar} />
            <SummaryStat label="Per day" value={formatCurrency(budgetPerDay)} icon={ArrowRight} />
            <SummaryStat label="Style" value={capitalize(trip.style)} icon={Sparkles} />
          </div>

          <div className="card p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Saved trip</p>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{trip.name}</h2>
              </div>
              <button onClick={() => navigate(`/trips/${trip.id}`)} className="btn-secondary text-xs px-3 py-2">
                Open Itinerary
              </button>
            </div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Switch trips below to compare budget splits across your saved plans.</p>
            <TripSelector trips={storedTrips} selectedTripId={trip.id} onSelect={value => setSearchParams({ tripId: value })} />
          </div>
        </div>
      </section>

      <AIDataDisplay
        context="budget"
        tripId={trip.id}
        destination={trip.destinations[0]}
        tripData={trip}
      />

    </motion.div>
  )
}

export function PackingPage() {
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const selectedTripId = searchParams.get('tripId')
  const storedTrips = loadStoredTrips(user)
  const trip = selectedTripId ? getStoredTripById(selectedTripId, user) : storedTrips[0] || null

  if (!trip) {
    return <PlaceholderPage title="Packing Checklist" emoji="🧳" desc="Create a trip first so Packing can generate destination-specific essentials." />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* AI Packing Expert Chatbot */}
      <ContextualAIChatbot
        context="packing"
        destination={trip?.destinations[0] || 'Your destination'}
        tripData={trip || {}}
        tripId={trip?.id}
      />

      <div>
        <h1 className="page-header mb-2">Packing Checklist</h1>
        <p className="text-slate-500 dark:text-slate-400">Destination-aware essentials for your next trip.</p>
      </div>

      <AIDataDisplay
        context="packing"
        tripId={trip?.id}
        destination={trip?.destinations[0] || 'Your destination'}
        tripData={trip || {}}
      />
    </motion.div>
  )
}

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, loading, logout, resendVerificationEmail } = useAuth()
  const [account, setAccount] = useState(null)
  const [accountLoading, setAccountLoading] = useState(true)
  const [accountError, setAccountError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [resending, setResending] = useState(false)
  const [profileDraft, setProfileDraft] = useState(createEmptyProfileDraft())
  const [interestInput, setInterestInput] = useState('')

  useEffect(() => {
    let active = true

    async function hydrateAccount() {
      const token = localStorage.getItem('traveloop-token')
      if (!token) {
        setAccountLoading(false)
        return
      }

      try {
        const response = await authService.getCurrentUser()
        if (!active) return

        if (response?.success && response?.data) {
          setAccount(response.data)
          setAccountError('')
        } else {
          setAccountError(response?.message || 'Unable to load account details')
        }
      } catch (error) {
        if (!active) return
        setAccountError(error?.response?.data?.message || error?.message || 'Unable to load account details')
      } finally {
        if (active) setAccountLoading(false)
      }
    }

    hydrateAccount()

    return () => {
      active = false
    }
  }, [])

  const resolvedUser = useMemo(() => resolveProfileUser(user, account), [user, account])
  const storedTrips = useMemo(
    () => loadStoredTrips(resolvedUser || user),
    [resolvedUser?.email, resolvedUser?.userId, resolvedUser?._id, user?.email, user?.userId, user?._id],
  )
  const profileStorageKey = useMemo(
    () => getProfileStorageKey(resolvedUser || user),
    [resolvedUser?.email, resolvedUser?.userId, resolvedUser?._id, user?.email, user?.userId, user?._id],
  )

  useEffect(() => {
    setProfileDraft(loadProfileDraft(profileStorageKey, resolvedUser, storedTrips))
  }, [profileStorageKey, resolvedUser, storedTrips])

  const travelStats = useMemo(() => buildTravelStats(storedTrips), [storedTrips])
  const suggestedInterests = useMemo(() => {
    const seeded = [
      ...travelStats.topDestinations,
      ...travelStats.styles,
      'Weekend getaway',
      'Mountain escape',
      'City break',
      'Food trails',
      'Road trips',
    ]

    return Array.from(new Set(seeded.filter(Boolean)))
  }, [travelStats.topDestinations, travelStats.styles])

  const handleSaveProfile = async event => {
    event.preventDefault()
    setSaving(true)
    setStatusMessage('')

    try {
      const nextDraft = {
        ...profileDraft,
        interests: Array.from(new Set(profileDraft.interests.filter(Boolean))),
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem(profileStorageKey, JSON.stringify(nextDraft))
      setProfileDraft(nextDraft)
      setStatusMessage('Profile preferences saved locally.')
    } finally {
      setSaving(false)
    }
  }

  const handleAddInterest = interest => {
    const normalized = String(interest || '').trim()
    if (!normalized) return

    setProfileDraft(current => ({
      ...current,
      interests: Array.from(new Set([...current.interests, normalized])),
    }))
    setInterestInput('')
  }

  const handleRemoveInterest = interest => {
    setProfileDraft(current => ({
      ...current,
      interests: current.interests.filter(item => item !== interest),
    }))
  }

  const handleCopy = async value => {
    if (!value || !navigator?.clipboard) return
    await navigator.clipboard.writeText(value)
    setStatusMessage('Copied to clipboard.')
  }

  const handleResendVerification = async () => {
    const email = resolvedUser?.email
    if (!email) return

    setResending(true)
    setStatusMessage('')
    try {
      await resendVerificationEmail(email)
      setStatusMessage('Verification email sent again.')
    } catch (error) {
      setStatusMessage(error?.message || 'Unable to resend verification email.')
    } finally {
      setResending(false)
    }
  }

  if (loading || accountLoading) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="card p-6 animate-pulse">
          <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700 mb-4" />
          <div className="h-10 w-72 rounded bg-slate-200 dark:bg-slate-700 mb-3" />
          <div className="h-4 w-56 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card h-64 animate-pulse bg-slate-100 dark:bg-slate-900/40" />
          <div className="card h-64 animate-pulse bg-slate-100 dark:bg-slate-900/40" />
          <div className="card h-64 animate-pulse bg-slate-100 dark:bg-slate-900/40" />
        </div>
      </motion.div>
    )
  }

  if (!resolvedUser) {
    return (
      <PlaceholderPage
        title="Profile & Settings"
        emoji="👤"
        desc="Sign in to view your credentials, saved interests, and trip history."
      />
    )
  }

  const initials = getInitials(resolvedUser.name || resolvedUser.email || 'Traveler')
  const memberSince = formatDate(resolvedUser.createdAt || resolvedUser.updatedAt)
  const isVerified = Boolean(resolvedUser.isVerified)
  const activeInterests = profileDraft.interests.length ? profileDraft.interests : travelStats.topDestinations.slice(0, 3)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="card overflow-hidden">
        <div className="relative bg-gradient-to-br from-ocean-600 via-ocean-700 to-cyan-800 text-white p-6 md:p-8">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.4),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.22),_transparent_32%)]" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="h-20 w-20 rounded-3xl bg-white/15 backdrop-blur flex items-center justify-center text-2xl font-bold ring-1 ring-white/20">
                {initials}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-white/70 mb-2">Profile</p>
                <h1 className="text-3xl md:text-4xl font-display font-bold">{resolvedUser.name || 'Your account'}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/80">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur">
                    <Mail className="w-3.5 h-3.5" />
                    {resolvedUser.email || 'Email not available in this session'}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {isVerified ? 'Verified account' : 'Email pending verification'}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur">
                    <Clock3 className="w-3.5 h-3.5" />
                    Member since {memberSince}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate('/trips')} className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium hover:bg-white/15 transition-colors">
                <ExternalLink className="w-4 h-4" />
                My Trips
              </button>
              <button onClick={() => navigate('/create-trip')} className="inline-flex items-center gap-2 rounded-xl bg-white text-ocean-700 px-4 py-2.5 text-sm font-semibold hover:bg-white/90 transition-colors">
                <Edit3 className="w-4 h-4" />
                Create Trip
              </button>
            </div>
          </div>
        </div>

        {!isVerified ? (
          <div className="border-t border-amber-100 bg-amber-50/80 dark:bg-amber-900/20 dark:border-amber-900/40 px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-200">Your account is not verified yet.</p>
              <p className="text-sm text-amber-800/80 dark:text-amber-200/80">Verify your email to keep account access smooth and secure.</p>
            </div>
            <button onClick={handleResendVerification} disabled={resending || !resolvedUser.email} className="btn-secondary inline-flex items-center gap-2 disabled:opacity-60">
              <RefreshCcw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
              {resending ? 'Sending...' : 'Resend verification'}
            </button>
          </div>
        ) : null}
      </section>

      {accountError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-200">
          {accountError}
        </div>
      ) : null}

      {statusMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
          {statusMessage}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.05fr_1.2fr_0.95fr]">
        <section className="card p-5 space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="section-title">Account Details</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Your credentials and session summary.</p>
            </div>
            <button onClick={() => handleCopy(resolvedUser.email || resolvedUser.userId || '')} className="btn-secondary inline-flex items-center gap-2 text-xs px-3 py-2">
              <Copy className="w-4 h-4" />
              Copy
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <ProfileRow label="Display name" value={resolvedUser.name || '—'} icon={UserCircle2} />
            <ProfileRow label="Email" value={resolvedUser.email || '—'} icon={Mail} />
            <ProfileRow label="User ID" value={resolvedUser.userId || resolvedUser._id || '—'} icon={MapPinned} />
            <ProfileRow
              label="Verification"
              value={isVerified ? 'Verified' : 'Pending verification'}
              icon={isVerified ? CheckCircle2 : Clock3}
              tone={isVerified ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}
            />
            <ProfileRow label="Session token" value={localStorage.getItem('traveloop-token') ? 'Active' : 'Missing'} icon={ShieldCheck} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ProfileStat label="Saved trips" value={`${storedTrips.length}`} />
            <ProfileStat label="Interest tags" value={`${profileDraft.interests.length}`} />
            <ProfileStat label="Top destination" value={travelStats.topDestination || 'None yet'} className="col-span-2" />
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <button onClick={() => navigate('/dashboard')} className="btn-secondary inline-flex items-center gap-2 text-xs px-3 py-2">
              <ExternalLink className="w-4 h-4" />
              Dashboard
            </button>
            <button onClick={logout} className="btn-secondary inline-flex items-center gap-2 text-xs px-3 py-2">
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </section>

        <section className="card p-5 space-y-5">
          <div>
            <h2 className="section-title">Travel Preferences</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Save the places and themes you care about most.</p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Preferred name</span>
                <input
                  id="profile-display-name"
                  name="displayName"
                  value={profileDraft.displayName}
                  onChange={event => setProfileDraft(current => ({ ...current, displayName: event.target.value }))}
                  placeholder={resolvedUser.name || 'How should we address you?'}
                  className="input"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Home base</span>
                <input
                  id="profile-home-base"
                  name="homeBase"
                  value={profileDraft.homeBase}
                  onChange={event => setProfileDraft(current => ({ ...current, homeBase: event.target.value }))}
                  placeholder="City or region"
                  className="input"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">About your travel style</span>
              <textarea
                id="profile-bio"
                name="bio"
                value={profileDraft.bio}
                onChange={event => setProfileDraft(current => ({ ...current, bio: event.target.value }))}
                placeholder="Mountains, food, slow travel, budget trips, family holidays..."
                rows={4}
                className="input resize-none"
              />
            </label>

            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Interest tags</span>
                <span className="text-xs text-slate-400">Add what you want to see more often</span>
              </div>
              <div className="flex gap-2">
                <input
                  id="profile-interest-input"
                  name="interest"
                  value={interestInput}
                  onChange={event => setInterestInput(event.target.value)}
                  onKeyDown={event => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      handleAddInterest(interestInput)
                    }
                  }}
                  placeholder="Add an interest"
                  className="input flex-1"
                />
                <button type="button" onClick={() => handleAddInterest(interestInput)} className="btn-secondary inline-flex items-center gap-2 px-4">
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {activeInterests.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleRemoveInterest(interest)}
                  className="inline-flex items-center gap-2 rounded-full border border-ocean-100 bg-ocean-50 px-3 py-1.5 text-sm text-ocean-700 hover:bg-ocean-100 dark:border-ocean-900/60 dark:bg-ocean-950/40 dark:text-ocean-300"
                >
                  {interest}
                  <X className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Quick add from your trips</p>
              <div className="flex flex-wrap gap-2">
                {suggestedInterests.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleAddInterest(interest)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:border-ocean-300 hover:text-ocean-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300"
                  >
                    + {interest}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button type="submit" disabled={saving} className="btn-primary inline-flex items-center gap-2 disabled:opacity-70">
                <Save className={`w-4 h-4 ${saving ? 'animate-pulse' : ''}`} />
                {saving ? 'Saving...' : 'Save preferences'}
              </button>
              <p className="text-xs text-slate-400">Preferences are stored locally per account.</p>
            </div>
          </form>
        </section>

        <section className="card p-5 space-y-5">
          <div>
            <h2 className="section-title">Travel Snapshot</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">What your saved trips say about your style.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ProfileStat label="Trips saved" value={`${travelStats.totalTrips}`} />
            <ProfileStat label="Cities tracked" value={`${travelStats.cityCount}`} />
            <ProfileStat label="Popular style" value={travelStats.topStyle || '—'} className="col-span-2" />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Recent trips</p>
            <div className="space-y-3">
              {storedTrips.length ? (
                storedTrips.slice(0, 3).map(trip => (
                  <button
                    key={trip.id}
                    type="button"
                    onClick={() => navigate(`/trips/${trip.id}`)}
                    className="w-full text-left rounded-2xl border border-slate-100 bg-slate-50 p-4 hover:border-ocean-200 hover:bg-ocean-50/50 transition-colors dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-ocean-800"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{trip.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{trip.destinations.join(' → ')}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="rounded-full bg-white px-2.5 py-1 dark:bg-slate-900/70">{capitalize(trip.style)}</span>
                      <span className="rounded-full bg-white px-2.5 py-1 dark:bg-slate-900/70">₹{Number(trip.budget || 0).toLocaleString('en-IN')}</span>
                      <span className="rounded-full bg-white px-2.5 py-1 dark:bg-slate-900/70">{trip.travelers} travelers</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  No saved trips yet. Create one to personalize this profile.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  )
}

export function ItineraryPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const trip = getStoredTripById(id, user)

  if (!trip) {
    return (
      <PlaceholderPage title="Itinerary Builder" emoji="🗓️" desc="Build a day-by-day plan for your trip." />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="relative h-72 rounded-3xl overflow-hidden">
        <CloudinaryImage
          src={trip.coverImageUrl}
          publicId={trip.publicId}
          alt={trip.name}
          className="w-full h-full object-cover"
          width={1400}
          height={700}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {trip.status}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{trip.name}</h1>
          <p className="text-white/80 max-w-2xl">{trip.description}</p>
        </div>
      </div>

      {trip.destinationImages && trip.destinationImages.length > 0 && (
        <DestinationCarousel images={trip.destinationImages} />
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-5 space-y-4 lg:col-span-2">
          <h2 className="section-title">Trip Details</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <Detail label="Destinations" value={trip.destinations.join(' → ')} icon={MapPin} />
            <Detail label="Dates" value={`${trip.startDate} → ${trip.endDate}`} icon={Calendar} />
            <Detail label="Travelers" value={`${trip.travelers}`} icon={Users} />
            <Detail label="Budget" value={`₹${(trip.budget / 1000).toFixed(0)}K`} icon={Wallet} />
            <Detail label="Style" value={trip.style} icon={Sparkles} />
            <Detail label="Status" value={trip.status} icon={ArrowRight} />
          </div>
        </div>

        <div className="card p-5 space-y-4">
          <h2 className="section-title">Summary</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Everything from Create Trip is shown here.</p>
          <div className="space-y-3 text-sm">
            <Row label="Trip Name" value={trip.name} />
            <Row label="Description" value={trip.description || '—'} />
            <Row label="Budget Range" value={trip.budgetRange || '—'} />
            <Row label="Cover Image" value={trip.publicId || 'Cloudinary'} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function Detail({ label, value, icon: Icon }) {
  return (
    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-2 uppercase tracking-wide">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <p className="font-semibold text-slate-900 dark:text-white break-words">{value}</p>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0 last:pb-0">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-medium text-slate-900 dark:text-white text-right break-words">{value}</span>
    </div>
  )
}

function ProfileRow({ label, value, icon: Icon, tone = 'text-slate-900 dark:text-white' }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/40">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>
      <span className={`font-medium text-right break-words ${tone}`}>{value}</span>
    </div>
  )
}

function ProfileStat({ label, value, className = '' }) {
  return (
    <div className={`rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/40 ${className}`}>
      <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">{label}</p>
      <p className="font-semibold text-slate-900 dark:text-white break-words">{value}</p>
    </div>
  )
}

function createEmptyProfileDraft() {
  return {
    displayName: '',
    homeBase: '',
    bio: '',
    interests: [],
    updatedAt: null,
  }
}

function getProfileStorageKey(user) {
  const identity = user?.email || user?.userId || user?._id || 'guest'
  return `traveloop-profile:${identity}`
}

function loadProfileDraft(storageKey, resolvedUser, storedTrips) {
  try {
    const raw = localStorage.getItem(storageKey)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        ...createEmptyProfileDraft(),
        ...parsed,
        interests: Array.isArray(parsed?.interests) ? parsed.interests.filter(Boolean) : [],
      }
    }
  } catch {
    // Fall back to seeded defaults below.
  }

  const tripInterests = Array.from(new Set(storedTrips.flatMap(trip => trip.destinations || []).filter(Boolean))).slice(0, 5)

  return {
    ...createEmptyProfileDraft(),
    displayName: resolvedUser?.name || '',
    interests: tripInterests,
  }
}

function resolveProfileUser(user, account) {
  const candidates = [account, account?.data, user, user?.data].filter(Boolean)

  for (const candidate of candidates) {
    const resolved = normalizeUser(candidate)
    if (resolved) return resolved
  }

  return null
}

function normalizeUser(candidate) {
  if (!candidate || typeof candidate !== 'object') return null

  const maybeUser = candidate.data && typeof candidate.data === 'object' ? candidate.data : candidate
  const name = maybeUser.name || candidate.name || candidate.data?.name
  const email = maybeUser.email || candidate.email || candidate.data?.email
  const userId = maybeUser.userId || maybeUser._id || candidate.userId || candidate._id || candidate.id

  if (!name && !email && !userId) return null

  return {
    ...maybeUser,
    name,
    email,
    userId,
    isVerified: Boolean(maybeUser.isVerified ?? candidate.isVerified),
  }
}

function buildTravelStats(trips) {
  const destinationCounts = new Map()
  const styleCounts = new Map()

  trips.forEach(trip => {
    ;(trip.destinations || []).forEach(destination => {
      const normalized = String(destination || '').trim()
      if (!normalized) return
      destinationCounts.set(normalized, (destinationCounts.get(normalized) || 0) + 1)
    })

    const style = String(trip.style || '').trim()
    if (style) {
      styleCounts.set(style, (styleCounts.get(style) || 0) + 1)
    }
  })

  const topDestination = Array.from(destinationCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
  const topStyle = Array.from(styleCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
  const topDestinations = Array.from(destinationCounts.entries()).sort((a, b) => b[1] - a[1]).map(([destination]) => destination)
  const styles = Array.from(styleCounts.entries()).sort((a, b) => b[1] - a[1]).map(([style]) => style)

  return {
    totalTrips: trips.length,
    cityCount: destinationCounts.size,
    topDestination,
    topStyle: topStyle ? capitalize(topStyle) : '',
    topDestinations,
    styles,
  }
}

function getInitials(value) {
  return String(value || 'T')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('')
}

function formatDate(value) {
  if (!value) return 'just now'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'recently'

  return date.toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  })
}

function PlaceholderPage({ title, emoji, desc }) {
  const navigate = useNavigate()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="text-6xl mb-4"
      >
        {emoji}
      </motion.div>
      <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">{title}</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-xs">{desc}</p>
      <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-ocean-50 dark:bg-ocean-900/20 border border-ocean-200 dark:border-ocean-800">
        <span className="text-ocean-600 dark:text-ocean-400 text-sm font-medium">🚧 Coming up in next build!</span>
      </div>
      <button onClick={() => navigate('/dashboard')} className="btn-secondary mt-4">
        Back to Dashboard
      </button>
    </motion.div>
  )
}

function SimpleExploreList({ title, items }) {
  return (
    <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">{title}</h3>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.name} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-4">
            <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function TripSelector({ trips, selectedTripId, onSelect }) {
  if (!trips.length) return null

  return (
    <div className="mt-4">
      <label className="text-xs uppercase tracking-wide text-slate-400 mb-2 block">Saved trip</label>
      <select
        id="saved-trip-select"
        name="savedTrip"
        value={selectedTripId}
        onChange={event => onSelect(event.target.value)}
        className="input"
      >
        {trips.map(trip => (
          <option key={trip.id} value={trip.id}>
            {trip.name} - {trip.destinations.join(' → ')}
          </option>
        ))}
      </select>
    </div>
  )
}

function SummaryStat({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide mb-2">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <p className="font-semibold text-slate-900 dark:text-white break-words">{value}</p>
    </div>
  )
}

function resolveTrip(trips, selectedTripId) {
  if (!trips.length) return null
  if (selectedTripId) {
    const selectedTrip = trips.find(trip => String(trip.id) === String(selectedTripId))
    if (selectedTrip) return selectedTrip
  }
  return trips[0] || null
}

function formatCurrency(amount) {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`
}

function capitalize(value) {
  if (!value) return 'General'
  return String(value)
    .split(' ')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

