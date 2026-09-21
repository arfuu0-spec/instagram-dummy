'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) alert(error.message)
      else alert('Signup successful! You can now log in.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        alert(error.message)
      } else {
        router.push('/')
      }
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    })
    if (error) alert(error.message)
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif', color: '#fff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{isSignUp ? 'Create an Account' : 'Login to Instagram'}</h2>
      
      {/* Email / Password Form */}
      <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '12px', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '12px', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '12px', background: '#0095f6', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Log In'}
        </button>
      </form>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#888' }}>
        <div style={{ flex: 1, height: '1px', background: '#333' }}></div>
        <span style={{ padding: '0 10px', fontSize: '14px' }}>OR</span>
        <div style={{ flex: 1, height: '1px', background: '#333' }}></div>
      </div>

      {/* Google Login Button */}
      <button
        onClick={handleGoogleLogin}
        style={{ width: '100%', padding: '12px', background: '#fff', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
      >
        <span>🌐</span> Continue with Google
      </button>

      <p style={{ textAlign: 'center', marginTop: '20px', color: '#888', cursor: 'pointer' }} onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
      </p>
    </div>
  )
}
