import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, CreditCard } from 'lucide-react';
import { query } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/context/CartContext';

// Dynamic route setup to ensure database queries run on every request
export const revalidate = 0;

export default async function Home() {
  let featuredProducts: Product[] = [];
  try {
    // Query featured products directly using raw SQL
    featuredProducts = await query<Product>('SELECT * FROM products LIMIT 4');
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
  }

  return (
    <main className="animate-fade">
      {/* 1. Hero Section */}
      <section style={{
        background: 'radial-gradient(circle at 80% 20%, hsla(var(--primary-hue), var(--primary-sat), 90%, 0.15), transparent 50%), linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-color) 100%)',
        borderBottom: '1px solid var(--border-color)',
        padding: '100px 0 120px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative blur elements */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'var(--primary)',
          opacity: '0.04',
          filter: 'blur(100px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'var(--secondary)',
          opacity: '0.03',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }} />

        <div className="container hero-layout">
          <div className="animate-slide">
            <span className="badge badge-info" style={{ marginBottom: '20px', padding: '6px 14px', fontSize: '12px' }}>
              Summer Launch Event
            </span>
            <h1 style={{ fontSize: '64px', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-0.02em' }}>
              Experience the Future of <span style={{ color: 'var(--primary)', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Smart Tech</span>
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '580px', lineHeight: '1.7' }}>
              Discover curated devices and everyday premium goods designed to elevate your workflow and lifestyle. Seamless integration, high performance, and minimal aesthetics.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/products" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '16px', gap: '12px' }}>
                Explore Products
                <ArrowRight size={18} />
              </Link>
              <Link href="/products?category=Electronics" className="btn btn-secondary" style={{ padding: '16px 32px', fontSize: '16px' }}>
                Shop Electronics
              </Link>
            </div>
          </div>
          
          <div className="animate-slide" style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div style={{
              width: '100%',
              maxWidth: '380px',
              aspectRatio: '1/1',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid var(--border-color)',
              padding: '24px',
              boxShadow: 'var(--shadow-xl)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80" 
                alt="Featured Product Smartwatch"
                style={{ width: '80%', height: '80%', objectFit: 'contain', marginBottom: '16px', borderRadius: 'var(--radius-lg)' }}
              />
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>Chronos Smartwatch v2</h3>
              <p style={{ color: 'var(--primary)', fontWeight: '800' }}>$199.99</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Value Proposition (Trust indicators) */}
      <section style={{ padding: '48px 0', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="grid-4" style={{ gap: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Truck size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Free Fast Delivery</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>On all orders above $50.00</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Secure Checkout</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Fully encrypted SSL payments</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <RotateCcw size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: '700' }}>30-Day Returns</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Hassle-free money-back guarantee</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <CreditCard size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Flexible Financing</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Split payments with zero interest</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
                Curated Collection
              </span>
              <h2 style={{ fontSize: '36px', fontWeight: '800' }}>Featured Highlights</h2>
            </div>
            <Link href="/products" className="btn btn-secondary" style={{ gap: '8px' }}>
              View Catalog
              <ArrowRight size={16} />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No featured products found. Please seed the database.</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. Promotional Banner */}
      <section className="section" style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, hsl(var(--primary-hue), var(--primary-sat), 35%) 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '64px 80px',
            color: '#ffffff',
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '48px',
            alignItems: 'center',
            boxShadow: 'var(--shadow-xl)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background design elements */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-20%',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              pointerEvents: 'none'
            }} />
            
            <div>
              <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '9999px', display: 'inline-block', marginBottom: '24px' }}>
                Limited Time Offer
              </span>
              <h2 style={{ fontSize: '40px', fontWeight: '800', lineHeight: '1.2', marginBottom: '16px', color: '#ffffff' }}>
                Get 20% off on your first order of Eco-Friendly Products
              </h2>
              <p style={{ fontSize: '16px', opacity: 0.85, marginBottom: '32px', maxWidth: '480px' }}>
                Use checkout coupon code <strong style={{ color: '#ffffff', textDecoration: 'underline' }}>WELCOME20</strong> to unlock savings on fitness essentials and home decor.
              </p>
              <Link href="/products?category=Fitness" className="btn" style={{ backgroundColor: '#ffffff', color: 'var(--primary)', padding: '14px 28px' }}>
                Shop Eco Collection
              </Link>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img 
                src="https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&auto=format&fit=crop&q=80" 
                alt="Eco-friendly cork yoga mat"
                style={{ width: '100%', maxWidth: '300px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Customer Testimonials */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
              Testimonials
            </span>
            <h2 style={{ fontSize: '36px', fontWeight: '800' }}>Trusted by Thousands</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '12px auto 0 auto' }}>
              Read reviews from customers who have elevated their daily lives with our premium catalog.
            </p>
          </div>

          <div className="grid-3">
            <div className="card glass-card">
              <div style={{ display: 'flex', color: '#f59e0b', marginBottom: '16px', fontSize: '18px' }}>★★★★★</div>
              <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
                "The Apex Wireless Headphones are absolutely stellar. The noise cancelling is deep and rich, and the battery lasts for weeks of regular commutes. Unbeatable value!"
              </p>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Sarah Jenkins</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Verified Purchaser</p>
              </div>
            </div>

            <div className="card glass-card">
              <div style={{ display: 'flex', color: '#f59e0b', marginBottom: '16px', fontSize: '18px' }}>★★★★★</div>
              <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
                "Sleek and minimal checkout experience! I ordered the Smartwatch and it arrived in Seattle in just 2 days. The customer service team was incredibly fast and helpful."
              </p>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Michael Chen</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Verified Purchaser</p>
              </div>
            </div>

            <div className="card glass-card">
              <div style={{ display: 'flex', color: '#f59e0b', marginBottom: '16px', fontSize: '18px' }}>★★★★★</div>
              <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
                "I bought the cork yoga mat and ambient lamp. Both products are premium quality. They look beautiful in my home and feel great to use. Definitely shopping here again."
              </p>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Emma Watson</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Verified Purchaser</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)', padding: '60px 0 30px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.5fr 0.5fr 1fr', gap: '32px', marginBottom: '48px' }}>
            <div>
              <Link href="/" className="logo" style={{ marginBottom: '16px' }}>
                <ShieldCheck size={24} />
                Next<span>Commerce</span>
              </Link>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '240px', lineHeight: '1.6' }}>
                Modern, secure, and lightning-fast full-stack e-commerce catalog powered by raw SQL and Next.js.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>Shop</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <li><Link href="/products" className="btn-link" style={{ padding: 0 }}>All Products</Link></li>
                <li><Link href="/products?category=Electronics" className="btn-link" style={{ padding: 0 }}>Electronics</Link></li>
                <li><Link href="/products?category=Apparel" className="btn-link" style={{ padding: 0 }}>Apparel</Link></li>
                <li><Link href="/products?category=Fitness" className="btn-link" style={{ padding: 0 }}>Fitness</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>Account</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <li><Link href="/login" className="btn-link" style={{ padding: 0 }}>Login</Link></li>
                <li><Link href="/signup" className="btn-link" style={{ padding: 0 }}>Signup</Link></li>
                <li><Link href="/orders" className="btn-link" style={{ padding: 0 }}>Order History</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>Secure Trading</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                All transaction details are protected via Secure Sockets Layer (SSL) encryption protocol.
              </p>
              <div style={{ display: 'flex', gap: '8px', fontSize: '20px', color: 'var(--text-muted)' }}>
                💳 🔒 🛡️
              </div>
            </div>
          </div>
          
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              © 2026 NextCommerce Inc. All rights reserved. Built with pure SQL.
            </p>
            <div style={{ display: 'flex', gap: '24px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
