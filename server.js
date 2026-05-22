const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const root = __dirname;
const dbPath = path.join(root, "data", "db.json");
const seedPath = path.join(root, "data", "seed.json");
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";
const adminPin = process.env.SEEDORA_ADMIN_PIN || "9704597062";
const sessionTtlMs = 1000 * 60 * 60 * 24 * 14;
const otpTtlMs = 1000 * 60 * 5;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

function readDb() {
  if (!fs.existsSync(dbPath)) {
    fs.copyFileSync(seedPath, dbPath);
  }
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function writeDb(db) {
  ensureCollections(db);
  db.meta.updatedAt = new Date().toISOString();
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function send(res, status, payload, headers = {}) {
  const body = typeof payload === "string" ? payload : JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": typeof payload === "string" ? "text/plain; charset=utf-8" : "application/json; charset=utf-8",
    ...headers,
  });
  res.end(body);
}

function json(res, status, payload) {
  send(res, status, payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body is too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
  });
}

function slug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function hash(value, salt = crypto.randomBytes(16).toString("hex")) {
  const digest = crypto.scryptSync(String(value), salt, 32).toString("hex");
  return `${salt}:${digest}`;
}

function verifyHash(value, stored) {
  const [salt, digest] = stored.split(":");
  return hash(value, salt).split(":")[1] === digest;
}

function audit(db, action, details = {}) {
  db.auditLogs.push({
    id: crypto.randomUUID(),
    action,
    details,
    createdAt: new Date().toISOString(),
  });
}

function ensureCollections(db) {
  db.inventoryMovements ||= [];
}

function recordInventoryMovement(db, movement) {
  ensureCollections(db);
  db.inventoryMovements.push({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...movement,
  });
}

function notify(db, channel, to, template, payload = {}) {
  db.notifications.push({
    id: crypto.randomUUID(),
    channel,
    to,
    template,
    payload,
    status: "queued",
    createdAt: new Date().toISOString(),
  });
}

function requireAdmin(req, res) {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  if (req.headers["x-admin-pin"] !== adminPin && requestUrl.searchParams.get("pin") !== adminPin) {
    json(res, 401, { error: "Admin PIN required" });
    return false;
  }
  return true;
}

function publicProduct(product) {
  const { active, ...rest } = product;
  return rest;
}

function upsertCategory(db, name) {
  if (db.categories.some((category) => category.name === name)) return;
  db.categories.push({
    id: slug(name),
    name,
    sortOrder: db.categories.length + 1,
    active: true,
  });
}

