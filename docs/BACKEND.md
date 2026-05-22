# Seedora Backend Plan

Seedora now has a local backend in `server.js` and persistent business data in `data/db.json`.

## Current Local Backend

The local backend supports:

- Product catalog API
- Admin product create/update/delete
- Customer OTP request and verification
- Customer records
- Address records
- Order creation
- Admin order listing and status updates
- Admin dashboard summary
- CSV exports for products, orders, and customers
- Stock update workflow
- Automatic stock reduction on order creation
- Automatic restock on cancellation/refund
- Inventory movement history and low-stock alerts
- Packing invoice data for orders, addresses, and payments
- Local payment simulation and payment-status management
- Payment records
- Notification queue
- Audit logs
- Static app hosting

Run it with:

```sh
npm start
```

Open:

```text
http://127.0.0.1:4173/
```

Admin page:

```text
http://127.0.0.1:4173/admin.html
```

Default local admin PIN:

```text
9704597062
```

## Data Storage

Local development uses:

```text
data/db.json
```

It stores:

- `settings`
- `categories`
- `products`
- `customers`
- `addresses`
- `orders`
- `payments`
- `otpVerifications`
- `notifications`
- `auditLogs`
- `inventoryMovements`

## Admin API Highlights

- `GET /api/admin/orders` returns orders with customers, addresses, and payments.
- `PUT /api/admin/orders/:id` updates packing, shipping, delivery, cancellation, and refund status.
- `PUT /api/admin/payments/:orderId` simulates payment status changes for local testing.
- `GET /api/admin/inventory` returns low-stock alerts and stock movement history.
- `GET /api/admin/export/products|orders|customers?pin=...` downloads CSV exports.

Payment simulation supports `payment_pending`, `paid`, `failed`, `refunded`, and `cod_pending`. A paid status creates a local gateway-style payment ID. A refunded status marks the order as refunded and restores reserved stock one time.

For production, move this to PostgreSQL.

## Production Database Tables

Recommended PostgreSQL tables:

- `users`
- `customer_profiles`
- `addresses`
- `categories`
- `products`
- `product_images`
- `inventory`
- `carts`
- `cart_items`
- `orders`
- `order_items`
- `payments`
- `refunds`
- `coupons`
- `otp_verifications`
- `notifications`
- `audit_logs`

## Indian Business Integrations

Recommended providers:

- Payments: Razorpay or Cashfree
- SMS OTP: MSG91, Exotel, Twilio, or Fast2SMS
- Email: Amazon SES, Resend, or SendGrid
- Product images: Cloudinary or AWS S3
- Hosting: Vercel frontend, Render/Railway/AWS backend

## Security Rules

- Do not store card numbers or UPI PINs.
- Store only payment IDs, method, amount, status, gateway order ID, gateway payment ID, and refund status.
- Use OTP hashes, not raw OTPs, in production.
- Protect admin APIs with real admin login before launch.
- Add consent and privacy notice for customer data.
- Keep audit logs for orders, products, refunds, and admin actions.
