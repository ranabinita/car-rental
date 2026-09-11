import React from 'react';
import { ArrowRight, Search, Shield, Car, UserCheck } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(180deg, var(--ink) 0%, var(--ink-soft) 100%)',
        color: '#fff',
        padding: '80px 32px 100px'
      }}>
        <div className="wrap" style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <span style={{ color: 'var(--marigold)', fontWeight: 600, fontSize: '14px' }}>Kathmandu, Nepal</span>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', margin: '16px 0', color: '#fff' }}>
            Drive Nepal's roads your way
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', maxWidth: '500px', lineHeight: 1.6 }}>
            Self-drive, chauffeur-driven, or corporate fleet rentals across Kathmandu and beyond.
          </p>
        </div>
      </section>

      {/* Quick Services Overview */}
      <section className="wrap" style={{ padding: '80px 32px', maxWidth: '1180px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '32px' }}>Our Services</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div style={{ padding: '28px', border: '1px solid var(--line)', borderRadius: '12px', background: '#fff' }}>
            <Car size={32} color="var(--brick)" style={{ marginBottom: '16px' }} />
            <h3>Car Rentals</h3>
            <p style={{ color: '#5b5b52', fontSize: '14px', marginTop: '8px' }}>Daily and weekly vehicle rentals for personal or family travel.</p>
          </div>
          <div style={{ padding: '28px', border: '1px solid var(--line)', borderRadius: '12px', background: '#fff' }}>
            <UserCheck size={32} color="var(--brick)" style={{ marginBottom: '16px' }} />
            <h3>Driver Hire</h3>
            <p style={{ color: '#5b5b52', fontSize: '14px', marginTop: '8px' }}>Verified local drivers available for valley commuting or long trips.</p>
          </div>
          <div style={{ padding: '28px', border: '1px solid var(--line)', borderRadius: '12px', background: '#fff' }}>
            <Shield size={32} color="var(--brick)" style={{ marginBottom: '16px' }} />
            <h3>Corporate Fleets</h3>
            <p style={{ color: '#5b5b52', fontSize: '14px', marginTop: '8px' }}>Long-term business leasing with maintenance and roadside assistance.</p>
          </div>
        </div>
      </section>
    </div>
  );
}