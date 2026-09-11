import React, { useState } from 'react';
import { ArrowRight, Search, Calendar, Clock } from 'lucide-react';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'DRIVING TIPS', 'TRAVEL GUIDE', 'COMPANY NEWS', 'ROUTES'];

  const blogPosts = [
    {
      id: 1,
      category: 'DRIVING TIPS',
      date: 'Sept 10, 2026',
      readTime: '4 min read',
      title: 'What to check before a Kathmandu-Pokhara self-drive',
      excerpt: 'Brake condition, tyre pressure at altitude, and the key highway checkpoints where you will need your official permits ready.'
    },
    {
      id: 2,
      category: 'TRAVEL GUIDE',
      date: 'Aug 28, 2026',
      readTime: '6 min read',
      title: 'A first-timer\'s route through the Terai lowlands',
      excerpt: 'Where the jungle safari roads differ from mountain valley driving, and how long to budget for each stretch across Chitwan.'
    },
    {
      id: 3,
      category: 'COMPANY NEWS',
      date: 'Aug 15, 2026',
      readTime: '3 min read',
      title: 'Spark Car adds 40 new verified drivers ahead of festival season',
      excerpt: 'Why Dashain and Tihar travel bookings fill up six weeks out, and how to reserve a dedicated long-distance driver early.'
    },
    {
      id: 4,
      category: 'ROUTES',
      date: 'July 30, 2026',
      readTime: '8 min read',
      title: 'Overland to Mustang: Navigating the Beni-Jomsom highway',
      excerpt: 'Essential 4x4 clearance advice, monsoon road conditions, and recommended rest stops along the Kali Gandaki gorge.'
    }
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="wrap" style={{ padding: '60px 32px', minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <span className="kicker">From the Road</span>
        <h1 style={{ fontSize: '38px', marginBottom: '12px' }}>Spark Car Blog & Insights</h1>
        <p style={{ color: '#5b5b52', maxWidth: '60ch', fontSize: '16px' }}>
          Driving guides, road trip itineraries, and travel news across Nepal's highway networks.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '40px',
        paddingBottom: '24px',
        borderBottom: '1px solid var(--line)'
      }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                border: '1px solid var(--line)',
                background: selectedCategory === cat ? 'var(--ink)' : '#ffffff',
                color: selectedCategory === cat ? '#ffffff' : 'var(--ink)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: '8px',
              border: '1px solid var(--line)',
              fontSize: '14px'
            }}
          />
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
        </div>
      </div>

      {/* Posts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '180px 1fr auto',
                gap: '24px',
                alignItems: 'center',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid var(--line)',
                background: '#ffffff'
              }}
            >
              <div style={{
                borderRadius: '8px',
                background: 'var(--ink-soft, #233258)',
                height: '110px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '12px',
                fontWeight: 600
              }}>
                SPARK ROAD
              </div>

              <div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '12px', color: 'var(--brick)', fontWeight: 600, marginBottom: '8px' }}>
                  <span>{post.category}</span>
                  <span style={{ color: '#888', fontWeight: 400, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} /> {post.date}
                  </span>
                  <span style={{ color: '#888', fontWeight: 400, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} /> {post.readTime}
                  </span>
                </div>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>{post.title}</h3>
                <p style={{ fontSize: '14px', color: '#5b5b52', lineHeight: '1.5' }}>{post.excerpt}</p>
              </div>

              <a
                href={`#read-${post.id}`}
                className="link-arrow"
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  background: 'var(--paper)',
                  border: '1px solid var(--line)'
                }}
              >
                Read Article <ArrowRight size={14} />
              </a>
            </article>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
            No articles found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}