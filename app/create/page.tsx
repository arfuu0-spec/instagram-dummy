'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function CreatePost() {
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      alert('Please select an image file first!')
      return
    }

    try {
      setUploading(true)

      // 1. Unique file name create karo
      const fileName = `${Date.now()}-${file.name}`

      // 2. Supabase Storage ('T' bucket) par file upload karo
      const { data: storageData, error: storageError } = await supabase.storage
        .from('T')
        .upload(fileName, file)

      if (storageError) throw storageError

      // 3. Uploaded image ka public URL nikalo
      const { data: publicURLData } = supabase.storage
        .from('T')
        .getPublicUrl(fileName)

      const imageUrl = publicURLData.publicUrl

      // 4. Supabase Database ('posts' table) mein row insert karo
      const { error: dbError } = await supabase.from('posts').insert([
        {
          caption: caption,
          image_url: imageUrl,
        },
      ])

      if (dbError) throw dbError

      alert('Post uploaded successfully!')
      router.push('/')
    } catch (error: any) {
      console.error('Error uploading:', error.message)
      alert('Error: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', color: '#fff' }}>
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Create New Post</h2>
      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ background: '#111', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Select Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
            style={{ width: '100%', color: '#fff' }}
          />
        </div>

        <div>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            rows={3}
            style={{ width: '100%', padding: '12px', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '8px', outline: 'none' }}
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          style={{
            padding: '12px',
            background: '#0095f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          {uploading ? 'Uploading...' : 'Share Post'}
        </button>
      </form>
    </div>
  )
}