function cleanProduct(input, existing = {}) {
  const name = String(input.name || existing.name || "").trim();
  if (!name) throw new Error("Product name is required");
  const price = Number(input.price ?? existing.price);
  const mrp = Number(input.mrp ?? existing.mrp ?? price);
  if (!Number.isFinite(price) || price <= 0) throw new Error("Valid price is required");
  if (!Number.isFinite(mrp) || mrp < price) throw new Error("MRP must be greater than or equal to price");

  const previousStock = Number(existing.stock ?? 100);
  const nextStock = Number(input.stock ?? previousStock);
  return {
    id: input.id || existing.id || `custom-${slug(name)}-${Date.now().toString().slice(-4)}`,
    name,
    category: String(input.category || existing.category || "Nuts").trim(),
    tag: String(input.tag || existing.tag || "New").trim(),
    description: String(input.description || existing.description || "").trim(),
    price,
    mrp,
    pack: String(input.pack || existing.pack || "250 g").trim(),
    rating: Number(input.rating || existing.rating || 4.5),
    benefits: Array.isArray(input.benefits)
      ? input.benefits
      : String(input.benefits || existing.benefits || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
    colors: Array.isArray(input.colors) ? input.colors : existing.colors || ["#f4e8d8", "#246b45", "#d69b33"],
    image: String(input.image || existing.image || "").trim(),
    stock: Number.isFinite(nextStock) ? nextStock : previousStock,
    previousStock,
    active: input.active ?? existing.active ?? true,
    createdAt: existing.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function calculateOrder(db, body) {
  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length) throw new Error("Order must contain at least one item");
  const orderItems = items.map((item) => {
    const product = db.products.find((entry) => entry.id === item.productId && entry.active);
    if (!product) throw new Error(`Product not found: ${item.productId}`);
    const qty = Math.max(1, Number(item.qty || 1));
    if (Number(product.stock || 0) < qty) throw new Error(`${product.name} has only ${product.stock || 0} in stock`);
    const price = Number(item.price || product.price);
    return {
      id: crypto.randomUUID(),
      productId: product.id,
      name: product.name,
      pack: String(item.pack || product.pack),
      qty,
      price,
      mrp: Number(item.mrp || product.mrp),
      lineTotal: price * qty,
    };
  });
  const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const couponDiscount = body.couponCode === db.settings.couponCode ? Math.round(subtotal * 0.1) : 0;
  const delivery = subtotal >= db.settings.freeDeliveryThreshold ? 0 : 49;
  const total = subtotal - couponDiscount + delivery;
  return { orderItems, subtotal, couponDiscount, delivery, total };
}

function deductInventoryForOrder(db, order) {
  order.items.forEach((item) => {
    const product = db.products.find((entry) => entry.id === item.productId);
    if (!product) return;
    const before = Number(product.stock || 0);
    product.stock = Math.max(0, before - item.qty);
    product.updatedAt = new Date().toISOString();
    recordInventoryMovement(db, {
      productId: product.id,
      productName: product.name,
      type: "order_reserved",
      quantity: -item.qty,
      before,
      after: product.stock,
      orderId: order.id,
      note: "Stock reduced after order placement",
    });
  });
}

function restockInventoryForOrder(db, order) {
  if (order.inventoryRestoredAt) return;
  order.items.forEach((item) => {
    const product = db.products.find((entry) => entry.id === item.productId);
    if (!product) return;
    const before = Number(product.stock || 0);
    product.stock = before + item.qty;
    product.updatedAt = new Date().toISOString();
    recordInventoryMovement(db, {
      productId: product.id,
      productName: product.name,
      type: "order_restocked",
      quantity: item.qty,
      before,
      after: product.stock,
      orderId: order.id,
      note: "Stock restored after cancellation/refund",
    });
  });
  order.inventoryRestoredAt = new Date().toISOString();
}

function updatePaymentForOrder(db, order, status, provider = "manual-or-gateway") {
  const payment = db.payments.find((entry) => entry.orderId === order.id);
  if (!payment) throw new Error("Payment record not found");
  const allowed = ["payment_pending", "paid", "failed", "refunded", "cod_pending"];
  if (!allowed.includes(status)) throw new Error("Invalid payment status");
  payment.status = status;
  payment.provider = provider || payment.provider;
  payment.gatewayOrderId ||= `seedora_order_${order.id}`;
  payment.gatewayPaymentId =
    status === "paid" ? payment.gatewayPaymentId || `seedora_pay_${Date.now().toString().slice(-8)}` : payment.gatewayPaymentId || "";
  payment.updatedAt = new Date().toISOString();
  order.paymentStatus = status;
  order.updatedAt = new Date().toISOString();
  if (status === "refunded") {
    order.status = "refunded";
    restockInventoryForOrder(db, order);
  }
  return payment;
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  return [headers.join(","), ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))].join("\n");
}

function orderRows(db) {
  return db.orders.map((order) => {
    const customer = db.customers.find((entry) => entry.id === order.customerId) || {};
    return {
      order_id: order.id,
      status: order.status,
      customer_name: customer.name || "",
      mobile: customer.mobile || "",
      email: customer.email || "",
      total: order.total,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      gateway_payment_id: db.payments.find((payment) => payment.orderId === order.id)?.gatewayPaymentId || "",
      items: order.items.map((item) => `${item.name} x${item.qty}`).join("; "),
      created_at: order.createdAt,
    };
  });
}

