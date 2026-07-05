'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, Tag } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Shipping logic: Free shipping over $50, otherwise $5.99
  const shippingCost = cartTotal >= 50 || cartTotal === 0 ? 0 : 5.99;
  const taxRate = 0.08; // 8% tax
  const taxCost = cartTotal * taxRate;
  
  const discountCost = cartTotal * discount;
  const grandTotal = cartTotal + shippingCost + taxCost - discountCost;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    
    if (couponCode.toUpperCase() === 'WELCOME20') {
      setDiscount(0.2); // 20% off
      setCouponApplied(true);
      // Save coupon state in localStorage to read in checkout
      localStorage.setItem('discountCode', 'WELCOME20');
      localStorage.setItem('discountRate', '0.2');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setCouponApplied(false);
    setCouponCode('');
    localStorage.removeItem('discountCode');
    localStorage.removeItem('discountRate');
  };

  if (cart.length === 0) {
    return (
      <main className="section" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ display: 'inline-flex', width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-glow)', color: 'var(--primary)', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <ShoppingBag size={36} />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '15px' }}>
            Looks like you haven't added any products to your shopping cart yet. Explore our featured deals to get started!
          </p>
          <Link href="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="section animate-fade" style={{ minHeight: '80vh' }}>
      <div className="container">
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '32px' }}>Shopping Cart</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px' }} className="cart-layout">
          {/* Cart Items List */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cart.map((item) => {
                const subtotal = item.product.price * item.quantity;
                return (
                  <div key={item.product.id} className="card cart-item-card" style={{ display: 'flex', gap: '20px', padding: '20px', position: 'relative' }}>
                    {/* Item Image */}
                    <div style={{ width: '90px', height: '90px', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--bg-color)', flexShrink: 0 }}>
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Item Details */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ paddingRight: '36px' }}>
                        <Link href={`/products/${item.product.id}`} style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)', lineBreak: 'anywhere' }} className="btn-link">
                          {item.product.name}
                        </Link>
                        <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', fontWeight: '600' }}>
                          {item.product.category}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', flexWrap: 'wrap', gap: '12px' }}>
                        {/* Quantity Counter */}
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--bg-surface)' }}>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            style={{ background: 'transparent', border: 'none', padding: '6px 10px', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}
                            className="qty-btn-sm"
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ width: '30px', textAlign: 'center', fontWeight: '700', fontSize: '13px' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            style={{ background: 'transparent', border: 'none', padding: '6px 10px', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}
                            className="qty-btn-sm"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Price Calculations */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                            {item.quantity} × ${item.product.price.toFixed(2)} =
                          </span>
                          <span style={{ fontWeight: '800', fontSize: '15px', color: 'var(--primary)' }}>
                            ${subtotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: 'var(--radius-sm)'
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                      onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart Order Summary Card (Right) */}
          <div style={{ height: 'fit-content', position: 'sticky', top: '96px' }}>
            <div className="card glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                Order Summary
              </h3>

              {/* Price Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                  <span style={{ fontWeight: '600' }}>${cartTotal.toFixed(2)}</span>
                </div>

                {couponApplied && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                    <span>Discount (20% off)</span>
                    <span>-${discountCost.toFixed(2)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                  <span>{shippingCost === 0 ? <strong style={{ color: 'var(--success)' }}>FREE</strong> : `$${shippingCost.toFixed(2)}`}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Sales Tax (8%)</span>
                  <span>${taxCost.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '800', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '4px' }}>
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--primary)' }}>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code Input */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                {couponApplied ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--success-glow)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--success)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontSize: '13px', fontWeight: '700' }}>
                      <Tag size={14} />
                      <span>WELCOME20 Applied</span>
                    </div>
                    <button onClick={handleRemoveCoupon} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px', fontWeight: '600', textDecoration: 'underline' }}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Promo Code (WELCOME20)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      style={{ padding: '8px 12px', fontSize: '13px' }}
                    />
                    <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: '8px 16px' }}>
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <p style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '6px', fontWeight: '600' }}>{couponError}</p>
                )}
              </div>

              {/* Checkout Action Link */}
              <div style={{ marginTop: '10px' }}>
                <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', padding: '14px', gap: '8px', justifyContent: 'center' }}>
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .qty-btn-sm:hover {
          background-color: var(--border-color) !important;
        }
        @media (max-width: 900px) {
          .cart-layout {
            grid-template-columns: 1fr !important;
          }
          .cart-item-card {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .qty-btn-sm {
            padding: 8px 12px !important;
          }
        }
      `}</style>
    </main>
  );
}
