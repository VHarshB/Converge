# Converge - Implementation Checklist

## Phase 1: Core MVP (Current Sprint)

### Frontend Tasks
- [ ] Replace mock pages with functional components
  - [ ] EventLanding with real event details
  - [ ] CheckinPage with form submission
  - [ ] LogConversationPage with validation
  - [ ] LeaderboardPage with real-time updates
  - [ ] MyPassPage with QR code display

- [ ] Implement API client service
  - [ ] Checkin API integration
  - [ ] Log submission API
  - [ ] Leaderboard fetch

- [ ] Add mobile responsiveness
  - [ ] Mobile navigation
  - [ ] Touch-friendly form inputs
  - [ ] Responsive layout testing

- [ ] Session management
  - [ ] Store refCode in localStorage
  - [ ] Session token handling
  - [ ] Auto-login recovery

### Backend Tasks
- [ ] Implement core API routes
  - [ ] POST /api/checkin (generate refCode, create attendee)
  - [ ] POST /api/log (store conversation, calculate score)
  - [ ] GET /api/leaderboard (fetch scored rankings)

- [ ] Database integration
  - [ ] Supabase client setup
  - [ ] Run schema migrations
  - [ ] Test database connections

- [ ] Business logic
  - [ ] Scoring calculation engine
  - [ ] Anti-cheat validation
  - [ ] Reference code generation (CVG-XXXX format)

- [ ] Admin endpoints
  - [ ] POST /admin/login
  - [ ] GET /admin/events/:eventId/participants
  - [ ] GET /admin/events/:eventId/logs
  - [ ] DELETE /admin/events/:eventId/logs/:logId

### Testing
- [ ] Unit tests for scoring logic
- [ ] Integration tests for API endpoints
- [ ] E2E tests for checkin → log → leaderboard flow

### Deployment
- [ ] Frontend: Deploy to Vercel
- [ ] Backend: Deploy to Railway/Render
- [ ] Configure environment variables
- [ ] Setup database backups

---

## Phase 2: Enhanced Features

- [ ] QR code generation & scanning
- [ ] Email verification for attendees
- [ ] Multi-round support (Round 1, 2, 3)
- [ ] Real-time WebSocket updates for leaderboard
- [ ] Admin moderation UI with bulk actions

---

## Phase 3: Advanced Features

- [ ] Sponsor branding & custom themes
- [ ] Analytics dashboard
- [ ] Machine learning spam detection
- [ ] Integration with event platforms (Eventbrite, etc.)
- [ ] Mobile app (React Native)

---

## Known TODOs in Code

### Backend
- [ ] `src/routes/log.ts` - Log submission endpoint
- [ ] `src/routes/leaderboard.ts` - Leaderboard fetch
- [ ] `src/routes/admin.ts` - Admin endpoints
- [ ] `src/services/auth.ts` - Admin authentication
- [ ] `src/services/validation.ts` - Input validation (Zod schemas)
- [ ] `src/services/export.ts` - CSV export logic
- [ ] `src/middleware/auth.ts` - Auth middleware
- [ ] `src/middleware/errorHandler.ts` - Error handling

### Frontend
- [ ] `src/services/api.ts` - API client (axios)
- [ ] `src/services/supabase.ts` - Supabase client setup
- [ ] `src/hooks/useEvent.ts` - Event data hook
- [ ] `src/hooks/useLeaderboard.ts` - Real-time leaderboard hook
- [ ] `src/hooks/useSession.ts` - Session/auth hook
- [ ] `src/components/QRScanner.tsx` - QR code scanning
- [ ] `src/components/FormInput.tsx` - Reusable form components
- [ ] `src/components/LoadingSpinner.tsx` - Loading states
- [ ] `src/pages/AdminParticipants.tsx` - Participant management
- [ ] `src/pages/AdminLogs.tsx` - Log moderation

---

## Installation & Setup

```bash
# Install root dependencies (if using monorepo)
npm install

# Install frontend
cd frontend && npm install && cd ..

# Install backend
cd backend && npm install && cd ..

# Setup environment files
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env

# Start development servers
npm run dev  # or run individually:
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm run dev
```

---

## Performance & Security Notes

### Security
- [ ] Implement HTTPS in production
- [ ] Add CORS properly (whitelist frontend domain)
- [ ] Hash admin passwords with bcrypt
- [ ] Implement rate limiting on API endpoints
- [ ] Validate all user inputs (Zod)
- [ ] Use parameterized queries (prevent SQL injection)
- [ ] Implement Row-Level Security (RLS) in Supabase

### Performance
- [ ] Cache leaderboard calculations (Redis optional)
- [ ] Implement database indexes on hot columns
- [ ] Use connection pooling for database
- [ ] Add CDN for static assets (Vercel handles this)
- [ ] Implement pagination for large datasets

---

## Database Migrations

When modifying schema:
1. Create migration file: `backend/migrations/001_initial_schema.sql`
2. Test locally with `psql -f migrations/001_initial_schema.sql`
3. Run on Supabase via SQL editor or migration tool
4. Keep version history for rollback capability
