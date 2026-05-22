const form = document.querySelector("#productForm");
const list = document.querySelector("#adminProductList");
const note = document.querySelector("#adminNote");
const resetForm = document.querySelector("#resetForm");
const exportProducts = document.querySelector("#exportProducts");

function products() {
  return JSON.parse(localStorage.getItem("seedoraCustomProducts") || "[]");
}

function saveProducts(items) {
  localStorage.setItem("seedoraCustomProducts", JSON.stringify(items));
}

function slug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function render() {
  const items = products();
  if (!items.length) {
    list.innerHTML = `<div class="empty-results"><strong>No custom products yet.</strong><span>Add your first product using the form.</span></div>`;
    return;
  }

  list.innerHTML = items
    .map(
      (item) => `
      <article class="admin-product">
        <div>
          <strong>${item.name}</strong>
          <span>${item.category} · ${item.pack} · Rs. ${Number(item.price).toLocaleString("en-IN")}</span>
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

form.addEventListener("submit", (event) => {
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
    benefits: data
      .get("benefits")
      .toString()
      .split(",")
      .map((benefit) => benefit.trim())
      .filter(Boolean),
    colors: ["#f4e8d8", "#246b45", "#d69b33"],
  };
  const next = products().filter((product) => product.id !== item.id);
  next.push(item);
  saveProducts(next);
  form.reset();
  note.textContent = "Product saved. Open the shop to see it in Seedora.";
  render();
});

list.addEventListener("click", (event) => {
  const edit = event.target.closest("[data-edit]");
  const remove = event.target.closest("[data-delete]");
  if (edit) {
    const item = products().find((product) => product.id === edit.dataset.edit);
    if (item) fillForm(item);
  }
  if (remove) {
    saveProducts(products().filter((product) => product.id !== remove.dataset.delete));
    note.textContent = "Product deleted.";
    render();
  }
});

resetForm.addEventListener("click", () => {
  form.reset();
  form.elements.id.value = "";
  note.textContent = "";
});

exportProducts.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(products(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "seedora-products.json";
  link.click();
  URL.revokeObjectURL(url);
});

render();
