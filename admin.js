const form = document.querySelector("#productForm");
const list = document.querySelector("#adminProductList");
const note = document.querySelector("#adminNote");
const loginPanel = document.querySelector("#adminLoginPanel");
const loginForm = document.querySelector("#adminLoginForm");
const loginNote = document.querySelector("#adminLoginNote");
const logoutButton = document.querySelector("#adminLogout");
const adminSummary = document.querySelector("#adminSummary");
const adminLayout = document.querySelector(".admin-layout");
const backupPanel = document.querySelector("#backupPanel");
const downloadBackup = document.querySelector("#downloadBackup");
const backupFile = document.querySelector("#backupFile");
const restoreConfirm = document.querySelector("#restoreConfirm");
const restoreBackup = document.querySelector("#restoreBackup");
const backupNote = document.querySelector("#backupNote");
const resetForm = document.querySelector("#resetForm");
const exportProducts = document.querySelector("#exportProducts");
const exportProductsCsv = document.querySelector("#exportProductsCsv");
const orderList = document.querySelector("#adminOrderList");
const refreshOrders = document.querySelector("#refreshOrders");
const exportOrdersCsv = document.querySelector("#exportOrdersCsv");
const customerList = document.querySelector("#adminCustomerList");
const exportCustomersCsv = document.querySelector("#exportCustomersCsv");
const summaryRevenue = document.querySelector("#summaryRevenue");
const summaryOrders = document.querySelector("#summaryOrders");
const summaryCustomers = document.querySelector("#summaryCustomers");
const summaryProducts = document.querySelector("#summaryProducts");
const orderDetailPanel = document.querySelector("#orderDetailPanel");
const orderDetailTitle = document.querySelector("#orderDetailTitle");
const orderDetailContent = document.querySelector("#orderDetailContent");
const printInvoice = document.querySelector("#printInvoice");
const closeOrderDetail = document.querySelector("#closeOrderDetail");
const inventoryAlerts = document.querySelector("#inventoryAlerts");
const inventoryMovements = document.querySelector("#inventoryMovements");
const refreshInventory = document.querySelector("#refreshInventory");
const productImageUpload = document.querySelector("#productImageUpload");
const productImagePreview = document.querySelector("#productImagePreview");

let productCache = [];
let orderCache = [];
let customerCache = [];
let addressCache = [];
let paymentCache = [];
let summaryCache = {};
let inventoryCache = { lowStock: [], movements: [] };
let adminSession = JSON.parse(localStorage.getItem("seedoraAdminSession") || "null");

function currency(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
}

function slug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function adminToken() {
  return adminSession?.token || "";
}

function hasAdminSession() {
  return Boolean(adminSession?.token && new Date(adminSession.expiresAt).getTime() > Date.now());
}

function setAdminSession(session) {
  adminSession = session;
  if (session) {
    localStorage.setItem("seedoraAdminSession", JSON.stringify(session));
  } else {
    localStorage.removeItem("seedoraAdminSession");
  }
  renderAdminAccess();
}

function adminHeaders(extra = {}) {
  return { ...extra, "x-admin-token": adminToken() };
}

function renderAdminAccess() {
  const unlocked = hasAdminSession();
  loginPanel.hidden = unlocked;
  logoutButton.hidden = !unlocked;
  adminSummary.hidden = !unlocked;
  backupPanel.hidden = !unlocked;
  adminLayout.hidden = !unlocked;
  orderDetailPanel.hidden = true;
  if (!unlocked) {
    summaryCache = {};
    orderCache = [];
    customerCache = [];
    addressCache = [];
    paymentCache = [];
    inventoryCache = { lowStock: [], movements: [] };
  }
  updateRestoreButton();
}

async function loadProducts() {
  try {
    const response = await fetch("/api/products");
    const data = await response.json();
    productCache = data.products;
  } catch {
    productCache = JSON.parse(localStorage.getItem("seedoraCustomProducts") || "[]");
  }
}

