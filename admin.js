const form = document.querySelector("#productForm");
const list = document.querySelector("#adminProductList");
const note = document.querySelector("#adminNote");
const resetForm = document.querySelector("#resetForm");
const exportProducts = document.querySelector("#exportProducts");

let productCache = [];

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
          <button type="button" data-edit="${item.id}">Edit</button>
          <button type="button" data-delete="${item.id}">Delete</button>
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

async function initAdmin() {
  await loadProducts();
  render();
}

initAdmin();
