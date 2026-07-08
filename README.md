E-CellCommerce

# E-CellCommerce is a premium, secure, and lightning-fast full-stack storefront and administrative dashboard built with Next.js, SQLite, and raw SQL queries** . It features a modern **purple glassmorphic** user interface and is fully responsive across all screens.

---

##  Key Features

###  Customer Storefront
* **Interactive Catalog**: Browse, search, sort, and filter products by category.
* **Shopping Cart**: Add, increase, or decrease items in the cart. The app automatically blocks customers from ordering more than what is in stock.
* **Discount Code**: Type in coupon code `WELCOME20` at checkout to get an automatic 20% discount.
* **Order History**: Customers can log in to view their past orders and track shipping statuses (e.g., `PENDING`, `SHIPPED`, `DELIVERED`).

###  Built-in Validation Rules
* **Name Check**: User registration enforces that names contain only letters and spaces (no numbers or symbols). This is checked on both the client form and the server API.
* **Phone Check**: Regulates that contact phone inputs contain exactly 10 digits during signup and checkout.

### Admin Dashboard
* **Business Analytics**: Track key performance metrics (total money made, order counts, product stocks) with interactive sales line charts and category split charts built using `recharts`.
* **Product Catalog Management**: Create, edit, and delete products with local image upload support to `public/uploads/`.
* **Order Fulfillment**: Track all customer orders, inspect item details, and change delivery tracking states.

---

## 🛠️ Technology Stack
* **Framework**: Next.js (App Router, Pure JavaScript/JSX)
* **Database**: SQLite (managed with promise-based connectors and pure raw SQL queries)
* **Security**: JWT sessions, secure cookie-based route guards (`proxy.js`), and bcryptjs password hashing.
* **Styling**: Vanilla CSS (CSS custom properties, frosted-glass backdrops, neon glow filters, responsive media queries).

---

## 📂 Project Structure
```text
├── db/
│   ├── schema.sql       # SQLite tables structure definition
│   ├── setup.mjs        # Database seeder (Native ES Module)
│   └── setup.js         # Local database seeder
├── src/
│   ├── app/
│   │   ├── admin/       # Dashboard analytics and inventory pages
│   │   ├── api/         # User auth, admin products, and order endpoints
│   │   ├── cart/        # Shopping cart page
│   │   ├── checkout/    # Shipping form and checkout transaction logic
│   │   ├── login/       # Login page
│   │   ├── orders/      # Customer order tracking page
│   │   ├── products/    # Public catalog pages
│   │   ├── signup/      # Customer registration page
│   │   ├── globals.css  # CSS styling system (Purple glassmorphism)
│   │   └── layout.jsx   # Core wrapper layout
│   ├── components/      # UI components (Navbar, etc.)
│   ├── context/         # React context provider for global cart state
│   ├── lib/
│   │   ├── auth.js      # Bcrypt and JWT utilities
│   │   └── db.js        # SQLite database connection helper
│   └── proxy.js         # Session and admin role route guards
├── package.json         # Project metadata and dependencies
└── jsconfig.json        # Path alias compiler configs
