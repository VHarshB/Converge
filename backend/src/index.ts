import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import checkinRoutes from './routes/checkin'
import logRoutes from './routes/log'
import leaderboardRoutes from './routes/leaderboard'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || ''
export const supabase = createClient(supabaseUrl, supabaseKey)

// Middleware
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000'
app.use(cors({ origin: corsOrigin }))
app.use(express.json({ limit: '50mb' }))

// Log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/checkin', checkinRoutes)
app.use('/api/log', logRoutes)
app.use('/api/leaderboard', leaderboardRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path })
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500,
  })
})

app.listen(PORT, () => {
  console.log(`✅ Converge API running on http://localhost:${PORT}`)
  console.log(`📡 CORS enabled for: ${corsOrigin}`)
})
