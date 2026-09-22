'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function BottomNav() {
  const pathname = usePathname();

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      width: '100%',
      background: '#000',
      borderTop: '1px solid #222',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '12px 0',
      zIndex: 1000,
    }}>
      <Link href="/" style={{ color: pathname === '/' ? '#fff' : '#888', fontSize: '24px', textDecoration: 'none' }}>
        🏠
      </Link>
      <Link href="/explore" style={{ color: pathname === '/explore' ? '#fff' : '#888', fontSize: '24px', textDecoration: 'none' }}>
        🔍
      </Link>
      <Link href="/create" style={{ color: pathname === '/create' ? '#fff' : '#888', fontSize: '24px', textDecoration: 'none' }}>
        ➕
      </Link>
      <Link href="/profile" style={{ color: pathname === '/profile' ? '#fff' : '#888', fontSize: '24px', textDecoration: 'none' }}>
        👤
      </Link>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ background: '#000', color: '#fff', margin: 0, paddingBottom: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
