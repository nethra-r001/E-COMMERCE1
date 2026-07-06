import { NextResponse } from "next/server";
import { execute, query, queryOne } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export const revalidate = 0;

export async function GET(req, { params }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // 1. Fetch order details
    const order = await queryOne(
      `SELECT o.*, u.name as customer_name, u.email as customer_email 
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.id = ?`,
      [id],
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 2. Fetch order items with product details using SQL JOIN
    const items = await query(
      `SELECT oi.*, p.name, p.image_url, p.category 
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [id],
    );

    return NextResponse.json({ order, items }, { status: 200 });
  } catch (error) {
    console.error("Admin order fetch detail error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();

    const validStatuses = [
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];
    if (!status || !validStatuses.includes(status.toUpperCase())) {
      return NextResponse.json(
        { error: "Invalid status type" },
        { status: 400 },
      );
    }

    // Update order status using raw SQL
    const result = await execute("UPDATE orders SET status = ? WHERE id = ?", [
      status.toUpperCase(),
      id,
    ]);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Order status updated successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Admin order status update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
