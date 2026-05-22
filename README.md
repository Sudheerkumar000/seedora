# Seedora

Premium storefront for dry fruits, healthy laddus, Indian spices, seeds, mixes, gift boxes, and subscriptions.

## Current Features

- Premium Seedora landing and catalog experience
- 40 starter products across nuts, dried fruits, seeds, mixes, gifts, laddus, and spices
- Search, category filters, quick filters, budget filter, sorting, wishlist, and saved cart
- Product detail drawer with pack-size pricing
- Coupon support with `SEEDORA10`
- Checkout with all-India delivery, UPI, cards/net banking, wallets, and cash on delivery
- Owner product manager at `admin.html`
- Custom products can include future photo URLs and are saved in browser storage

## Business Details

- Phone: +91 97045 97062
- Delivery: All India
- Recommended default payment: UPI

UPI is the default because it is the most-used digital payment method in India by transaction volume. The app still supports cards, net banking, wallets, and cash on delivery.

## Run Locally

Open `index.html` directly in a browser, or run a local static server:

```sh
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/
```

Admin/product manager:

```text
http://127.0.0.1:4173/admin.html
```

## Next Production Steps

- Replace illustrated placeholders with real product photos
- Connect checkout to Razorpay/Cashfree or another Indian payment gateway
- Connect orders and products to a real backend database
- Add delivery-rate rules by pincode
- Add authentication for the admin page before launch
