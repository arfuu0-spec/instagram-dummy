'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ProfilePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '80px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {/* Profile Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
          👤
        </div>
        <div>
          <h3 style={{ margin: '0 0 5px 0' }}>gamer_user</h3>
          <p style={{ margin: '0 0 10px 0', color: '#888', fontSize: '14px' }}>Building my Instagram Clone 🚀</p>
          <div style={{ display: 'flex', gap: '15px', fontSize: '14px' }}>
            <span><b>{posts.length}</b> posts</span>
          </div>
        </div>
      </div>

      <hr style={{ borderColor: '#222', marginBottom: '20px' }} />

      {/* User Posts Grid */}
      <h4 style={{ marginBottom: '10px' }}>My Posts</h4>
      {loading ? (
        <p style={{ color: '#888' }}>Loading profile...</p>
      ) : posts.length === 0 ? (
        <p style={{ color: '#888' }}>No posts yet. Create one from the ➕ tab!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
          {posts.map((post) => (
            <div key={post.id} style={{ aspectRatio: '1/1', background: '#222', overflow: 'hidden' }}>
              <img src={post.image_url} alt="Post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
