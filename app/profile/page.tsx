'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

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
      console.error('Error fetching profile posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setPosts(posts.filter((post) => post.id !== postId));
      alert('Post deleted successfully!');
    } catch (error: any) {
      alert('Error deleting post: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '80px', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif', color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>
          👤
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>gamer_user</h2>
          <p style={{ color: '#aaa', fontSize: '14px', marginTop: '4px' }}>Building my Instagram Clone 🚀</p>
          <p style={{ color: '#fff', fontSize: '14px', marginTop: '6px' }}><strong>{posts.length}</strong> posts</p>
        </div>
      </div>

      <hr style={{ border: '0', borderTop: '1px solid #333', marginBottom: '20px' }} />

      <h3 style={{ fontSize: '14px', color: '#888', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>My Posts</h3>

      {loading ? (
        <p style={{ color: '#888', textAlign: 'center' }}>Loading profile...</p>
      ) : posts.length === 0 ? (
        <p style={{ color: '#888', textAlign: 'center' }}>No posts uploaded yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
          {posts.map((post) => (
            <div key={post.id} style={{ aspectRatio: '1/1', background: '#222', position: 'relative', overflow: 'hidden' }}>
              <img src={post.image_url} alt="User Post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                onClick={() => handleDelete(post.id)}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#ff4d4d',
                  border: 'none',
                  borderRadius: '50%',
                  width: '26px',
                  height: '26px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Delete Post"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
