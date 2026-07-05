'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, User, LogOut, LayoutDashboard, ShoppingCart, UserCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount } = useCart();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    window.addEventListener('auth-change', fetchUser);
    return () => {
      window.removeEventListener('auth-change', fetchUser);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setUser(null);
        window.dispatchEvent(new Event('auth-change'));
        router.push('/');
        router.refresh();
      }
    } catch (e) {
      console.error('Logout failed');
    }
  };

  // Hide storefront navbar on admin panel pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="site-header">
      <div className="container nav-container">
        <Link href="/" className="logo">
          <ShoppingBag size={28} />
          Next<span>Commerce</span>
        </Link>

        <nav>
          <ul className="nav-menu">
            <li>
              <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className={`nav-link ${pathname.startsWith('/products') ? 'active' : ''}`}>
                Products
              </Link>
            </li>
            {user && (
              <li>
                <Link href="/orders" className={`nav-link ${pathname.startsWith('/orders') ? 'active' : ''}`}>
                  My Orders
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="nav-actions">
          <Link href="/cart" className="cart-icon" aria-label="Shopping Cart">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>

          {!loading && (
            <>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <User size={16} />
                    <span>{user.name}</span>
                  </div>

                  {user.role === 'ADMIN' && (
                    <Link href="/admin" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <LayoutDashboard size={14} />
                      Admin Panel
                    </Link>
                  )}

                  <button 
                    onClick={handleLogout} 
                    className="btn btn-secondary btn-sm"
                    style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Link href="/login" className="btn btn-secondary btn-sm">
                    Login
                  </Link>
                  <Link href="/signup" className="btn btn-primary btn-sm">
                    Sign Up
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