async function loadOrders() {
  if (!hasAdminSession()) {
    orderList.innerHTML = `<div class="empty-results"><strong>Unlock admin.</strong><span>Orders are protected.</span></div>`;
    return;
  }
  try {
    const response = await fetch("/api/admin/orders", {
      headers: adminHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not load orders");
    orderCache = data.orders;
    customerCache = data.customers;
    addressCache = data.addresses || [];
    paymentCache = data.payments || [];
  } catch (error) {
    orderList.innerHTML = `<div class="empty-results"><strong>${error.message}</strong><span>Unlock again and try once more.</span></div>`;
  }
}

async function loadSummary() {
  if (!hasAdminSession()) return;
  try {
    const response = await fetch("/api/admin/summary", {
      headers: adminHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not load summary");
    summaryCache = data;
  } catch {
    summaryCache = {};
  }
}

async function loadInventory() {
  if (!hasAdminSession()) {
    inventoryAlerts.innerHTML = `<div class="empty-results"><strong>Unlock admin.</strong><span>Inventory is protected.</span></div>`;
    inventoryMovements.innerHTML = "";
    return;
  }
  try {
    const response = await fetch("/api/admin/inventory", {
      headers: adminHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not load inventory");
    inventoryCache = data;
  } catch (error) {
    inventoryAlerts.innerHTML = `<div class="empty-results"><strong>${error.message}</strong><span>Unlock again and try once more.</span></div>`;
    inventoryMovements.innerHTML = "";
  }
}

async function saveProduct(item) {
  const method = productCache.some((product) => product.id === item.id) ? "PUT" : "POST";
  const url = method === "PUT" ? `/api/products/${encodeURIComponent(item.id)}` : "/api/products";
  const response = await fetch(url, {
    method,
    headers: adminHeaders({ "content-type": "application/json" }),
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Save failed" }));
    throw new Error(error.error || "Save failed");
  }
}

function readImageUpload() {
  const file = productImageUpload.files[0];
  if (!file) return Promise.resolve(null);
  if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) {
    return Promise.reject(new Error("Upload a PNG, JPG, JPEG, or WEBP image."));
  }
  if (file.size > 8_000_000) {
    return Promise.reject(new Error("Image must be under 8 MB."));
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve({ filename: file.name, dataUrl: reader.result }));
    reader.addEventListener("error", () => reject(new Error("Could not read product image.")));
    reader.readAsDataURL(file);
  });
}

async function uploadProductImage() {
  const upload = await readImageUpload();
  if (!upload) return "";
  note.textContent = "Uploading product photo...";
  const response = await fetch("/api/admin/upload-image", {
    method: "POST",
    headers: adminHeaders({ "content-type": "application/json" }),
    body: JSON.stringify(upload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Image upload failed");
  return data.imagePath;
}

function renderImagePreview(src, label = "Product photo preview") {
  if (!src) {
    productImagePreview.hidden = true;
    productImagePreview.innerHTML = "";
    return;
  }
  productImagePreview.hidden = false;
  productImagePreview.innerHTML = `
    <img src="${src}" alt="${label}" />
    <span>${label}</span>
  `;
}

async function deleteProduct(id) {
  const response = await fetch(`/api/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Delete failed" }));
    throw new Error(error.error || "Delete failed");
  }
}

async function updateOrderStatus(id, status) {
  const response = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: adminHeaders({ "content-type": "application/json" }),
    body: JSON.stringify({ status }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Could not update order");
}

async function updatePaymentStatus(id, status) {
  const response = await fetch(`/api/admin/payments/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: adminHeaders({ "content-type": "application/json" }),
    body: JSON.stringify({ status, provider: "manual-simulation" }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Could not update payment");
}

async function updateProductStock(id, stock) {
  const product = productCache.find((item) => item.id === id);
  if (!product) return;
  await saveProduct({ ...product, stock: Number(stock) });
}

async function downloadFromBackend(type) {
  if (!hasAdminSession()) {
    note.textContent = "Unlock admin before export.";
    return;
  }
  const response = await fetch(`/api/admin/export/${type}`, {
    headers: adminHeaders(),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Export failed" }));
    note.textContent = error.error || "Export failed";
    return;
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `seedora-${type}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

async function downloadFullBackup() {
  if (!hasAdminSession()) {
    backupNote.textContent = "Unlock admin before downloading a backup.";
    return;
  }
  backupNote.textContent = "Preparing backup...";
  const response = await fetch("/api/admin/backup", {
    headers: adminHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    backupNote.textContent = data.error || "Backup failed.";
    return;
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `seedora-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  backupNote.textContent = `Backup ready: ${data.summary.productCount} products, ${data.summary.orderCount} orders, ${data.summary.customerCount} customers.`;
}

function updateRestoreButton() {
  restoreBackup.disabled = !(hasAdminSession() && backupFile.files.length && restoreConfirm.value.trim() === "RESTORE SEEDORA DATA");
}

function readBackupFile() {
  return new Promise((resolve, reject) => {
    const file = backupFile.files[0];
    if (!file) {
      reject(new Error("Select a Seedora backup file first."));
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      try {
        resolve(JSON.parse(reader.result));
      } catch {
        reject(new Error("Selected file is not valid JSON."));
      }
    });
    reader.addEventListener("error", () => reject(new Error("Could not read the backup file.")));
    reader.readAsText(file);
  });
}

async function restoreFullBackup() {
  if (!hasAdminSession()) {
    backupNote.textContent = "Unlock admin before restoring a backup.";
    return;
  }
  if (restoreConfirm.value.trim() !== "RESTORE SEEDORA DATA") {
    backupNote.textContent = "Type RESTORE SEEDORA DATA to confirm restore.";
    return;
  }
  try {
    backupNote.textContent = "Reading backup file...";
    const backup = await readBackupFile();
    const response = await fetch("/api/admin/backup/restore", {
      method: "POST",
      headers: adminHeaders({ "content-type": "application/json" }),
      body: JSON.stringify({ backup, confirmRestore: restoreConfirm.value.trim() }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Restore failed");
    backupFile.value = "";
    restoreConfirm.value = "";
    updateRestoreButton();
    backupNote.textContent = `Restore complete: ${data.summary.productCount} products and ${data.summary.orderCount} orders.`;
    await refreshAdminData();
  } catch (error) {
    backupNote.textContent = error.message;
  }
}

function render() {
  if (!productCache.length) {
    list.innerHTML = `<div class="empty-results"><strong>No products found.</strong><span>Add your first product using the form.</span></div>`;
    return;
  }

  list.innerHTML = productCache
    .map(
      (item) => `
      <article class="admin-product">
        <div>
            <strong>${item.name}</strong>
            <span>${item.category} · ${item.pack} · Rs. ${Number(item.price).toLocaleString("en-IN")} · stock ${item.stock ?? 0}</span>
          </div>
          <div class="admin-product-actions">
            <label class="stock-edit">Stock <input type="number" min="0" value="${item.stock ?? 0}" data-stock="${item.id}" /></label>
            <button type="button" data-edit="${item.id}">Edit</button>
            <button type="button" data-delete="${item.id}">Delete</button>
          </div>
      </article>
    `,
    )
    .join("");
}

function renderSummary() {
  summaryRevenue.textContent = currency(summaryCache.totalRevenue);
  summaryOrders.textContent = Number(summaryCache.orderCount || 0).toLocaleString("en-IN");
  summaryCustomers.textContent = Number(summaryCache.customerCount || 0).toLocaleString("en-IN");
  summaryProducts.textContent = Number(summaryCache.productCount || productCache.length).toLocaleString("en-IN");
}

function renderOrders() {
  if (!orderCache.length) {
    orderList.innerHTML = `<div class="empty-results"><strong>No orders yet.</strong><span>New checkout orders will appear here.</span></div>`;
    return;
  }
  orderList.innerHTML = orderCache
    .slice()
    .reverse()
    .map((order) => {
      const customer = customerCache.find((entry) => entry.id === order.customerId) || {};
      return `
        <article class="admin-product">
          <div>
            <strong>${order.id} · ${order.status}</strong>
            <span>${customer.name || "Customer"} · ${customer.mobile || ""} · Rs. ${Number(order.total).toLocaleString("en-IN")}</span>
            <span>Payment: ${order.paymentMethod} · ${order.paymentStatus}</span>
            <span>${order.items.map((item) => `${item.name} x${item.qty}`).join(", ")}</span>
          </div>
          <div class="admin-product-actions">
            <button type="button" data-order-detail="${order.id}">Details</button>
            <select data-payment-status="${order.id}">
              ${["payment_pending", "paid", "failed", "refunded", "cod_pending"]
                .map((status) => `<option value="${status}" ${status === order.paymentStatus ? "selected" : ""}>${status}</option>`)
                .join("")}
            </select>
            <select data-order-status="${order.id}">
              ${["placed", "packed", "shipped", "delivered", "cancelled", "refunded"]
                .map((status) => `<option value="${status}" ${status === order.status ? "selected" : ""}>${status}</option>`)
                .join("")}
            </select>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderOrderDetail(orderId) {
  const order = orderCache.find((entry) => entry.id === orderId);
  if (!order) return;
  const customer = customerCache.find((entry) => entry.id === order.customerId) || {};
  const address = addressCache.find((entry) => entry.id === order.addressId) || {};
  const payment = paymentCache.find((entry) => entry.orderId === order.id) || {};
  orderDetailTitle.textContent = `Order ${order.id}`;
  orderDetailContent.innerHTML = `
    <div class="invoice-card" id="printableInvoice">
      <div class="invoice-head">
        <div>
          <strong>Seedora</strong>
          <span>Premium dry fruits, laddus, spices, and gifts</span>
          <span>Phone: +91 97045 97062</span>
        </div>
        <div>
          <strong>${order.id}</strong>
          <span>${new Date(order.createdAt).toLocaleString("en-IN")}</span>
          <span>Status: ${order.status}</span>
        </div>
      </div>
      <div class="invoice-grid">
        <section>
          <h3>Customer</h3>
          <span>${customer.name || "Customer"}</span>
          <span>${customer.mobile || ""}</span>
          <span>${customer.email || ""}</span>
        </section>
        <section>
          <h3>Delivery</h3>
          <span>${address.address || ""}</span>
          <span>${address.area || ""}</span>
          <span>Pincode: ${address.pincode || ""}</span>
        </section>
        <section>
          <h3>Payment</h3>
          <span>${order.paymentMethod}</span>
          <span>${order.paymentStatus}</span>
          <span>${payment.provider || "manual-or-gateway"}</span>
          <span>${payment.gatewayPaymentId || "No gateway payment ID yet"}</span>
        </section>
      </div>
      <table class="invoice-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Pack</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              (item) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.pack}</td>
                <td>${item.qty}</td>
                <td>${currency(item.price)}</td>
                <td>${currency(item.lineTotal)}</td>
              </tr>
            `,
            )
            .join("")}
        </tbody>
      </table>
      <div class="invoice-total">
        <span>Subtotal ${currency(order.subtotal)}</span>
        <span>Discount ${currency(order.couponDiscount)}</span>
        <span>Delivery ${order.delivery === 0 ? "Free" : currency(order.delivery)}</span>
        <strong>Total ${currency(order.total)}</strong>
      </div>
    </div>
  `;
  orderDetailPanel.hidden = false;
  orderDetailPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderCustomers() {
  if (!customerCache.length) {
    customerList.innerHTML = `<div class="empty-results"><strong>No customers yet.</strong><span>OTP logins and checkout customers will appear here.</span></div>`;
    return;
  }
  customerList.innerHTML = customerCache
    .slice()
    .reverse()
    .map(
      (customer) => `
      <article class="admin-product">
        <div>
          <strong>${customer.name || "Seedora customer"}</strong>
          <span>${customer.mobile || ""} · ${customer.email || "No email"}</span>
          <span>Joined ${new Date(customer.createdAt).toLocaleDateString("en-IN")}</span>
        </div>
      </article>
    `,
    )
    .join("");
}

function renderInventory() {
  if (!inventoryCache.lowStock?.length) {
    inventoryAlerts.innerHTML = `<div class="empty-results"><strong>No low-stock alerts.</strong><span>Products with stock 10 or below will appear here.</span></div>`;
  } else {
    inventoryAlerts.innerHTML = inventoryCache.lowStock
      .map(
        (item) => `
        <article class="admin-product low-stock-item">
          <div>
            <strong>${item.name}</strong>
            <span>${item.category} · only ${item.stock} left</span>
          </div>
          <button type="button" data-edit="${item.id}">Update stock</button>
        </article>
      `,
      )
      .join("");
  }

  if (!inventoryCache.movements?.length) {
    inventoryMovements.innerHTML = `<div class="empty-results"><strong>No stock movement yet.</strong><span>Orders and stock edits will create movement logs.</span></div>`;
    return;
  }
  inventoryMovements.innerHTML = inventoryCache.movements
    .map(
      (movement) => `
      <article class="admin-product">
        <div>
          <strong>${movement.productName}</strong>
          <span>${movement.type} · ${movement.quantity > 0 ? "+" : ""}${movement.quantity} · ${movement.before} to ${movement.after}</span>
          <span>${movement.orderId ? `Order ${movement.orderId}` : movement.note} · ${new Date(movement.createdAt).toLocaleString("en-IN")}</span>
        </div>
      </article>
    `,
    )
    .join("");
}

function fillForm(item) {
  Object.entries(item).forEach(([key, value]) => {
    if (form.elements[key]) {
      form.elements[key].value = Array.isArray(value) ? value.join(", ") : value;
    }
  });
  productImageUpload.value = "";
  renderImagePreview(item.image, item.name);
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const pin = new FormData(loginForm).get("pin").toString().trim();
  loginNote.textContent = "Unlocking admin...";
  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not unlock admin");
    setAdminSession(data);
    loginForm.reset();
    loginNote.textContent = "";
    note.textContent = "Admin unlocked.";
    await refreshAdminData();
  } catch (error) {
    loginNote.textContent = error.message;
  }
});

logoutButton.addEventListener("click", async () => {
  if (hasAdminSession()) {
    await fetch("/api/admin/logout", {
      method: "POST",
      headers: adminHeaders(),
    }).catch(() => {});
  }
  setAdminSession(null);
  note.textContent = "";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!hasAdminSession()) {
    note.textContent = "Unlock admin before saving.";
    return;
  }
  const data = new FormData(form);
  const name = data.get("name").toString().trim();
  let image = data.get("image").toString().trim();
  try {
    const uploadedImagePath = await uploadProductImage();
    if (uploadedImagePath) {
      image = uploadedImagePath;
      form.elements.image.value = uploadedImagePath;
    }
  } catch (error) {
    note.textContent = error.message;
    return;
  }
  const item = {
    id: data.get("id").toString() || `custom-${slug(name)}-${Date.now().toString().slice(-4)}`,
    name,
    category: data.get("category").toString(),
    price: Number(data.get("price")),
    mrp: Number(data.get("mrp")),
    pack: data.get("pack").toString().trim(),
    tag: data.get("tag").toString().trim(),
    description: data.get("description").toString().trim(),
    image,
    rating: 4.5,
    stock: Number(data.get("stock")),
    benefits: data
      .get("benefits")
      .toString()
      .split(",")
      .map((benefit) => benefit.trim())
      .filter(Boolean),
    colors: ["#f4e8d8", "#246b45", "#d69b33"],
  };
  try {
    await saveProduct(item);
    form.reset();
    productImageUpload.value = "";
    renderImagePreview("");
    note.textContent = "Product saved to backend.";
    await loadProducts();
    render();
  } catch (error) {
    note.textContent = error.message;
  }
});

list.addEventListener("click", async (event) => {
  const edit = event.target.closest("[data-edit]");
  const remove = event.target.closest("[data-delete]");
  if (edit) {
    const item = productCache.find((product) => product.id === edit.dataset.edit);
    if (item) fillForm(item);
  }
  if (remove) {
    try {
      await deleteProduct(remove.dataset.delete);
      note.textContent = "Product deleted from backend.";
      await loadProducts();
      render();
    } catch (error) {
      note.textContent = error.message;
    }
  }
});

inventoryAlerts.addEventListener("click", (event) => {
  const edit = event.target.closest("[data-edit]");
  if (!edit) return;
  const item = productCache.find((product) => product.id === edit.dataset.edit);
  if (item) {
    fillForm(item);
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

list.addEventListener("change", async (event) => {
  const input = event.target.closest("[data-stock]");
  if (!input) return;
  try {
    await updateProductStock(input.dataset.stock, input.value);
      note.textContent = "Stock updated.";
      await loadProducts();
      await loadSummary();
      await loadInventory();
      render();
      renderSummary();
      renderInventory();
  } catch (error) {
    note.textContent = error.message;
  }
});

orderList.addEventListener("change", async (event) => {
  const select = event.target.closest("[data-order-status]");
  const paymentSelect = event.target.closest("[data-payment-status]");
  if (!select && !paymentSelect) return;
  try {
    if (select) {
      await updateOrderStatus(select.dataset.orderStatus, select.value);
      note.textContent = "Order status updated.";
    }
    if (paymentSelect) {
      await updatePaymentStatus(paymentSelect.dataset.paymentStatus, paymentSelect.value);
      note.textContent = "Payment status updated.";
    }
    await loadOrders();
    await loadSummary();
    await loadInventory();
      renderOrders();
      renderSummary();
      renderInventory();
    } catch (error) {
    note.textContent = error.message;
  }
});

orderList.addEventListener("click", (event) => {
  const detail = event.target.closest("[data-order-detail]");
  if (!detail) return;
  renderOrderDetail(detail.dataset.orderDetail);
});

resetForm.addEventListener("click", () => {
  form.reset();
  form.elements.id.value = "";
  productImageUpload.value = "";
  renderImagePreview("");
  note.textContent = "";
});

productImageUpload.addEventListener("change", () => {
  const file = productImageUpload.files[0];
  if (!file) {
    renderImagePreview(form.elements.image.value.trim());
    return;
  }
  const previewUrl = URL.createObjectURL(file);
  renderImagePreview(previewUrl, file.name);
});

exportProducts.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(productCache, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "seedora-products.json";
  link.click();
  URL.revokeObjectURL(url);
});

exportProductsCsv.addEventListener("click", () => downloadFromBackend("products"));
exportOrdersCsv.addEventListener("click", () => downloadFromBackend("orders"));
exportCustomersCsv.addEventListener("click", () => downloadFromBackend("customers"));
downloadBackup.addEventListener("click", downloadFullBackup);
backupFile.addEventListener("change", updateRestoreButton);
restoreConfirm.addEventListener("input", updateRestoreButton);
restoreBackup.addEventListener("click", restoreFullBackup);

refreshOrders.addEventListener("click", async () => {
  await refreshAdminData();
});

refreshInventory.addEventListener("click", async () => {
  await loadInventory();
  renderInventory();
});

closeOrderDetail.addEventListener("click", () => {
  orderDetailPanel.hidden = true;
});

printInvoice.addEventListener("click", () => {
  window.print();
});

async function refreshAdminData() {
  await loadProducts();
  render();
  if (!hasAdminSession()) return;
  await loadOrders();
  await loadSummary();
  await loadInventory();
  renderOrders();
  renderCustomers();
  renderSummary();
  renderInventory();
}

async function initAdmin() {
  renderAdminAccess();
  await refreshAdminData();
}

initAdmin();
