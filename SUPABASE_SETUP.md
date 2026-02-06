# Supabase Setup Guide - Complete

## Quick Start: Get Your Credentials in 5 Minutes

### Step 1: Create Supabase Account
1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with GitHub or email
4. Create new project (choose free tier)
5. Select PostgreSQL region closest to you
6. Wait 2-3 minutes for database to initialize

---

### Step 2: Find Your Credentials

#### **Option A: Via Dashboard**

1. In Supabase, go to **Settings** (bottom left gear icon)
2. Click **API** tab
3. You'll see three keys:

| Variable | Where to find | What it's for |
|----------|---------------|--------------|
| **SUPABASE_URL** | `Project URL` field (top) | API endpoint for your database |
| **SUPABASE_KEY** | `anon public` key | Frontend API calls (public, safe) |
| **SUPABASE_SERVICE_KEY** | `service_role` key | Backend admin operations (SECRET!) |

**Copy these exactly:**
```env
# From Supabase API settings
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_KEY=eyJhbGc... (long string)
SUPABASE_SERVICE_KEY=eyJhbGc... (different long string)
```

⚠️ **NEVER put SUPABASE_SERVICE_KEY in frontend!** (Only in backend)

#### **Option B: Via URL**
- Your **SUPABASE_URL** is already in the browser address bar
- Example: `https://abcdefgh.supabase.co` → That's your URL

---

### Step 3: Create Database Tables

1. In Supabase, go to **SQL Editor** (left sidebar)
2. Click **"New Query"** button
3. Paste this entire SQL schema (from `backend/src/db/schema.sql`):

```sql
-- Copy/paste from backend/src/db/schema.sql here
-- This creates all 7 tables automatically
```

4. Click **"Run"** button
5. Wait for success message (should see 7 tables created)

---

## Database Schema Reference

You need **7 tables** with these columns:

### 1. **events** (Event Configuration)
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | "Tech Networking 2026" |
| `slug` | TEXT | "tech-2026" (for URL) |
| `location` | TEXT | "Arizona State University" |
| `start_time` | TIMESTAMP | "2026-02-05 09:00:00" |
| `end_time` | TIMESTAMP | "2026-02-05 17:00:00" |
| `status` | TEXT | "draft", "live", or "ended" |
| `settings` | JSONB | Scoring rules in JSON |
| `created_at` | TIMESTAMP | Auto-filled |
| `updated_at` | TIMESTAMP | Auto-filled |

**Example:** One row per event

---

### 2. **attendees** (Participant Records)
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `event_id` | UUID | Links to events.id |
| `ref_code` | TEXT | "CVG-7K2P" (auto-generated) |
| `name` | TEXT | "John Smith" |
| `email` | TEXT | "john@example.com" |
| `role` | TEXT | "student", "speaker", etc. |
| `checked_in_at` | TIMESTAMP | "2026-02-05 09:15:00" |
| `is_active` | BOOLEAN | true/false |
| `created_at` | TIMESTAMP | Auto-filled |

**Example:** One row per person who checks in

---

### 3. **conversation_logs** (Who Talked to Whom)
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `event_id` | UUID | Links to events.id |
| `from_attendee_id` | UUID | Person submitting log |
| `to_ref_code` | TEXT | Partner's reference code |
| `to_attendee_id` | UUID | Resolved partner ID |
| `topics` | TEXT[] | ["MVP", "Funding"] |
| `note` | TEXT | "Discussed market fit" |
| `round_label` | TEXT | "Round 1" (optional) |
| `created_at` | TIMESTAMP | Auto-filled |
| `is_deleted` | BOOLEAN | false (soft delete) |
| `deleted_reason` | TEXT | "Spam" or null |

**Example:** One row per conversation log (can be 1000s)

---

### 4. **admin_users** (Admin Accounts)
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `email` | TEXT | "admin@example.com" |
| `password_hash` | TEXT | bcrypt hashed password |
| `created_at` | TIMESTAMP | Auto-filled |

**Example:** One row per admin

---

### 5. **audit_actions** (Moderation Log)
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `admin_user_id` | UUID | Which admin did action |
| `event_id` | UUID | Links to events.id |
| `action` | TEXT | "DELETE_LOG" or "LOCK_EVENT" |
| `payload` | JSONB | Extra data as JSON |
| `created_at` | TIMESTAMP | Auto-filled |

