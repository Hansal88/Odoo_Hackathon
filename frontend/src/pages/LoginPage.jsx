import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Globe, ArrowRight, MapPin } from 'lucide-react'
import { useAuth } from '../hooks/useAuthHook'
const bgImages = [
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80',
]

export default function LoginPage() {
  const navigate = useNavigate()
    const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const validate = () => {
    const e = {}
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (!form.password) e.password = 'Password required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setMessage({ type: '', text: '' })
    
    try {
      const response = await login(form.email, form.password)
      if (response.success) {
        navigate('/dashboard', { replace: true })
      } else {
        setMessage({ type: 'error', text: response.message })
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-slate-950 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-ocean flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-slate-900 dark:text-white">Traveloop</span>
          </div>

          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Sign in to continue your journey</p>




          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs text-slate-400">or continue with email</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                name="email"
                type="email"
                className={`input ${errors.email ? 'border-red-400' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })) }}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label !mb-0" htmlFor="login-password">Password</label>
                <Link to="/forgot-password" className="text-xs text-ocean-600 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  className={`input pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })) }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-ocean-600 font-medium hover:underline">Create one free</Link>
          </p>
        </motion.div>
      </div>

      {/* Right — Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80"
          alt="Travel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-6"
          >
            <p className="text-white font-display text-xl font-semibold mb-2">"The world is a book."</p>
            <p className="text-slate-300 text-sm">Those who do not travel read only one page. — Saint Augustine</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
