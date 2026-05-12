import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Briefcase, PlusCircle, Compass, User } from 'lucide-react'

const mobileNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/trips', icon: Briefcase, label: 'Trips' },
  { to: '/create-trip', icon: PlusCircle, label: 'New', highlight: true },
  { to: '/explore', icon: Compass, label: 'Explore' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-2 py-2 safe-area-pb">
      <div className="flex items-center justify-around">
        {mobileNav.map(({ to, icon: Icon, label, highlight }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all
              ${highlight
                ? 'bg-ocean-600 text-white -mt-4 shadow-lg shadow-ocean-600/30 px-4 py-3'
                : isActive
                  ? 'text-ocean-600 dark:text-ocean-400'
                  : 'text-slate-400 dark:text-slate-500'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