**Example:** One row per admin action

---

### 6. **leaderboard_snapshots** (Locked Results)
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `event_id` | UUID | Links to events.id |
| `snapshot_data` | JSONB | Full leaderboard JSON |
| `is_locked` | BOOLEAN | true/false |
| `locked_at` | TIMESTAMP | When locked |
| `created_at` | TIMESTAMP | Auto-filled |

**Example:** One row when admin locks leaderboard

---

## Environment Variables Setup

### Backend (.env)
```env
# ===== DATABASE =====
SUPABASE_URL=https://abcdefgh.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ===== SERVER =====
PORT=5000
NODE_ENV=development

# ===== ADMIN AUTH =====
ADMIN_PASSWORD_HASH=$2b$12$... (bcrypt hash)

# ===== CORS =====
CORS_ORIGIN=http://localhost:3000

# ===== FEATURES =====
ENABLE_ANTI_CHEAT=true
ENABLE_AUDIT_LOGGING=true
```

### Frontend (.env.local)
```env
# ===== API =====
VITE_API_URL=http://localhost:5000

# ===== SUPABASE (public keys only) =====
VITE_SUPABASE_URL=https://abcdefgh.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step-by-Step: Create Test Data

After creating tables, add sample event:

### Via Supabase Dashboard:

1. Go **Table Editor** (left sidebar)
2. Click **events** table
3. Click **Insert** → **Insert Row**
4. Fill in:
   - `name` = "Tech Mixer 2026"
   - `slug` = "tech-mixer"
   - `location` = "ASU Phoenix"
   - `start_time` = "2026-02-05 09:00:00"
   - `end_time` = "2026-02-05 17:00:00"
   - `status` = "live"
   - `settings` = `{}`

5. Save → Copy the event `id` UUID
6. Use that UUID when adding attendees

---

## Verify Your Setup

### Test 1: Tables Exist
```bash
# In Supabase SQL Editor, run:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

# Should show: events, attendees, conversation_logs, admin_users, audit_actions, leaderboard_snapshots
```

### Test 2: Can Insert Data
```sql
-- Insert test attendee
INSERT INTO attendees (event_id, ref_code, name, email, checked_in_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000'::uuid,  -- Your event UUID
  'CVG-TEST',
  'Test User',
  'test@example.com',
  NOW()
);

-- Query it back
SELECT * FROM attendees LIMIT 1;
```

---

## Common Issues & Fixes

### ❌ "Invalid API key"
**Cause:** Wrong key or mismatched environment  
**Fix:** Copy `anon public` key from Supabase Settings → API (not service role)

### ❌ "Row level security (RLS) is enabled"
**Cause:** Supabase has RLS enabled by default  
**Fix:** Disable RLS on tables initially (or configure policies):
```sql
-- In Supabase SQL Editor:
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendees DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_actions DISABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_snapshots DISABLE ROW LEVEL SECURITY;
```

### ❌ "Connection timeout"
**Cause:** Supabase project still initializing  
**Fix:** Wait 3-5 minutes for database to be ready

---

## Where Each Variable Comes From

```
🌐 Supabase Dashboard (supabase.com/dashboard)
│
├─ Settings → API
│  ├─ "Project URL" → SUPABASE_URL
│  ├─ "anon public" → SUPABASE_KEY (frontend)
│  └─ "service_role" → SUPABASE_SERVICE_KEY (backend only)
│
├─ SQL Editor
│  └─ Paste & run schema.sql → Creates all tables
│
└─ Table Editor
   └─ Add test event & attendees
```

---

## Summary: What You Actually Get

After completing Supabase setup:

✅ **7 PostgreSQL tables** ready for data  
✅ **3 API credentials** for authentication  
✅ **Real-time database** (Supabase handles updates)  
✅ **Free tier** includes 500 MB storage + unlimited API calls  
✅ **Built-in auth** (optional, but available)  

Your backend can now query the database using the Node.js `pg` client that's already installed!

---

## Next: Use in Your Code

Once you have the `.env` file set up, the backend `index.ts` file will:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY  // Backend uses service key
)

// Now you can query:
const { data, error } = await supabase
  .from('events')
  .select('*')
  .eq('status', 'live')
```

Frontend uses:
```typescript
const { data } = await supabase
  .from('attendees')
  .select('*')
  .eq('event_id', eventId)
```

Done! 🎉
