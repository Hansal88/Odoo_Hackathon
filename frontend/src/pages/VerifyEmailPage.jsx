import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Globe, Mail, ArrowRight, Sparkles, BadgeCheck, Clock } from 'lucide-react'
import { useAuth } from '../hooks/useAuthHook'

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { verifyEmail, resendVerificationEmail } = useAuth()
  
  const [status, setStatus] = useState('input') // input, loading, success, error
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState(location.state?.email || '')
  const [code, setCode] = useState('')
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [codeError, setCodeError] = useState('')
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutes in seconds

  // Timer countdown
  useEffect(() => {
    if (status !== 'input') return
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setStatus('error')
          setMessage('Verification code has expired. Please request a new one.')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [status])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setCodeError('Please enter your email address')
      return
    }
    
    if (!code) {
      setCodeError('Please enter the 6-digit code')
      return
    }
    
    if (code.length !== 6 || !/^\d+$/.test(code)) {
      setCodeError('Code must be 6 digits')
      return
    }

    setVerifyLoading(true)
    setCodeError('')
    
    try {
      const response = await verifyEmail(email, code)
      if (response.success) {
        setStatus('success')
        setMessage('Your account is verified. Redirecting to login...')
        setTimeout(() => navigate('/login', { replace: true }), 2200)
      } else {
        setCodeError(response.message || 'Invalid or expired code')
      }
    } catch (err) {
      setCodeError(err.message || 'Verification failed. Please try again.')
    } finally {
      setVerifyLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      setCodeError('Please enter your email address')
      return
    }

    setResendLoading(true)
    try {
      const response = await resendVerificationEmail(email)
      if (response.success) {
        setTimeLeft(900) // Reset timer to 15 minutes
        setStatus('input')
        setCode('')
        setCodeError('')
        setMessage('New verification code sent! Check your inbox.')
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err) {
      setCodeError(err.message || 'Failed to resend verification code')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-white">Traveloop</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          {status === 'input' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">
                Verify your email
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-center mb-6">
                We've sent a 6-digit code to your email address. Enter it below to verify your account.
              </p>

              {message && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm">
                  {message}
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label htmlFor="verify-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email address
                  </label>
                  <input
                    id="verify-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setCodeError('')
                    }}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                    disabled={verifyLoading}
                  />
                </div>

                {/* Code Input */}
                <div>
                  <label htmlFor="verify-code" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Verification code
                  </label>
                  <input
                    id="verify-code"
                    name="code"
                    type="text"
                    maxLength="6"
                    value={code}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      setCode(value)
                      setCodeError('')
                    }}
                    placeholder="000000"
                    className="w-full px-4 py-3 text-center text-2xl font-mono border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white tracking-widest"
                    disabled={verifyLoading}
                  />
                </div>

                {/* Error Message */}
                {codeError && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
                    {codeError}
                  </div>
                )}

                {/* Timer */}
                <div className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span>Code expires in: <strong>{formatTime(timeLeft)}</strong></span>
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={verifyLoading || code.length !== 6}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verifyLoading ? 'Verifying...' : 'Verify Account'}
                </button>
              </form>

              {/* Resend Section */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-4">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="w-full bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold py-3 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition disabled:opacity-50"
                >
                  {resendLoading ? 'Sending...' : 'Resend Code'}
                </button>
              </div>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none">
                <motion.div
                  className="absolute inset-x-8 top-8 h-32 rounded-full bg-green-400/10 blur-3xl"
                  animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0.6, rotate: -10 }}
                  animate={{ scale: [0.9, 1, 0.95], rotate: [0, 3, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700"
                >
                  <BadgeCheck className="h-11 w-11 text-green-500" />
                </motion.div>
                <div className="inline-flex items-center gap-2 rounded-full bg-green-50 dark:bg-green-900/20 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-300 mb-4">
                  <Sparkles className="h-3.5 w-3.5" />
                  Account verified
                </div>
              </div>
              <p className="relative z-10 text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Email verified!
              </p>
              <p className="relative z-10 text-slate-600 dark:text-slate-400 mb-2">
                {message}
              </p>
              <p className="relative z-10 text-sm text-slate-500 dark:text-slate-400 mb-6">
                You can now sign in and go straight to your dashboard.
              </p>
              <button
                onClick={() => navigate('/login', { replace: true })}
                className="relative z-10 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                Continue to Login
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <AlertCircle className="w-16 h-16 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Verification Failed
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {message}
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    setStatus('input')
                    setCode('')
                    setCodeError('')
                    setTimeLeft(900)
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition"
                >
                  Try again
                </button>
                <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="w-full bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold py-3 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition disabled:opacity-50"
                >
                  {resendLoading ? 'Sending...' : 'Request New Code'}
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Already verified?
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold py-3 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition flex items-center justify-center gap-2"
                >
                  Go to Login
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
