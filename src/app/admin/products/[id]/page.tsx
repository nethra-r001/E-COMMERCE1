'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save, Upload, Image as ImageIcon } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductEditorPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const isNew = id === 'new';

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isNew) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        const data = await res.json();
        
        if (res.ok && data.product) {
          setName(data.product.name);
          setCategory(data.product.category);
          setPrice(data.product.price.toString());
          setStock(data.product.stock.toString());
          setDescription(data.product.description);
          setImageUrl(data.product.image_url || '');
        } else {
          setError(data.error || 'Failed to load product details');
        }
      } catch (err) {
        setError('Network error while loading product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, isNew]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (res.ok && data.imageUrl) {
        setImageUrl(data.imageUrl);
        setSuccess('Image uploaded successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to upload image file');
      }
    } catch (err) {
      setError('Connection failure during image upload');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock);

    if (isNaN(priceNum) || priceNum < 0) {
      setError('Price must be a valid positive number');
      setSaving(false);
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      setError('Stock must be a valid positive integer');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        name,
        category,
        price: priceNum,
        stock: stockNum,
        description,
        imageUrl,
      };

      const url = isNew ? '/api/admin/products' : `/api/admin/products/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/products');
        router.refresh();
      } else {
        setError(data.error || 'Failed to save product details');
        setSaving(false);
      }
    } catch (err) {
      setError('Connection failure while saving product details');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
        Loading product information...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="animate-fade">
      {/* Header back navigation */}
      <div>
        <Link href="/admin/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }} className="btn-link">
          <ChevronLeft size={16} />
          Back to Products List
        </Link>
        <h2 style={{ fontSize: '28px', fontWeight: '800' }}>
          {isNew ? 'Add Product' : `Edit Product: ${name}`}
        </h2>
      </div>

      {error && (
        <div className="alert alert-danger">
          <div>{error}</div>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <div>{success}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px' }} className="editor-layout">
        {/* Core fields (Left) */}
        <div className="card glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Product Title</label>
            <input
              type="text"
              id="name"
              className="form-input"
              placeholder="e.g. Mechanical Tactile Keyboard"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={saving}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="price">Price ($)</label>
              <input
                type="number"
                step="0.01"
                id="price"
                className="form-input"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                disabled={saving}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="stock">Inventory Stock</label>
              <input
                type="number"
                id="stock"
                className="form-input"
                placeholder="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                disabled={saving}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="category">Category Division</label>
            <select
              id="category"
              className="form-input form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={saving}
            >
              <option value="Electronics">Electronics</option>
              <option value="Apparel">Apparel</option>
              <option value="Fitness">Fitness</option>
              <option value="Home & Living">Home & Living</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Detailed Description</label>
            <textarea
              id="description"
              className="form-input"
              rows={6}
              placeholder="Write specifications, features, and item details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={saving}
              style={{ resize: 'none', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="submit" className="btn btn-primary" style={{ gap: '8px', padding: '14px 28px' }} disabled={saving}>
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </div>

        {/* Image Uploader & Preview (Right) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Uploader Card */}
          <div className="card glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Product Image</h3>

            {/* Preview Box */}
            <div style={{
              width: '100%',
              aspectRatio: '1.2/1',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {imageUrl ? (
                <img src={imageUrl} alt="Upload preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)' }}>
                  <ImageIcon size={36} />
                  <span style={{ fontSize: '12px', marginTop: '8px' }}>No Image Bound</span>
                </div>
              )}
            </div>

            {/* File Input Upload */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <label 
                className="btn btn-secondary" 
                style={{ width: '100%', cursor: 'pointer', gap: '8px', padding: '10px', fontSize: '13px' }}
              >
                <Upload size={14} />
                {uploading ? 'Uploading Asset...' : 'Upload Local Image'}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  style={{ display: 'none' }} 
                  disabled={uploading || saving}
                />
              </label>
            </div>

            {/* Text Input URL */}
            <div className="form-group" style={{ margin: '0' }}>
              <label className="form-label" htmlFor="imageurl">Or Image URL</label>
              <input
                type="text"
                id="imageurl"
                className="form-input"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={saving}
                style={{ fontSize: '12px' }}
              />
            </div>
          </div>
        </div>
      </form>

      <style>{`
        @media (max-width: 900px) {
          .editor-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