async function handleApi(req, res, url) {
  const db = readDb();

  if (req.method === "GET" && url.pathname === "/api/health") {
    json(res, 200, { ok: true, app: "Seedora", time: new Date().toISOString() });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/settings") {
    json(res, 200, db.settings);
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/products") {
    const products = db.products.filter((product) => product.active).map(publicProduct);
    json(res, 200, { products, categories: db.categories.filter((category) => category.active) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/products") {
    if (!requireAdmin(req, res)) return;
    const body = await readBody(req);
    const product = cleanProduct(body);
    db.products.push(product);
    upsertCategory(db, product.category);
    audit(db, "product.created", { productId: product.id, name: product.name });
    writeDb(db);
    json(res, 201, { product: publicProduct(product) });
    return;
  }

  if ((req.method === "PUT" || req.method === "DELETE") && url.pathname.startsWith("/api/products/")) {
    if (!requireAdmin(req, res)) return;
    const id = decodeURIComponent(url.pathname.split("/").pop());
    const index = db.products.findIndex((product) => product.id === id);
    if (index === -1) {
      json(res, 404, { error: "Product not found" });
      return;
    }
    if (req.method === "DELETE") {
      db.products[index].active = false;
      db.products[index].updatedAt = new Date().toISOString();
      audit(db, "product.deleted", { productId: id });
      writeDb(db);
      json(res, 200, { ok: true });
      return;
    }
    const body = await readBody(req);
    const previous = db.products[index];
    const next = cleanProduct({ ...body, id }, previous);
    db.products[index] = next;
    upsertCategory(db, db.products[index].category);
    if (Number(previous.stock || 0) !== Number(next.stock || 0)) {
      recordInventoryMovement(db, {
        productId: next.id,
        productName: next.name,
        type: "manual_adjustment",
        quantity: Number(next.stock || 0) - Number(previous.stock || 0),
        before: Number(previous.stock || 0),
        after: Number(next.stock || 0),
        orderId: "",
        note: "Admin stock update",
      });
    }
    audit(db, "product.updated", { productId: id });
    writeDb(db);
    json(res, 200, { product: publicProduct(db.products[index]) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/request-otp") {
    const body = await readBody(req);
    const mobile = String(body.mobile || "").trim();
    const email = String(body.email || "").trim();
    if (!/^\d{10}$/.test(mobile)) {
      json(res, 400, { error: "Valid 10-digit mobile number is required" });
      return;
    }
    const otp = String(crypto.randomInt(100000, 999999));
    const record = {
      id: crypto.randomUUID(),
      mobile,
      email,
      otpHash: hash(otp),
      expiresAt: new Date(Date.now() + otpTtlMs).toISOString(),
      verifiedAt: null,
      createdAt: new Date().toISOString(),
    };
    db.otpVerifications.push(record);
    notify(db, "sms", mobile, "otp", { otp: process.env.NODE_ENV === "production" ? undefined : otp });
    if (email) notify(db, "email", email, "otp", {});
    audit(db, "otp.requested", { mobile });
    writeDb(db);
    json(res, 200, { ok: true, message: "OTP queued", devOtp: process.env.NODE_ENV === "production" ? undefined : otp });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/verify-otp") {
    const body = await readBody(req);
    const mobile = String(body.mobile || "").trim();
    const otp = String(body.otp || "").trim();
    const record = [...db.otpVerifications]
      .reverse()
      .find((entry) => entry.mobile === mobile && !entry.verifiedAt && new Date(entry.expiresAt).getTime() > Date.now());
    if (!record || !verifyHash(otp, record.otpHash)) {
      json(res, 401, { error: "Invalid or expired OTP" });
      return;
    }
    record.verifiedAt = new Date().toISOString();
    let customer = db.customers.find((entry) => entry.mobile === mobile);
    if (!customer) {
      customer = {
        id: crypto.randomUUID(),
        mobile,
        email: String(body.email || "").trim(),
        name: String(body.name || "").trim(),
        consent: Boolean(body.consent),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.customers.push(customer);
    }
    const token = crypto.randomBytes(24).toString("hex");
    customer.sessionTokenHash = hash(token);
    customer.sessionExpiresAt = new Date(Date.now() + sessionTtlMs).toISOString();
    customer.updatedAt = new Date().toISOString();
    audit(db, "customer.login", { customerId: customer.id });
    writeDb(db);
    json(res, 200, { token, customer: { id: customer.id, name: customer.name, mobile: customer.mobile, email: customer.email } });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/orders") {
    const body = await readBody(req);
    const customerInput = body.customer || {};
    if (!/^\d{10}$/.test(String(customerInput.mobile || ""))) throw new Error("Valid customer mobile is required");
    const totals = calculateOrder(db, body);
    let customer = db.customers.find((entry) => entry.mobile === String(customerInput.mobile));
    if (!customer) {
      customer = {
        id: crypto.randomUUID(),
        name: String(customerInput.name || ""),
        mobile: String(customerInput.mobile),
        email: String(customerInput.email || ""),
        consent: Boolean(customerInput.consent),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.customers.push(customer);
    }
    const address = {
      id: crypto.randomUUID(),
      customerId: customer.id,
      area: String(body.address?.area || ""),
      address: String(body.address?.address || ""),
      pincode: String(body.address?.pincode || ""),
      createdAt: new Date().toISOString(),
    };
    db.addresses.push(address);
    const order = {
      id: `SDR${Date.now().toString().slice(-8)}`,
      customerId: customer.id,
      addressId: address.id,
      status: "placed",
      items: totals.orderItems,
      subtotal: totals.subtotal,
      couponCode: body.couponCode || "",
      couponDiscount: totals.couponDiscount,
      delivery: totals.delivery,
      total: totals.total,
      paymentMethod: String(body.paymentMethod || db.settings.defaultPaymentMethod),
      paymentStatus: body.paymentMethod === "Cash on delivery" ? "cod_pending" : "payment_pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.orders.push(order);
    deductInventoryForOrder(db, order);
    db.payments.push({
      id: crypto.randomUUID(),
      orderId: order.id,
      provider: "manual-or-gateway",
      method: order.paymentMethod,
      amount: order.total,
      status: order.paymentStatus,
      createdAt: new Date().toISOString(),
    });
    notify(db, "sms", customer.mobile, "order_placed", { orderId: order.id, total: order.total });
    if (customer.email) notify(db, "email", customer.email, "order_placed", { orderId: order.id });
    audit(db, "order.created", { orderId: order.id, customerId: customer.id });
    writeDb(db);
    json(res, 201, { order });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/admin/orders") {
    if (!requireAdmin(req, res)) return;
    json(res, 200, { orders: db.orders, customers: db.customers, addresses: db.addresses, payments: db.payments });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/admin/summary") {
    if (!requireAdmin(req, res)) return;
    const totalRevenue = db.orders
      .filter((order) => !["cancelled", "refunded"].includes(order.status))
      .reduce((sum, order) => sum + Number(order.total || 0), 0);
    const statusCounts = db.orders.reduce((counts, order) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
      return counts;
    }, {});
    const lowStock = db.products
      .filter((product) => product.active && Number(product.stock || 0) <= 10)
      .map((product) => ({ id: product.id, name: product.name, stock: product.stock }));
    json(res, 200, {
      totalRevenue,
      orderCount: db.orders.length,
      customerCount: db.customers.length,
      productCount: db.products.filter((product) => product.active).length,
      statusCounts,
      lowStock,
      inventoryMovementCount: (db.inventoryMovements || []).length,
      recentInventoryMovements: (db.inventoryMovements || []).slice(-8).reverse(),
      recentOrders: db.orders.slice(-5).reverse(),
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/admin/inventory") {
    if (!requireAdmin(req, res)) return;
    ensureCollections(db);
    json(res, 200, {
      lowStock: db.products
        .filter((product) => product.active && Number(product.stock || 0) <= 10)
        .map((product) => ({ id: product.id, name: product.name, category: product.category, stock: product.stock })),
      movements: db.inventoryMovements.slice(-100).reverse(),
    });
    return;
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/admin/export/")) {
    if (!requireAdmin(req, res)) return;
    const type = url.pathname.split("/").pop();
    const rows =
      type === "orders"
        ? orderRows(db)
        : type === "customers"
          ? db.customers.map((customer) => ({
              id: customer.id,
              name: customer.name,
              mobile: customer.mobile,
              email: customer.email,
              consent: customer.consent,
              created_at: customer.createdAt,
            }))
          : type === "products"
            ? db.products
                .filter((product) => product.active)
                .map((product) => ({
                  id: product.id,
                  name: product.name,
                  category: product.category,
                  price: product.price,
                  mrp: product.mrp,
                  pack: product.pack,
                  stock: product.stock,
                }))
            : null;
    if (!rows) {
      json(res, 404, { error: "Export not found" });
      return;
    }
    res.writeHead(200, {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="seedora-${type}.csv"`,
    });
    res.end(toCsv(rows));
    return;
  }

  if (req.method === "PUT" && url.pathname.startsWith("/api/admin/orders/")) {
    if (!requireAdmin(req, res)) return;
    const parts = url.pathname.split("/");
    const orderId = decodeURIComponent(parts[4] || "");
    const body = await readBody(req);
    const order = db.orders.find((entry) => entry.id === orderId);
    if (!order) {
      json(res, 404, { error: "Order not found" });
      return;
    }
    const allowed = ["placed", "packed", "shipped", "delivered", "cancelled", "refunded"];
    if (!allowed.includes(body.status)) {
      json(res, 400, { error: "Invalid order status" });
      return;
    }
    const previousStatus = order.status;
    order.status = body.status;
    order.updatedAt = new Date().toISOString();
    if (!["cancelled", "refunded"].includes(previousStatus) && ["cancelled", "refunded"].includes(order.status)) {
      restockInventoryForOrder(db, order);
    }
    notify(db, "sms", db.customers.find((customer) => customer.id === order.customerId)?.mobile || "", "order_status", {
      orderId: order.id,
      status: order.status,
    });
    audit(db, "order.status_updated", { orderId: order.id, status: order.status });
    writeDb(db);
    json(res, 200, { order });
    return;
  }

  if (req.method === "PUT" && url.pathname.startsWith("/api/admin/payments/")) {
    if (!requireAdmin(req, res)) return;
    const orderId = decodeURIComponent(url.pathname.split("/").pop());
    const body = await readBody(req);
    const order = db.orders.find((entry) => entry.id === orderId);
    if (!order) {
      json(res, 404, { error: "Order not found" });
      return;
    }
    const payment = updatePaymentForOrder(db, order, body.status, body.provider || "manual-simulation");
    notify(db, "sms", db.customers.find((customer) => customer.id === order.customerId)?.mobile || "", "payment_status", {
      orderId: order.id,
      paymentStatus: order.paymentStatus,
    });
    audit(db, "payment.status_updated", { orderId: order.id, paymentStatus: order.paymentStatus });
    writeDb(db);
    json(res, 200, { order, payment });
    return;
  }

  json(res, 404, { error: "API route not found" });
}

function serveStatic(req, res, url) {
  const filePath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const resolved = path.resolve(root, `.${filePath}`);
  if (!resolved.startsWith(root)) {
    send(res, 403, "Forbidden");
    return;
  }
  fs.readFile(resolved, (error, content) => {
    if (error) {
      send(res, 404, "Not found");
      return;
    }
    res.writeHead(200, { "content-type": mimeTypes[path.extname(resolved)] || "application/octet-stream" });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }
    serveStatic(req, res, url);
  } catch (error) {
    json(res, 400, { error: error.message || "Request failed" });
  }
});

server.listen(port, host, () => {
  console.log(`Seedora backend running at http://${host}:${port}`);
});
