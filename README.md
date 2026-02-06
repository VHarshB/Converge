# Converge Project Structure

```
converge/
├── frontend/                      # React SPA - Mobile-first UI
│   ├── src/
│   │   ├── pages/                # Route pages
│   │   │   ├── EventLanding.tsx
│   │   │   ├── CheckinPage.tsx
│   │   │   ├── MyPassPage.tsx
│   │   │   ├── LogConversationPage.tsx
│   │   │   ├── LeaderboardPage.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   └── AdminDashboard.tsx
│   │   ├── components/           # Reusable UI components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── services/             # API clients & Supabase
│   │   ├── styles/               # Global CSS
│   │   ├── App.tsx               # Router setup
│   │   ├── main.tsx              # Entry point
│   │   └── index.html
│   ├── vite.config.ts            # Vite build config
│   ├── tsconfig.json             # TypeScript config
│   ├── package.json
│   └── .env.example
│
├── backend/                       # Express API Server
│   ├── src/
│   │   ├── routes/               # API endpoints
│   │   │   └── checkin.ts
│   │   ├── services/             # Business logic
│   │   │   ├── scoring.ts        # Leaderboard scoring
│   │   │   ├── antiCheat.ts      # Spam detection
│   │   │   └── /* TODO: auth, validation, export */
│   │   ├── middleware/           # Express middleware
│   │   ├── db/                   # Database
│   │   │   └── schema.sql        # PostgreSQL schema
│   │   ├── types/                # TypeScript types
│   │   └── index.ts              # Server entry point
│   ├── tsconfig.json
│   ├── package.json
│   ├── .env.example
│   └── /* TODO: migrations folder */
│
├── shared/                        # Shared code
│   └── types.ts                  # TypeScript interfaces
│
└── docs/                         # Documentation
    └── /* Specification files */
```

## Setup Instructions

### 1. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` in both frontend and backend:

**Backend (.env):**
- Set Supabase URL and Key (get from Supabase dashboard)
- Configure admin password hash
- Set CORS_ORIGIN to frontend URL

**Frontend (.env.local):**
- Set API URL to backend server
- Set Supabase credentials (same as backend)

### 3. Database Setup

1. Create PostgreSQL database on Supabase
2. Run `backend/src/db/schema.sql` to create tables
3. Enable Row-Level Security (RLS) if needed

### 4. Start Development Servers

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

Frontend opens at `http://localhost:3000`  
Backend API at `http://localhost:5000`

## Technology Stack

| Layer | Tech | Version |
|-------|------|---------|
| Frontend | React | 18.2 |
| Frontend | TypeScript | 5.3 |
| Frontend | Vite | 5.0 |
| Frontend | Router | react-router-dom 6.20 |
| Backend | Node.js | 18+ |
| Backend | Express | 4.18 |
| Backend | TypeScript | 5.3 |
| Database | PostgreSQL | Via Supabase |
| Auth | Supabase Auth | 2.38 |
| Deployment | Vercel (FE) | - |
| Deployment | Railway/Render (BE) | - |

## Key Features Roadmap

### MVP ✅
- [x] Project structure scaffolded
- [ ] Checkin system (attendee registration)
- [ ] Conversation logging form
- [ ] Real-time leaderboard calculation
- [ ] Admin dashboard (basic)
- [ ] Anti-cheat validation
- [ ] CSV export

### Phase 2
- [ ] QR code generation & scanning
- [ ] Email/OTP authentication
- [ ] Admin moderation UI
- [ ] Conversation confirmation (mutual approval)
- [ ] Round-based tracking (Round 1, 2, 3)

### Phase 3
- [ ] Sponsor branding templates
- [ ] Advanced analytics dashboard
- [ ] Integration with external platforms
- [ ] Mobile app (React Native)

## Database Schema Summary

**5 Core Tables:**
1. `events` - Event configuration
2. `attendees` - Participant records
3. `conversation_logs` - Interaction tracking
4. `admin_users` - Admin authentication
5. `audit_actions` - Moderation audit trail

Plus supporting tables:
- `leaderboard_snapshots` - Locked standings history

See `backend/src/db/schema.sql` for full DDL.

## API Endpoints (To Implement)

**Public:**
- `POST /api/checkin` - Register attendee
- `POST /api/log` - Submit conversation log
- `GET /api/leaderboard` - Get current standings

**Admin:**
- `POST /admin/login` - Admin authentication
- `GET /admin/events/:eventId/participants`
- `GET /admin/events/:eventId/logs`
- `DELETE /admin/events/:eventId/logs/:logId` - Soft delete
- `POST /admin/events/:eventId/lock-leaderboard`
- `GET /admin/events/:eventId/export`

## Scoring Formula

```
score = (unique_partners × 2) + (detail_bonus × 1)

unique_partners = COUNT(DISTINCT partner_ref_codes)
detail_bonus = COUNT(logs WHERE note_length >= 20 OR topics.count >= 2)
```

Tie-breaker: unique_partners → detail_bonus → earliest_log_time
