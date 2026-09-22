'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
    } else {
      setPosts(data || [])
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Top Header */}
      <header style={{ width: '100%', maxWidth: '400px', borderBottom: '1px solid #222', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#000', zIndex: 10 }}>
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Apps-Dummy</h1>
        <span>❤️</span>
      </header>

      {/* Feed Section */}
      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px', padding: '12px 0', paddingBottom: '70px' }}>
        {posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>No posts found.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} style={{ border: '1px solid #222', borderRadius: '8px', background: '#111', overflow: 'hidden' }}>
              {/* User Info Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#333' }}></div>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>gamer_user</span>
              </div>

              {/* Fixed 4:5 Aspect Ratio Image Container */}
              <div style={{ width: '100%', aspectRatio: '4/5', background: '#000', position: 'relative', overflow: 'hidden' }}>
                {post.image_url ? (
                  <img 
                    src={post.image_url} 
                    alt="Post media" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} 
                  />
                ) : (
                  <span style={{ color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>No Image</span>
                )}
              </div>

              {/* Actions & Caption */}
              <div style={{ padding: '10px 12px' }}>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '8px', fontSize: '18px' }}>
                  <span>❤️</span>
                  <span>💬</span>
                  <span>↗️</span>
                </div>
                <p style={{ fontSize: '14px', color: '#ccc', margin: 0 }}>
                  <strong style={{ color: '#fff', marginRight: '8px' }}>gamer_user</strong>
                  {post.caption}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  )
}
