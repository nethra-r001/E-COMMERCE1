import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcryptjs";

async function setup() {
  const dbDir = path.join(process.cwd(), "db");
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const dbPath = process.env.DATABASE_PATH || path.join(dbDir, "ecommerce.sqlite");
  if (fs.existsSync(dbPath)) {
    console.log("Database file already exists. Skipping setup to protect data.");
    return;
  }
  console.log(`Setting up SQLite database at: ${dbPath}`);

  // Open database
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Read and run schema.sql
  const schemaPath = path.join(process.cwd(), "db", "schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf8");
  await db.exec(schemaSql);
  console.log("Database tables created successfully.");

  // Check if users exist. If not, seed users.
  const usersCount = await db.get("SELECT COUNT(*) as count FROM users");
  if (usersCount && usersCount.count === 0) {
    console.log("Seeding users...");
    const adminPasswordHash = bcrypt.hashSync("admin123", 10);
    const userPasswordHash = bcrypt.hashSync("user123", 10);

    await db.run(
      "INSERT INTO users (id, name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)",
      [
        "u-admin",
        "Admin User",
        "admin@example.com",
        adminPasswordHash,
        "9876543210",
        "ADMIN",
      ],
    );
    await db.run(
      "INSERT INTO users (id, name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)",
      [
        "u-customer1",
        "John Doe",
        "user@example.com",
        userPasswordHash,
        "1234567890",
        "USER",
      ],
    );
    await db.run(
      "INSERT INTO users (id, name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)",
      [
        "u-customer2",
        "Jane Smith",
        "jane@example.com",
        userPasswordHash,
        "9998887776",
        "USER",
      ],
    );
    console.log(
      "Users seeded: admin@example.com (admin123) and user@example.com (user123) with phone numbers",
    );
  }

  // Check if products exist. If not, seed products.
  const productsCount = await db.get("SELECT COUNT(*) as count FROM products");
  let productsList = [];
  if (productsCount && productsCount.count === 0) {
    console.log("Seeding products...");
    productsList = [
      {
        id: "p-1",
        name: "Apex Wireless Headphones",
        description:
          "Premium active noise-cancelling wireless headphones with 40-hour battery life, high-fidelity sound, and ergonomic design.",
        price: 149.99,
        stock: 45,
        image_url:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
        category: "Electronics",
      },
      {
        id: "p-2",
        name: "Chronos Smartwatch v2",
        description:
          "Sleek smartwatch featuring real-time health tracking, heart rate monitoring, GPS, and custom watch faces with up to 7 days of battery life.",
        price: 199.99,
        stock: 30,
        image_url:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
        category: "Electronics",
      },
      {
        id: "p-3",
        name: "Tactile Mechanical Keyboard",
        description:
          "Tenkeyless RGB mechanical keyboard with custom brown switches for responsive typing and gaming. Includes premium double-shot PBT keycaps.",
        price: 89.99,
        stock: 75,
        image_url:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
        category: "Electronics",
      },
      {
        id: "p-4",
        name: "Eco-Leather Bomber Jacket",
        description:
          "Classic fit bomber jacket made from premium sustainable synthetic leather. Warm, wind-resistant, and perfect for styling any outfit.",
        price: 129.99,
        stock: 15,
        image_url:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
        category: "Apparel",
      },
      {
        id: "p-5",
        name: "Minimalist Cotton T-Shirt Pack",
        description:
          "Pack of 3 essential t-shirts made from 100% organic cotton. Soft, breathable, and pre-shrunk for the perfect everyday fit.",
        price: 34.99,
        stock: 120,
        image_url:
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
        category: "Apparel",
      },
      {
        id: "p-6",
        name: "Ergonomic Cork Yoga Mat",
        description:
          "Non-slip natural cork yoga mat with alignment lines. Provides excellent cushioning, grip, and natural antimicrobial properties.",
        price: 49.99,
        stock: 50,
        image_url:
          "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&auto=format&fit=crop&q=80",
        category: "Fitness",
      },
      {
        id: "p-7",
        name: "Stainless Steel Water Bottle",
        description:
          "Double-walled vacuum insulated water bottle. Keeps drinks ice cold for 24 hours or piping hot for 12 hours. Leakproof loop cap.",
        price: 24.99,
        stock: 200,
        image_url:
          "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
        category: "Fitness",
      },
      {
        id: "p-8",
        name: "Cold Brew Coffee Maker",
        description:
          "1.5L glass carafe cold brew maker with airtight lid and ultra-fine stainless steel mesh filter for smooth, sediment-free coffee concentrated extract.",
        price: 39.99,
        stock: 40,
        image_url:
          "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80",
        category: "Home & Living",
      },
      {
        id: "p-9",
        name: "Smart Ambient LED Lamp",
        description:
          "WiFi-connected tabletop ambient lamp. Select from millions of colors and warm/cool whites using smartphone app or voice control integrations.",
        price: 54.99,
        stock: 65,
        image_url:
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
        category: "Home & Living",
      },
      {
        id: "p-10",
        name: "Minimalist Ceramic Vase Set",
        description:
          "Set of 3 matte white ceramic vases in varied modern geometric shapes. Elegant decor piece for dried or fresh bouquets.",
        price: 29.99,
        stock: 80,
        image_url:
          "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&auto=format&fit=crop&q=80",
        category: "Home & Living",
      },
    ];

    for (const p of productsList) {
      await db.run(
        "INSERT INTO products (id, name, description, price, stock, image_url, category) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          p.id,
          p.name,
          p.description,
          p.price,
          p.stock,
          p.image_url,
          p.category,
        ],
      );
    }
    console.log("Products seeded successfully.");
  } else {
    productsList = await db.all("SELECT * FROM products");
  }

  // Check if orders exist. If not, seed historical orders.
  const ordersCount = await db.get("SELECT COUNT(*) as count FROM orders");
  if (ordersCount && ordersCount.count === 0 && productsList.length > 0) {
    console.log("Seeding mock orders for analytics dashboard...");
    const userIds = ["u-customer1", "u-customer2"];
    const orderStatuses = [
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "DELIVERED",
      "DELIVERED",
    ];
    const now = new Date();
    let orderIndex = 1;
    for (let i = 29; i >= 0; i--) {
      const ordersPerDay = Math.floor(Math.random() * 3) + 1;
      const orderDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      for (let o = 0; o < ordersPerDay; o++) {
        const orderId = `o-seed-${orderIndex++}`;
        const userId = userIds[Math.floor(Math.random() * userIds.length)];
        const status =
          orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
        const numItems = Math.floor(Math.random() * 3) + 1;
        const selectedProducts = [];
        let orderTotal = 0;
        for (let item = 0; item < numItems; item++) {
          const prod =
            productsList[Math.floor(Math.random() * productsList.length)];
          if (!selectedProducts.find((x) => x.prod.id === prod.id)) {
            const quantity = Math.floor(Math.random() * 2) + 1;
            selectedProducts.push({ prod, quantity });
            orderTotal += prod.price * quantity;
          }
        }
        const formattedDate = orderDate
          .toISOString()
          .replace("T", " ")
          .substring(0, 19);
        await db.run(
          `INSERT INTO orders (id, user_id, total, status, shipping_address, contact_phone, created_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            userId,
            parseFloat(orderTotal.toFixed(2)),
            status,
            "123 E-Commerce Way, Seattle, WA 98101",
            "+1 (555) 019-2834",
            formattedDate,
          ],
        );
        for (const item of selectedProducts) {
          const itemId = `oi-seed-${orderId}-${item.prod.id}`;
          await db.run(
            `INSERT INTO order_items (id, order_id, product_id, quantity, price) 
             VALUES (?, ?, ?, ?, ?)`,
            [itemId, orderId, item.prod.id, item.quantity, item.prod.price],
          );
        }
      }
    }
    console.log(`Seeded ${orderIndex - 1} historical orders successfully.`);
  }

  await db.close();
  console.log("Database setup complete!");
}

setup().catch((err) => {
  console.error("Database setup failed:", err);
  process.exit(1);
});
