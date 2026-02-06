# Environment Variables Guide

## Backend Setup

Create `backend/.env` with these variables:

```env
# Server
PORT=5000
NODE_ENV=development

# Supabase Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-public-key
SUPABASE_SERVICE_KEY=your-service-role-key

# Admin Auth (generate with: bcrypt -c 12 'your-password')
ADMIN_PASSWORD_HASH=bcrypt-hash-here

# CORS
CORS_ORIGIN=http://localhost:3000

# Feature Flags
ENABLE_ANTI_CHEAT=true
ENABLE_AUDIT_LOGGING=true
ENABLE_RATE_LIMITING=true
```

### How to get Supabase credentials:

1. Go to [supabase.com](https://supabase.com) → Sign up
2. Create new project
3. Go to **Settings** → **API**
4. Copy:
   - `Project URL` → SUPABASE_URL
   - `anon public key` → SUPABASE_KEY
   - `service_role key` → SUPABASE_SERVICE_KEY
5. Go to **SQL Editor** → Run `backend/src/db/schema.sql`

---

## Frontend Setup

Create `frontend/.env.local` with these variables:

```env
# API
VITE_API_URL=http://localhost:5000

# Supabase (same as backend)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-public-key

# Optional: Analytics, tracking, etc.
VITE_ENABLE_ANALYTICS=false
```

---

## Production Environment

### Vercel (Frontend)

1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables in **Settings** → **Environment Variables**
4. Deploy

**Production .env:**
```env
VITE_API_URL=https://converge-api.youromain.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-public-key
```

### Railway/Render (Backend)

1. Push code to GitHub
2. Create new service
3. Select GitHub repository
4. Add environment variables (same as development)
5. Deploy

---

## Security Best Practices

⚠️ **NEVER commit `.env` files to Git**

- Keep `.env` in `.gitignore` ✓
- Use `.env.example` as template only
- Rotate Supabase keys regularly
- Use strong admin passwords
- Enable 2FA on Supabase account
- Review Supabase RLS policies monthly
