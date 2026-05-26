let product = null;
let selectedVariant = "";

const productPageDetails = document.querySelector("#productPageDetails");
const productPageNote = document.querySelector("#productPageNote");
const cartCount = document.querySelector("#cartCount");

function currency(value) {
  return `Rs. ${value.toLocaleString("en-IN")}`;
}

function productDiscount(item) {
  return Math.max(0, Math.round(((item.mrp - item.price) / item.mrp) * 100));
}

function variantOptions(item) {
  if (item.category === "Gifts") return [item.pack];
  if (item.category === "Spices") return ["100 g", "200 g", "500 g", "1 kg"];
  if (item.category === "Laddus") return ["250 g", "500 g", "1 kg"];
  if (item.category === "Mixes") return ["180 g", "250 g", "500 g"];
  return ["200 g", "250 g", "500 g", "1 kg"];
}

function variantMultiplier(pack, item) {
  const base = Number.parseInt(item.pack, 10) || 1;
  const size = Number.parseInt(pack, 10) || base;
  if (pack.includes("kg")) return 4;
  if (item.pack.includes("box") || item.pack.includes("hamper")) return 1;
  return Math.max(0.6, size / base);
}

function variantPrice(item, pack) {
  return Math.round(item.price * variantMultiplier(pack, item));
}

function variantMrp(item, pack) {
  return Math.round(item.mrp * variantMultiplier(pack, item));
}

function cartEntries() {
  try {
    return new Map(JSON.parse(localStorage.getItem("seedoraCart") || "[]"));
  } catch {
    return new Map();
  }
}

function wishlistEntries() {
  try {
    return new Set(JSON.parse(localStorage.getItem("seedoraWishlist") || "[]"));
  } catch {
    return new Set();
  }
}

function updateCartCount() {
  const count = [...cartEntries().values()].reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = count;
}

function cartItemForSelectedProduct(existing) {
  return {
    ...product,
    key: `${product.id}-${selectedVariant}`,
    pack: selectedVariant,
    price: variantPrice(product, selectedVariant),
    mrp: variantMrp(product, selectedVariant),
    qty: existing ? existing.qty + 1 : 1,
  };
}

function productImageMarkup(item) {
  return `
    <div class="product-art page uploaded-photo" role="img" aria-label="${item.name} product image">
      <img src="${item.image}" alt="${item.name}" />
      <span class="product-photo-label">${item.name}</span>
    </div>
  `;
}

function setVisualStyle(element, item) {
  element.style.setProperty("--visual-bg", `linear-gradient(135deg, ${item.colors[0]}, #ffffff)`);
  element.style.setProperty("--visual-dot", item.colors[1]);
  element.style.setProperty("--visual-accent", item.colors[2]);
}

function renderProduct() {
  const options = variantOptions(product);
  const wishlist = wishlistEntries();
  productPageDetails.innerHTML = `
    <article class="product-detail-page">
      <div class="product-page-gallery product-visual">
        ${productImageMarkup(product)}
      </div>
      <div class="product-page-copy">
        <p class="eyebrow">${product.category} · ${product.tag}</p>
        <h1>${product.name}</h1>
        <p>${product.description}</p>
        <div class="price-row product-page-price" id="productPagePrice">
          <strong>${currency(variantPrice(product, selectedVariant))}</strong>
          <s>${currency(variantMrp(product, selectedVariant))}</s>
          <span>${productDiscount(product)}% off</span>
        </div>
        <div class="stock-row detail-stock">
          <span>In stock</span>
          <span>${product.rating.toFixed(1)} star · Fresh dispatch in 24 hours</span>
        </div>
        <ul class="detail-list">
          ${product.benefits.map((benefit) => `<li>${benefit}</li>`).join("")}
        </ul>
        <div class="variant-row" aria-label="Pack sizes">
          ${options
            .map(
              (size) => `
              <button class="${size === selectedVariant ? "active" : ""}" type="button" data-page-variant="${size}">
                ${size}
              </button>
            `,
            )
            .join("")}
        </div>
        <div class="product-page-actions">
          <button class="primary-action" type="button" data-page-buy>Buy now · ${currency(variantPrice(product, selectedVariant))}</button>
          <button class="secondary-action" type="button" data-page-add>Add to bag</button>
          <button class="secondary-action" type="button" data-page-wish>
            ${wishlist.has(product.id) ? "Saved to wishlist" : "Save to wishlist"}
          </button>
        </div>
      </div>
    </article>
  `;
  setVisualStyle(productPageDetails.querySelector(".product-page-gallery"), product);
}

async function loadProduct() {
  const productId = new URLSearchParams(window.location.search).get("product");
  const response = await fetch("/api/products");
  const catalog = await response.json();
  product = catalog.products.find((item) => item.id === productId) || catalog.products[0];
  selectedVariant = product.pack;
  document.title = `${product.name} | Seedora`;
  renderProduct();
  updateCartCount();
}

function addSelectedProductToCart() {
  const cart = cartEntries();
  const key = `${product.id}-${selectedVariant}`;
  const existing = cart.get(key);
  const item = cartItemForSelectedProduct(existing);
  cart.set(key, item);
  localStorage.setItem("seedoraCart", JSON.stringify([...cart.entries()]));
  sessionStorage.setItem("seedoraCartIntent", JSON.stringify({ key, item, createdAt: Date.now() }));
  updateCartCount();
  return cartEntries().has(key);
}

productPageDetails.addEventListener("click", (event) => {
  const variantButton = event.target.closest("[data-page-variant]");
  const addButton = event.target.closest("[data-page-add]");
  const buyButton = event.target.closest("[data-page-buy]");
  const wishButton = event.target.closest("[data-page-wish]");

  if (variantButton) {
    selectedVariant = variantButton.dataset.pageVariant;
    renderProduct();
  }

  if (addButton) {
    const added = addSelectedProductToCart();
    productPageNote.textContent = added ? `${product.name} added to your bag.` : "Could not add item. Please try again.";
  }

  if (buyButton) {
    buyButton.disabled = true;
    const added = addSelectedProductToCart();
    if (!added) {
      buyButton.disabled = false;
      productPageNote.textContent = "Could not add item. Please try again.";
      return;
    }
    productPageNote.textContent = "Added to bag. Opening checkout...";
    window.setTimeout(() => {
      window.location.assign("/#cart");
    }, 120);
  }

  if (wishButton) {
    const wishlist = wishlistEntries();
    if (wishlist.has(product.id)) {
      wishlist.delete(product.id);
      productPageNote.textContent = "Removed from wishlist.";
    } else {
      wishlist.add(product.id);
      productPageNote.textContent = "Saved to wishlist.";
    }
    localStorage.setItem("seedoraWishlist", JSON.stringify([...wishlist]));
    renderProduct();
  }
});

loadProduct().catch(() => {
  productPageDetails.innerHTML = `
    <div class="empty-results">
      <strong>Product could not load.</strong>
      <span>Please go back to products and try again.</span>
    </div>
  `;
});
