import { Routes, Route } from 'react-router-dom'
import EventLanding from './pages/EventLanding'
import CheckinPage from './pages/CheckinPage'
import MyPassPage from './pages/MyPassPage'
import LogConversationPage from './pages/LogConversationPage'
import LeaderboardPage from './pages/LeaderboardPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <Routes>
      {/* Root route - default to sample-event */}
      <Route path="/" element={<EventLanding />} />
      
      {/* Public Routes */}
      <Route path="/e/:eventSlug" element={<EventLanding />} />
      <Route path="/e/:eventSlug/checkin" element={<CheckinPage />} />
      <Route path="/e/:eventSlug/me" element={<MyPassPage />} />
      <Route path="/e/:eventSlug/log" element={<LogConversationPage />} />
      <Route path="/e/:eventSlug/leaderboard" element={<LeaderboardPage />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/events/:eventId/*" element={<AdminDashboard />} />
    </Routes>
  )
}

export default App
