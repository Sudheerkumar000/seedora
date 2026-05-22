# Seedora

Premium storefront for dry fruits, healthy laddus, Indian spices, seeds, mixes, gift boxes, and subscriptions.

## Current Features

- Premium Seedora landing and catalog experience
- 40 starter products across nuts, dried fruits, seeds, mixes, gifts, laddus, and spices
- Search, category filters, quick filters, budget filter, sorting, wishlist, and saved cart
- Product detail drawer with pack-size pricing
- Coupon support with `SEEDORA10`
- Checkout with all-India delivery, UPI, cards/net banking, wallets, and cash on delivery
- Backend APIs for products, OTP login, orders, payments, notification queue, and audit logs
- Owner product manager at `admin.html`
- Admin order dashboard with order status updates
- Admin dashboard summary for revenue, orders, customers, and products
- CSV exports for products, orders, and customers
- Stock updates from the admin product list
- Order detail view with customer address, payment info, item breakdown, and printable packing invoice
- Customer OTP login/signup drawer in the storefront
- Custom products can include future photo URLs and are saved in backend storage

## Business Details

- Phone: +91 97045 97062
- Delivery: All India
- Recommended default payment: UPI

UPI is the default because it is the most-used digital payment method in India by transaction volume. The app still supports cards, net banking, wallets, and cash on delivery.

## Run Locally

Run the backend:

```sh
npm start
```

Then open:

```text
http://127.0.0.1:4173/
```

Admin/product manager:

```text
http://127.0.0.1:4173/admin.html
```

Default local admin PIN:

```text
9704597062
```

Local seed data is stored in `data/seed.json`. Live local data is stored in `data/db.json`, which is ignored by git so customer/order data is not pushed to GitHub.

## Next Production Steps

- Replace illustrated placeholders with real product photos
- Connect checkout to Razorpay/Cashfree or another Indian payment gateway
- Connect orders and products to a real backend database
- Add delivery-rate rules by pincode
- Add authentication for the admin page before launch
