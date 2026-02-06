export default function AdminDashboard() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Admin Dashboard</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginTop: '2rem'
      }}>
        <div style={{ padding: '1.5rem', backgroundColor: '#f3f4f6', borderRadius: '0.75rem' }}>
          <p style={{ color: '#6b7280' }}>Total Participants</p>
          <h3 style={{ fontSize: '2rem' }}>0</h3>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: '#f3f4f6', borderRadius: '0.75rem' }}>
          <p style={{ color: '#6b7280' }}>Total Conversations</p>
          <h3 style={{ fontSize: '2rem' }}>0</h3>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: '#f3f4f6', borderRadius: '0.75rem' }}>
          <p style={{ color: '#6b7280' }}>Top Score</p>
          <h3 style={{ fontSize: '2rem' }}>0</h3>
        </div>
      </div>
    </div>
  )
}
