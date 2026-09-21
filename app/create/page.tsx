'type client'; // Agar Next.js mein client component ke liye use karte ho
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Supabase client initialize (apne credentials ke hisaab se ya lib file se import kar sakte ho)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CreatePost() {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please select an image file first!');
      return;
    }

    try {
      setUploading(true);

      // 1. Unique file name create karo taaki clash na ho
      const fileName = `${Date.now()}-${file.name}`;

      // 2. Supabase Storage ('T' bucket) par file upload karo
      const { data: storageData, error: storageError } = await supabase.storage
        .from('T')
        .upload(fileName, file);

      if (storageError) throw storageError;

      // 3. Uploaded image ka public URL nikalo
      const { data: publicURLData } = supabase.storage
        .from('T')
        .getPublicUrl(fileName);

      const imageUrl = publicURLData.publicUrl;

      // 4. Supabase Database ('posts' table) mein row insert karo
      const { error: dbError } = await supabase.from('posts').insert([
        {
          caption: caption,
          image_url: imageUrl,
          // user_id agar required ho toh yahan add kar sakte ho
        },
      ]);

      if (dbError) throw dbError;

      alert('Post uploaded successfully!');
      router.push('/'); // Upload ke baad wapas home feed par bhej dega
    } catch (error: any) {
      console.error('Error uploading:', error.message);
      alert('Error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Create New Post</h2>
      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Select Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Caption:</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            rows={3}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          style={{
            padding: '10px',
            background: '#0095f6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          {uploading ? 'Uploading...' : 'Share Post'}
        </button>
      </form>
    </div>
  );
}
