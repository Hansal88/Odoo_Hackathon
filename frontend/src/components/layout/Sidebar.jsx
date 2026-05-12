import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Map, PlusCircle, Briefcase, Wallet,
  ListChecks, User, Settings, LogOut, Compass, Sun, Moon,
  ChevronLeft, Menu, Globe
} from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { useAuth } from '../../hooks/useAuthHook'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/trips', icon: Briefcase, label: 'My Trips' },
  { to: '/create-trip', icon: PlusCircle, label: 'Create Trip' },
  { to: '/explore', icon: Compass, label: 'Explore' },
  { to: '/budget', icon: Wallet, label: 'Budget' },
  { to: '/packing', icon: ListChecks, label: 'Packing' },
]

const bottomItems = [
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const displayName = user?.name || 'Traveler'
  const displayEmail = user?.email || 'Signed in'
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col z-40 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-100 dark:border-slate-800">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-ocean flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-slate-900 dark:text-white">Traveloop</span>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-ocean flex items-center justify-center mx-auto">
            <Globe className="w-4 h-4 text-white" />
          </div>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center justify-center p-3 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
              ${isActive
                ? 'bg-ocean-50 dark:bg-ocean-900/30 text-ocean-600 dark:text-ocean-400'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-ocean-600 dark:text-ocean-400' : ''}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && !collapsed && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-ocean-500"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200"
        >
          {dark ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
          {!collapsed && (
            <span className="text-sm font-medium">{dark ? 'Light Mode' : 'Dark Mode'}</span>
          )}
        </button>

        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200"
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
          </NavLink>
        ))}

        {/* User */}
        <div className="flex items-center gap-3 px-3 py-2.5 mt-2 rounded-xl bg-slate-50 dark:bg-slate-800">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-ocean-500 to-coral-500 text-white text-[10px] font-semibold flex items-center justify-center flex-shrink-0">
            {initials || 'TL'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-900 dark:text-white truncate">{displayName}</p>
              <p className="text-xs text-slate-400 truncate">{displayEmail}</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={handleLogout} className="p-1 hover:text-red-500 text-slate-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  )
}
