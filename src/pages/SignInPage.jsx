import React from 'react';

export default function SignInPage() {
  return (
    <div className="wrap" style={{ padding: '80px 32px', minHeight: '60vh', maxWidth: '480px', margin: '0 auto' }}>
      <h1>Sign In</h1>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
        <input 
          type="email" 
          placeholder="Email address" 
          style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '15px' }} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '15px' }} 
        />
        <button type="submit" className="btn-primary" style={{ border: 'none', justifyContent: 'center' }}>
          Sign In
        </button>
      </form>
    </div>
  );
}