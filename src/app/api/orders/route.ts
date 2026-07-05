import { NextRequest, NextResponse } from 'next/server';
import { execute, query, queryOne, transaction } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items, shippingAddress, contactPhone, total } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!shippingAddress || !contactPhone) {
      return NextResponse.json(
        { error: 'Shipping address and contact phone are required' },
        { status: 400 }
      );
    }

    // Phone 10-digit validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(contactPhone)) {
      return NextResponse.json(
        { error: 'Contact phone number must be exactly 10 digits' },
        { status: 400 }
      );
    }

    const orderId = `o-${crypto.randomUUID()}`;

    // Perform database operations within a secure SQL TRANSACTION to prevent race conditions
    await transaction(async (db) => {
      // 1. Create order record
      await db.run(
        `INSERT INTO orders (id, user_id, total, status, shipping_address, contact_phone) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, user.id, parseFloat(total), 'PENDING', shippingAddress, contactPhone]
      );

      // 2. Loop and process each item
      for (const item of items) {
        // Fetch current product stock and price directly inside transaction
        const product = await db.get<{ name: string; stock: number; price: number }>(
          'SELECT name, stock, price FROM products WHERE id = ?',
          [item.productId]
        );

        if (!product) {
          throw new Error(`Product not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for "${product.name}". Only ${product.stock} units remaining.`);
        }

        // Deduct inventory stock
        await db.run(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.productId]
        );

        // Save order item record
        const itemId = `oi-${crypto.randomUUID()}`;
        await db.run(
          `INSERT INTO order_items (id, order_id, product_id, quantity, price) 
           VALUES (?, ?, ?, ?, ?)`,
          [itemId, orderId, item.productId, item.quantity, product.price]
        );
      }
    });

    return NextResponse.json({
      orderId,
      message: 'Order placed successfully!'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Order processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Query user's order history using SQL SELECT with JOIN
    const orders = await query(
      `SELECT o.*, COUNT(oi.id) as item_count
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [user.id]
    );

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
