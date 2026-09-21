'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function ExplorePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
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

  const filteredPosts = posts.filter((post) =>
    post.caption?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', paddingBottom: '80px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif', color: '#fff' }}>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search captions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 15px',
            background: '#111',
            border: '1px solid #333',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '16px',
            outline: 'none',
          }}
        />
      </div>

      {loading ? (
        <p style={{ color: '#888', textAlign: 'center' }}>Loading explore...</p>
      ) : filteredPosts.length === 0 ? (
        <p style={{ color: '#888', textAlign: 'center' }}>No posts found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
          {filteredPosts.map((post) => (
            <div key={post.id} style={{ aspectRatio: '1/1', background: '#222', overflow: 'hidden' }}>
              <img src={post.image_url} alt="Explore Post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
