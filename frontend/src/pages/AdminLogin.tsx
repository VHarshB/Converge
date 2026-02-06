export default function AdminLogin() {
  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Admin Login</h2>
      <form style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label>Email</label>
          <input type="email" placeholder="admin@example.com" required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" placeholder="••••••••" required />
        </div>
        <button type="submit" style={{ backgroundColor: '#6366f1', color: 'white' }}>
          Sign In
        </button>
      </form>
    </div>
  )
}
