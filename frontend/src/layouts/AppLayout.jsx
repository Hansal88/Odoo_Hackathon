import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import MobileNav from '../components/layout/MobileNav'
import AITravelChatbot from '../components/AITravelChatbot'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar — hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-[240px] min-h-screen transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 pb-24 md:pb-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <div className="md:hidden">
        <MobileNav />
      </div>

      {/* AI Chatbot */}
      <AITravelChatbot />
    </div>
  )
}
