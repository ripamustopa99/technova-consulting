export default function DashboardLoading() {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Page title skeleton */}
      <div>
        <div style={{ height: 28, width: 220, borderRadius: 8, background: '#E2E8F0', marginBottom: 8 }} />
        <div style={{ height: 16, width: 340, borderRadius: 6, background: '#F1F5F9' }} />
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ height: 110, borderRadius: 12, background: '#fff', border: '1px solid #E2E8F0' }}>
            <div style={{ padding: 20 }}>
              <div style={{ height: 14, width: '50%', borderRadius: 6, background: '#F1F5F9', marginBottom: 12 }} />
              <div style={{ height: 28, width: '35%', borderRadius: 6, background: '#E2E8F0' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Content cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} style={{ height: 260, borderRadius: 12, background: '#fff', border: '1px solid #E2E8F0' }}>
            <div style={{ padding: 20 }}>
              <div style={{ height: 18, width: '40%', borderRadius: 6, background: '#F1F5F9', marginBottom: 16 }} />
              <div style={{ height: 180, borderRadius: 8, background: '#F8FAFC' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div style={{ borderRadius: 12, background: '#fff', border: '1px solid #E2E8F0', padding: 20 }}>
        <div style={{ height: 18, width: 160, borderRadius: 6, background: '#F1F5F9', marginBottom: 16 }} />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ height: 48, borderRadius: 8, background: i % 2 === 0 ? '#F8FAFC' : 'transparent', marginBottom: 4, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 16 }}>
            <div style={{ height: 14, width: '20%', borderRadius: 4, background: '#F1F5F9' }} />
            <div style={{ height: 14, width: '35%', borderRadius: 4, background: '#F1F5F9' }} />
            <div style={{ height: 14, width: '15%', borderRadius: 4, background: '#F1F5F9' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
