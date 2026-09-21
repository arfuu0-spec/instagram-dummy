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
    <main className="min-h-screen bg-black text-white flex flex-col items-center">
      {/* Top Header */}
      <header className="w-full max-w-md border-b border-zinc-800 p-4 flex justify-between items-center sticky top-0 bg-black z-10">
        <h1 className="text-xl font-bold tracking-wider">Apps-Dummy</h1>
        <span>❤️</span>
      </header>

      {/* Feed Section */}
      <div className="w-full max-w-md flex flex-col gap-6 py-4 px-2 mb-16">
        {posts.length === 0 ? (
          <p className="text-center text-zinc-500 mt-10">No posts found. Add some posts in Supabase!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="border border-zinc-800 rounded-lg p-4 bg-zinc-900">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-zinc-700"></div>
                <span className="text-sm font-semibold">gamer_user</span>
              </div>
              <div className="w-full bg-black rounded flex items-center justify-center overflow-hidden">
                {post.image_url ? (
                  <img src={post.image_url} alt="Post media" className="w-full h-auto object-contain" />
                ) : (
                  <span className="text-zinc-500">No Image</span>
                )}
              </div>
              <div className="mt-3 flex gap-4">
                <span>❤️</span>
                <span>💬</span>
                <span>↗️</span>
              </div>
              <p className="mt-2 text-sm text-zinc-300">
                <strong className="text-white mr-2">gamer_user</strong>
                {post.caption}
              </p>
            </div>
          ))
        )}
      </div>
    </main>
  )
}
