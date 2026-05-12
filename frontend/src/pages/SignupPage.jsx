import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Globe, ArrowRight, Check } from 'lucide-react'
import { useAuth } from '../hooks/useAuthHook'

const destinations = ['Paris', 'Bali', 'Tokyo', 'Santorini', 'New York', 'Kyoto']

export default function SignupPage() {
  const navigate = useNavigate()
    const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (form.password.length < 6) e.password = 'Min 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    
    try {
      const response = await register(form.name, form.email, form.password)
      if (response && response.success) {
        navigate('/verify-email', { state: { email: form.email } })
        return
      }
      // show server-side message if available
      setErrors({ submit: (response && response.message) || 'Registration failed' })
    } catch (err) {
      setErrors({ submit: err.message || 'Registration failed' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors(err => ({ ...err, [field]: '' }))
  }

  const passwordStrength = () => {
    const p = form.password
    if (p.length === 0) return 0
    if (p.length < 4) return 1
    if (p.length < 8) return 2
    return 3
  }
  const strength = passwordStrength()
  const strengthColors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-green-400']
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong']

  return (
    <div className="min-h-screen flex">
      {/* Left — Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        {/* Animated gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-900 via-slate-900 to-purple-900" />
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-20"
              style={{
                width: `${150 + i * 80}px`,
                height: `${150 + i * 80}px`,
                background: i % 2 === 0
                  ? 'radial-gradient(circle, #0ca4e8, transparent)'
                  : 'radial-gradient(circle, #8b5cf6, transparent)',
                left: `${10 + i * 12}%`,
                top: `${10 + i * 10}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.15, 0.3, 0.15],
              }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">Traveloop</span>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-ocean-300 text-sm font-medium mb-4 tracking-wider uppercase">Join 50,000+ travellers</p>
              <h2 className="text-4xl font-display font-bold text-white leading-tight mb-6">
                Your next adventure<br />starts here
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Plan smarter trips, manage your budget, and discover breathtaking destinations with Traveloop.
              </p>
            </motion.div>

            {/* Destination Pills */}
            <div className="flex flex-wrap gap-2 mt-8">
              {destinations.map((d, i) => (
                <motion.span
                  key={d}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-white text-sm border border-white/10 hover:bg-white/20 cursor-default transition-colors"
                >
                  {d}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[['50K+', 'Travelers'], ['120+', 'Countries'], ['1M+', 'Activities']].map(([val, label]) => (
              <div key={label} className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
                <p className="text-2xl font-bold text-white">{val}</p>
                <p className="text-slate-400 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-ocean flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-slate-900 dark:text-white">Traveloop</span>
          </div>

          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">Create account</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Start planning your perfect trip today</p>

          

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs text-slate-400">sign up with email</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.submit && <p className="text-red-500 text-sm mb-2">{errors.submit}</p>}
            {/* Name */}
            <div>
              <label className="label" htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                name="name"
                className={`input ${errors.name ? 'border-red-400 focus:ring-red-300' : ''}`}
                placeholder="Aarav Shah"
                value={form.name}
                onChange={handleChange('name')}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="label" htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                name="email"
                type="email"
                className={`input ${errors.email ? 'border-red-400 focus:ring-red-300' : ''}`}
                placeholder="aarav@example.com"
                value={form.email}
                onChange={handleChange('email')}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="label" htmlFor="signup-password">Password</label>
              <div className="relative">
                <input
                  id="signup-password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  className={`input pr-10 ${errors.password ? 'border-red-400 focus:ring-red-300' : ''}`}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={handleChange('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength */}
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColors[strength] : 'bg-slate-200 dark:bg-slate-700'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">{strengthLabels[strength]}</p>
                </div>
              )}
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* T&C */}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              By signing up, you agree to our{' '}
              <span className="text-ocean-600 cursor-pointer hover:underline">Terms</span> and{' '}
              <span className="text-ocean-600 cursor-pointer hover:underline">Privacy Policy</span>
            </p>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-ocean-600 font-medium hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
