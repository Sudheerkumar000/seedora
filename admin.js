const form = document.querySelector("#productForm");
const list = document.querySelector("#adminProductList");
const note = document.querySelector("#adminNote");
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

let productCache = [];
let orderCache = [];
let customerCache = [];
let summaryCache = {};

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

function adminPin() {
  return form.elements.adminPin.value.trim();
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
  if (!adminPin()) {
    orderList.innerHTML = `<div class="empty-results"><strong>Enter admin PIN.</strong><span>Orders are protected.</span></div>`;
    return;
  }
  try {
    const response = await fetch("/api/admin/orders", {
      headers: { "x-admin-pin": adminPin() },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not load orders");
    orderCache = data.orders;
    customerCache = data.customers;
  } catch (error) {
    orderList.innerHTML = `<div class="empty-results"><strong>${error.message}</strong><span>Check the admin PIN and backend server.</span></div>`;
  }
}

async function loadSummary() {
  if (!adminPin()) return;
  try {
    const response = await fetch("/api/admin/summary", {
      headers: { "x-admin-pin": adminPin() },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not load summary");
    summaryCache = data;
  } catch {
    summaryCache = {};
  }
}

async function saveProduct(item) {
  const method = productCache.some((product) => product.id === item.id) ? "PUT" : "POST";
  const url = method === "PUT" ? `/api/products/${encodeURIComponent(item.id)}` : "/api/products";
  const response = await fetch(url, {
    method,
    headers: {
      "content-type": "application/json",
      "x-admin-pin": adminPin(),
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Save failed" }));
    throw new Error(error.error || "Save failed");
  }
}

async function deleteProduct(id) {
  const response = await fetch(`/api/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { "x-admin-pin": adminPin() },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Delete failed" }));
    throw new Error(error.error || "Delete failed");
  }
}

async function updateOrderStatus(id, status) {
  const response = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      "x-admin-pin": adminPin(),
    },
    body: JSON.stringify({ status }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Could not update order");
}

async function updateProductStock(id, stock) {
  const product = productCache.find((item) => item.id === id);
  if (!product) return;
  await saveProduct({ ...product, stock: Number(stock) });
}

function downloadFromBackend(type) {
  if (!adminPin()) {
    note.textContent = "Enter admin PIN before export.";
    return;
  }
  window.location.href = `/api/admin/export/${type}?pin=${encodeURIComponent(adminPin())}`;
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
            <span>${order.items.map((item) => `${item.name} x${item.qty}`).join(", ")}</span>
          </div>
          <div class="admin-product-actions">
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

function fillForm(item) {
  Object.entries(item).forEach(([key, value]) => {
    if (form.elements[key]) {
      form.elements[key].value = Array.isArray(value) ? value.join(", ") : value;
    }
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get("name").toString().trim();
  const item = {
    id: data.get("id").toString() || `custom-${slug(name)}-${Date.now().toString().slice(-4)}`,
    name,
    category: data.get("category").toString(),
    price: Number(data.get("price")),
    mrp: Number(data.get("mrp")),
    pack: data.get("pack").toString().trim(),
    tag: data.get("tag").toString().trim(),
    description: data.get("description").toString().trim(),
    image: data.get("image").toString().trim(),
    rating: 4.5,
    stock: 100,
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
    const pin = adminPin();
    form.reset();
    form.elements.adminPin.value = pin;
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

list.addEventListener("change", async (event) => {
  const input = event.target.closest("[data-stock]");
  if (!input) return;
  try {
    await updateProductStock(input.dataset.stock, input.value);
    note.textContent = "Stock updated.";
    await loadProducts();
    await loadSummary();
    render();
    renderSummary();
  } catch (error) {
    note.textContent = error.message;
  }
});

orderList.addEventListener("change", async (event) => {
  const select = event.target.closest("[data-order-status]");
  if (!select) return;
  try {
    await updateOrderStatus(select.dataset.orderStatus, select.value);
      note.textContent = "Order status updated.";
      await loadOrders();
      await loadSummary();
      renderOrders();
      renderSummary();
    } catch (error) {
    note.textContent = error.message;
  }
});

resetForm.addEventListener("click", () => {
  const pin = adminPin();
  form.reset();
  form.elements.id.value = "";
  form.elements.adminPin.value = pin;
  note.textContent = "";
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

refreshOrders.addEventListener("click", async () => {
  await loadOrders();
  await loadSummary();
  renderOrders();
  renderCustomers();
  renderSummary();
});

async function initAdmin() {
  await loadProducts();
  await loadOrders();
  await loadSummary();
  render();
  renderOrders();
  renderCustomers();
  renderSummary();
}

initAdmin();
