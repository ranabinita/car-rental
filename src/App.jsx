import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import Home from './pages/Home';
import HireDriverPage from './pages/HireDriverPage';
import CorporateRentPage from './pages/CorporateRentPage';
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SignInPage from './pages/SignInPage';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      {/* Navigation Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 32px',
        borderBottom: '1px solid #e5e5e5',
        backgroundColor: '#ffffff',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Link to="/" style={{ fontSize: '20px', fontWeight: 'bold', textDecoration: 'none', color: '#111' }}>
          Car Rental
        </Link>
        
        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#444', fontWeight: 500 }}>Home</Link>
          <Link to="/hire-driver" style={{ textDecoration: 'none', color: '#444', fontWeight: 500 }}>Hire Driver</Link>
          <Link to="/corporate-rent" style={{ textDecoration: 'none', color: '#444', fontWeight: 500 }}>Corporate</Link>
          <Link to="/blog" style={{ textDecoration: 'none', color: '#444', fontWeight: 500 }}>Blog</Link>
          <Link to="/about" style={{ textDecoration: 'none', color: '#444', fontWeight: 500 }}>About</Link>
          <Link to="/contact" style={{ textDecoration: 'none', color: '#444', fontWeight: 500 }}>Contact</Link>
          <Link to="/signin" style={{
            textDecoration: 'none',
            padding: '8px 18px',
            backgroundColor: '#111',
            color: '#fff',
            borderRadius: '6px',
            fontWeight: 500
          }}>
            Sign In
          </Link>
        </nav>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hire-driver" element={<HireDriverPage />} />
          <Route path="/corporate-rent" element={<CorporateRentPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/signin" element={<SignInPage />} />
        </Routes>
      </main>

      {/* Basic Footer */}
      <footer style={{
        padding: '24px 32px',
        borderTop: '1px solid #e5e5e5',
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
        color: '#666',
        fontSize: '14px'
      }}>
        © {new Date().getFullYear()} Car Rental Nepal. All rights reserved.
      </footer>
    </div>
  );
}