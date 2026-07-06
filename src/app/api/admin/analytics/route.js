import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export const revalidate = 0;

export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. High-level KPIs
    const revenueRow = await queryOne(
      'SELECT SUM(total) as val FROM orders WHERE status != "CANCELLED"',
    );
    const totalOrdersRow = await queryOne("SELECT COUNT(*) as val FROM orders");
    const totalStockRow = await queryOne(
      "SELECT SUM(stock) as val FROM products",
    );
    const totalCustomersRow = await queryOne(
      'SELECT COUNT(*) as val FROM users WHERE role = "USER"',
    );

    const totalRevenue = revenueRow?.val || 0;
    const totalOrders = totalOrdersRow?.val || 0;
    const totalStock = totalStockRow?.val || 0;
    const totalCustomers = totalCustomersRow?.val || 0;

    // 2. Sales Over Time (Last 30 Days) using strftime grouping
    const salesOverTime = await query(
      `SELECT date(created_at) as date, SUM(total) as revenue, COUNT(*) as ordersCount
       FROM orders
       WHERE status != "CANCELLED" AND created_at >= date('now', '-30 days')
       GROUP BY date
       ORDER BY date ASC`,
    );

    // 3. Sales By Category Distribution
    const salesByCategory = await query(
      `SELECT p.category, SUM(oi.quantity * oi.price) as revenue, SUM(oi.quantity) as count
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.status != "CANCELLED"
       GROUP BY p.category
       ORDER BY revenue DESC`,
    );

    // 4. Top Selling Products
    const topProducts = await query(
      `SELECT p.name, p.category, SUM(oi.quantity) as quantity, SUM(oi.quantity * oi.price) as revenue
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.status != "CANCELLED"
       GROUP BY p.id
       ORDER BY quantity DESC
       LIMIT 5`,
    );

    // 5. Recent Customer Activities (recent orders with user names)
    const recentActivities = await query(
      `SELECT o.id, u.name, o.total, o.status, o.created_at
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT 5`,
    );

    return NextResponse.json(
      {
        kpis: {
          totalRevenue: parseFloat(totalRevenue.toFixed(2)),
          totalOrders,
          totalStock,
          totalCustomers,
          conversionRate:
            totalOrders > 0
              ? parseFloat(
                  ((totalOrders / (totalCustomers * 12 || 1)) * 100).toFixed(2),
                )
              : 0,
        },
        salesOverTime,
        salesByCategory,
        topProducts,
        recentActivities,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
