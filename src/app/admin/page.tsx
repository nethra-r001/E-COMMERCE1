'use client';

import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp, 
  Clock, 
  Activity, 
  ArrowUpRight 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell 
} from 'recharts';

interface KPI {
  totalRevenue: number;
  totalOrders: number;
  totalStock: number;
  totalCustomers: number;
  conversionRate: number;
}

interface SalesOverTimeData {
  date: string;
  revenue: number;
  ordersCount: number;
}

interface SalesByCategoryData {
  category: string;
  revenue: number;
  count: number;
}

interface TopProduct {
  name: string;
  category: string;
  quantity: number;
  revenue: number;
}

interface RecentActivity {
  id: string;
  name: string;
  total: number;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KPI | null>(null);
  const [salesData, setSalesData] = useState<SalesOverTimeData[]>([]);
  const [categoryData, setCategoryData] = useState<SalesByCategoryData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/admin/analytics');
        if (res.ok) {
          const data = await res.json();
          setKpis(data.kpis);
          setSalesData(data.salesOverTime);
          setCategoryData(data.salesByCategory);
          setTopProducts(data.topProducts);
          setActivities(data.recentActivities);
        }
      } catch (e) {
        console.error('Failed to load analytics details');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Standard status badge helper
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return <span className="badge badge-warning">Pending</span>;
      case 'PROCESSING':
        return <span className="badge badge-info">Processing</span>;
      case 'SHIPPED':
        return <span className="badge badge-info" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>Shipped</span>;
      case 'DELIVERED':
        return <span className="badge badge-success">Delivered</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="animate-fade">
        <h2 style={{ fontSize: '28px', fontWeight: '800' }}>Loading Dashboard Metrics...</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card" style={{ height: '120px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
          <div className="card" style={{ height: '350px', background: 'var(--bg-surface)', animation: 'pulse 1.5s infinite' }} />
          <div className="card" style={{ height: '350px', background: 'var(--bg-surface)', animation: 'pulse 1.5s infinite' }} />
        </div>
      </div>
    );
  }

  // Predefined chart theme colors
  const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }} className="animate-fade">
      {/* Dashboard Top Header */}
      <div>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Analytics Overview</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome to your workspace dashboard. Here is your business health overview.</p>
      </div>

      {/* KPI Cards Grid */}
      {kpis && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          {/* Card 1: Revenue */}
          <div className="card glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--success-glow)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={24} />
            </div>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', fontWeight: '600' }}>Total Revenue</span>
              <strong style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>${kpis.totalRevenue.toFixed(2)}</strong>
            </div>
          </div>

          {/* Card 2: Orders */}
          <div className="card glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={24} />
            </div>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', fontWeight: '600' }}>Total Orders</span>
              <strong style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>{kpis.totalOrders}</strong>
            </div>
          </div>

          {/* Card 3: Customers */}
          <div className="card glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
              <Users size={24} />
            </div>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', fontWeight: '600' }}>Active Users</span>
              <strong style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>{kpis.totalCustomers}</strong>
            </div>
          </div>

          {/* Card 4: Inventory */}
          <div className="card glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--warning-glow)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
              <Package size={24} />
            </div>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', fontWeight: '600' }}>Stock Inventory</span>
              <strong style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>{kpis.totalStock} units</strong>
            </div>
          </div>

          {/* Card 5: Conversion */}
          <div className="card glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', fontWeight: '600' }}>Conversion Rate</span>
              <strong style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>{kpis.conversionRate}%</strong>
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }} className="dashboard-charts-layout">
        {/* Chart 1: Sales Over Time */}
        <div className="card glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} style={{ color: 'var(--primary)' }} />
            Revenue Over Time (Last 30 Days)
          </h3>
          <div style={{ width: '100%', height: '300px' }}>
            {salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)' }}
                    labelStyle={{ fontWeight: '700', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue ($)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                No sales data collected yet.
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Category Breakdown */}
        <div className="card glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} style={{ color: 'var(--secondary)' }} />
            Revenue By Category
          </h3>
          <div style={{ width: '100%', height: '300px' }}>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="category" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)' }}
                  />
                  <Bar dataKey="revenue" name="Revenue ($)" radius={[4, 4, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                No category metrics available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tables Grid Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '32px' }} className="dashboard-tables-layout">
        {/* Top Selling Products Table */}
        <div className="card glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Top Selling Products</h3>
          <div className="table-container">
            <table className="custom-table" style={{ fontSize: '13px' }}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Quantity Sold</th>
                  <th>Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.length > 0 ? (
                  topProducts.map((prod, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: '700' }}>{prod.name}</td>
                      <td>{prod.category}</td>
                      <td>{prod.quantity}</td>
                      <td style={{ fontWeight: '700', color: 'var(--primary)' }}>${prod.revenue.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                      No items sold yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="card glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Recent Orders</h3>
          <div className="table-container">
            <table className="custom-table" style={{ fontSize: '13px' }}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activities.length > 0 ? (
                  activities.map((act, idx) => (
                    <tr key={idx}>
                      <td style={{ fontFamily: 'monospace', fontWeight: '600' }}>{act.id.substring(0, 10)}...</td>
                      <td>{act.name}</td>
                      <td style={{ fontWeight: '700' }}>${act.total.toFixed(2)}</td>
                      <td>{getStatusBadge(act.status)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                      No order activities registered.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-charts-layout, .dashboard-tables-layout {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
