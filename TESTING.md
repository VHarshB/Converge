# Quick Test Instructions

## Your App is Running! 🎉

**Frontend:** http://localhost:3001  
**Backend:** http://localhost:5000  
**Supabase:** https://lovcwhcqheakjeijypaq.supabase.co

---

## Before Testing: Create a Test Event

You need to create an event in Supabase first. Go to:

1. **Supabase Dashboard** → SQL Editor
2. Run this SQL:

```sql
INSERT INTO events (id, name, slug, location, start_time, end_time, status, settings)
VALUES (
  gen_random_uuid(),
  'Tech Networking 2026',
  'sample-event',
  'ASU Phoenix',
  NOW(),
  NOW() + INTERVAL '8 hours',
  'live',
  '{"scoringRules": {"uniquePartnerWeight": 2, "detailBonusWeight": 1}}'::jsonb
);
```

3. Click **Run**

---

## Test the App

### Test Flow:

1. **Open Frontend** → http://localhost:3001
2. **Click "Check In"**
   - Name: John Smith
   - Email: john@test.com
   - Role: Student
   - Click "Check In" → Get reference code (e.g., CVG-7K2P)

3. **Check "My Pass"**
   - See your reference code

4. **Log a Conversation** 
   - Partner Code: CVG-TEST (or create another attendee first)
   - Topics: Select at least 2
   - Note: "Great conversation about MVP strategy"
   - Submit

5. **View Leaderboard**
   - See your score calculated

---

## Create Multiple Test Attendees

Use the frontend to check in multiple people:

1. Check in "Jane Smith" → Gets ref code CVG-XXXX
2. Check in "Mike Johnson" → Gets ref code CVG-YYYY
3. Jane logs conversation with Mike
4. See scores update on leaderboard

---

## API Testing (via curl)

### Test Checkin
```bash
curl -X POST http://localhost:5000/api/checkin \
  -H "Content-Type: application/json" \
  -d '{
    "eventSlug": "sample-event",
    "name": "Alice",
    "email": "alice@test.com",
    "role": "student"
  }'
```

### Test Log Conversation
```bash
curl -X POST http://localhost:5000/api/log \
  -H "Content-Type: application/json" \
  -d '{
    "eventSlug": "sample-event",
    "fromRefCode": "CVG-7K2P",
    "toRefCode": "CVG-TEST",
    "topics": ["MVP", "Funding"],
    "note": "Discussed growth strategy"
  }'
```

### Test Leaderboard
```bash
curl http://localhost:5000/api/leaderboard?eventSlug=sample-event
```

---

## What's Implemented So Far ✅

### Backend
- ✅ POST /api/checkin → Generate ref codes, create attendees
- ✅ POST /api/log → Log conversations with spam detection
- ✅ GET /api/leaderboard → Real-time scoring with tie-breaker logic
- ✅ Supabase integration (all queries working)
- ✅ Scoring engine (2pts per unique partner + detail bonus)
- ✅ Anti-cheat detection

### Frontend
- ✅ Check-in form with validation
- ✅ My Pass page with ref code display
- ✅ Log conversation form with topic selection
- ✅ Real-time leaderboard with polling
- ✅ Session management (localStorage)
- ✅ Error handling & loading states
- ✅ Mobile-responsive layout

---

## Still TODO

- [ ] Admin dashboard (login, moderation, exports)
- [ ] QR code generation & scanning
- [ ] Email verification
- [ ] Multi-round support
- [ ] WebSocket real-time updates
- [ ] CSV export functionality
- [ ] Conversation confirmation (mutual approval)

---

## Troubleshooting

**Q: Getting 404 error?**  
A: Make sure both servers are running and you're on http://localhost:3001

**Q: Can't check in?**  
A: Create the test event in Supabase first (see SQL above)

**Q: Leaderboard shows no data?**  
A: Log some conversations first, then refresh

**Q: Backend not running?**  
A: Check that port 5000 is free, and .env file has correct Supabase credentials
