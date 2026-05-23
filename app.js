const businessSettings = {
  phone: "+91 9704597062",
  email: "hello@seedora.in",
  deliveryRegion: "All India",
  couponCode: "SEEDORA10",
};

let products = [
  {
    id: "almond-california",
    name: "California Almonds",
    category: "Nuts",
    tag: "Bestseller",
    description: "Crunchy whole almonds for breakfast bowls and daily snacking.",
    price: 349,
    mrp: 425,
    pack: "250 g",
    rating: 4.8,
    benefits: ["Hand-sorted large kernels", "Rich in plant protein", "Resealable freshness pack"],
    colors: ["#f7e5cb", "#b87548", "#79503a"],
  },
  {
    id: "cashew-w320",
    name: "Whole Cashews W320",
    category: "Nuts",
    tag: "Premium",
    description: "Creamy cashews for sweets, curries, trail mixes, and gifting.",
    price: 429,
    mrp: 520,
    pack: "250 g",
    rating: 4.7,
    benefits: ["Uniform W320 grade", "Naturally buttery bite", "Vacuum packed"],
    colors: ["#f6eecf", "#efd28f", "#c5903c"],
  },
  {
    id: "pista-roasted",
    name: "Roasted Salted Pistachios",
    category: "Nuts",
    tag: "Roasted",
    description: "Lightly salted pistachios with a crisp roasted finish.",
    price: 399,
    mrp: 480,
    pack: "200 g",
    rating: 4.6,
    benefits: ["Slow roasted", "Balanced salt", "Party snack ready"],
    colors: ["#eef4d7", "#95ad5c", "#52683a"],
  },
  {
    id: "walnut-kernels",
    name: "Extra Light Walnuts",
    category: "Nuts",
    tag: "Fresh crop",
    description: "Clean walnut kernels for desserts, salads, and daily nutrition.",
    price: 379,
    mrp: 460,
    pack: "200 g",
    rating: 4.5,
    benefits: ["Extra light halves", "Naturally omega-rich", "No shell pieces"],
    colors: ["#efe2d0", "#9c6d44", "#5f3f2d"],
  },
  {
    id: "macadamia-nuts",
    name: "Macadamia Nuts",
    category: "Nuts",
    tag: "Luxury",
    description: "Buttery macadamias for premium snacking, baking, and hampers.",
    price: 749,
    mrp: 890,
    pack: "200 g",
    rating: 4.7,
    benefits: ["Creamy whole nuts", "Small-batch packed", "Premium gifting pick"],
    colors: ["#f3ead1", "#d2ad68", "#8b6630"],
  },
  {
    id: "turkish-apricot",
    name: "Dried Turkish Apricots",
    category: "Dried Fruits",
    tag: "Soft bite",
    description: "Naturally sweet apricots with a bright fruit-forward taste.",
    price: 299,
    mrp: 360,
    pack: "200 g",
    rating: 4.5,
    benefits: ["Soft and chewy", "Great for lunch boxes", "High fruit content"],
    colors: ["#ffe3b2", "#e19532", "#a85722"],
  },
  {
    id: "kimia-dates",
    name: "Kimia Dates",
    category: "Dried Fruits",
    tag: "No added sugar",
    description: "Soft dates for natural sweetness, smoothies, and evening cravings.",
    price: 249,
    mrp: 310,
    pack: "500 g",
    rating: 4.8,
    benefits: ["Soft premium dates", "Naturally sweet", "Family value pack"],
    colors: ["#edd2bf", "#6a3b32", "#3a1f1b"],
  },
  {
    id: "green-raisins",
    name: "Afghani Green Raisins",
    category: "Dried Fruits",
    tag: "Imported",
    description: "Long green raisins for sweets, pulao, cereal, and snacking.",
    price: 229,
    mrp: 275,
    pack: "250 g",
    rating: 4.4,
    benefits: ["Long berry size", "Naturally tangy-sweet", "Cleaned and sorted"],
    colors: ["#edf1c4", "#a3aa4f", "#686b2a"],
  },
  {
    id: "premium-figs",
    name: "Premium Dried Figs",
    category: "Dried Fruits",
    tag: "Fiber rich",
    description: "Soft anjeer with tiny crunchy seeds and deep caramel notes.",
    price: 469,
    mrp: 560,
    pack: "250 g",
    rating: 4.6,
    benefits: ["Moist, soft texture", "Breakfast friendly", "Premium grade selection"],
    colors: ["#f0d4bc", "#7b4661", "#563142"],
  },
  {
    id: "whole-cranberries",
    name: "Whole Cranberries",
    category: "Dried Fruits",
    tag: "Tangy",
    description: "Sweet-tart cranberries for cereal bowls, baking, and trail mixes.",
    price: 229,
    mrp: 280,
    pack: "200 g",
    rating: 4.4,
    benefits: ["Whole berry texture", "Bright tangy flavor", "Great for baking"],
    colors: ["#f6d7dc", "#b44853", "#682f48"],
  },
  {
    id: "pumpkin-seeds",
    name: "Pumpkin Seeds",
    category: "Seeds",
    tag: "Protein",
    description: "Green pumpkin seeds for salads, smoothies, and baking.",
    price: 199,
    mrp: 259,
    pack: "200 g",
    rating: 4.7,
    benefits: ["Raw premium seeds", "Plant protein source", "Easy reseal pouch"],
    colors: ["#dff0dc", "#5c8d50", "#315a38"],
  },
  {
    id: "chia-seeds",
    name: "Black Chia Seeds",
    category: "Seeds",
    tag: "Breakfast",
    description: "Tiny nutrient-dense seeds for puddings, water, and smoothie bowls.",
    price: 159,
    mrp: 210,
    pack: "200 g",
    rating: 4.5,
    benefits: ["Cleaned black seeds", "Good for soaked recipes", "Daily breakfast staple"],
    colors: ["#d9e2df", "#28302d", "#606b66"],
  },
  {
    id: "flax-seeds",
    name: "Premium Flax Seeds",
    category: "Seeds",
    tag: "Omega",
    description: "Nutty flax seeds for rotis, smoothies, chutneys, and breakfast jars.",
    price: 89,
    mrp: 120,
    pack: "200 g",
    rating: 4.3,
    benefits: ["Clean raw seeds", "Everyday kitchen staple", "Budget-friendly pack"],
    colors: ["#eadac5", "#9d6d43", "#684324"],
  },
  {
    id: "trail-mix",
    name: "Berry Trail Mix",
    category: "Mixes",
    tag: "Snack cup",
    description: "Almonds, cashews, raisins, cranberries, and seeds in one mix.",
    price: 279,
    mrp: 340,
    pack: "200 g",
    rating: 4.8,
    benefits: ["Sweet and nutty blend", "Travel-friendly", "No fried ingredients"],
    colors: ["#f4dfdf", "#b44853", "#5b405c"],
  },
  {
    id: "date-bites",
    name: "Dark Choco Date Bites",
    category: "Mixes",
    tag: "Dessert",
    description: "No added sugar date bites with nuts and dark cocoa.",
    price: 345,
    mrp: 400,
    pack: "180 g",
    rating: 4.9,
    benefits: ["Dessert-style snack", "Made with dates", "Individually portioned"],
    colors: ["#e8d6cb", "#4c2b28", "#a96c4b"],
  },
  {
    id: "panchmeva-mix",
    name: "Panchmeva Nut Mix",
    category: "Mixes",
    tag: "Traditional",
    description: "A festive mix of almonds, cashews, raisins, dates, and dried coconut.",
    price: 469,
    mrp: 549,
    pack: "405 g",
    rating: 4.6,
    benefits: ["Five classic ingredients", "Sweet and crunchy", "Family sharing pack"],
    colors: ["#f2e6d6", "#c18443", "#7c4b35"],
  },
  {
    id: "gift-box",
    name: "Seedora Signature Gift Box",
    category: "Gifts",
    tag: "Gift ready",
    description: "A premium assorted box with nuts, dates, figs, seeds, and trail mix.",
    price: 1199,
    mrp: 1499,
    pack: "1 box",
    rating: 4.9,
    benefits: ["Elegant gifting sleeve", "Six curated sections", "Custom message card"],
    colors: ["#e7f1e6", "#246b45", "#d69b33"],
  },
  {
    id: "wedding-hamper",
    name: "Celebration Hamper",
    category: "Gifts",
    tag: "Festive",
    description: "Large hamper with premium nuts, dried fruits, and date sweets.",
    price: 1899,
    mrp: 2299,
    pack: "1 hamper",
    rating: 4.8,
    benefits: ["Premium festive box", "Ideal for bulk gifting", "Ribbon packed"],
    colors: ["#f4e8d8", "#b47a35", "#7b2f43"],
  },
  {
    id: "classic-dry-fruit-laddu",
    name: "Classic Dry Fruit Laddu",
    category: "Laddus",
    tag: "Classic",
    description: "Traditional dry fruit laddus with nuts, dates, figs, coconut, ghee, and seeds.",
    price: 399,
    mrp: 475,
    pack: "250 g",
    rating: 4.7,
    benefits: ["Made with mixed dry fruits", "Festival and daily snack", "Rich nutty texture"],
    colors: ["#f2e2c9", "#b87548", "#6a3b32"],
  },
  {
    id: "anjeer-dry-fruit-laddu",
    name: "Anjeer Dry Fruit Laddu",
    category: "Laddus",
    tag: "Premium",
    description: "Fig-rich laddus with almonds, cashews, dates, pistachios, ghee, and cardamom.",
    price: 660,
    mrp: 745,
    pack: "250 g",
    rating: 4.8,
    benefits: ["Loaded with figs", "Premium festive sweet", "Cardamom finish"],
    colors: ["#f0d4bc", "#7b4661", "#d69b33"],
  },
  {
    id: "sugar-free-dry-fruit-laddu",
    name: "Sugar-Free Dry Fruit Laddu",
    category: "Laddus",
    tag: "No sugar",
    description: "Naturally sweet laddus made with dates, figs, raisins, nuts, and seeds.",
    price: 799,
    mrp: 899,
    pack: "500 g",
    rating: 4.7,
    benefits: ["No added sugar", "Naturally sweetened", "Energy-rich snack"],
    colors: ["#e9f2e8", "#246b45", "#6a3b32"],
  },
  {
    id: "dates-dry-fruit-laddu",
    name: "Dates Dry Fruit Laddu",
    category: "Laddus",
    tag: "Khajur",
    description: "Soft khajur laddus with crunchy nuts for natural sweetness and energy.",
    price: 349,
    mrp: 425,
    pack: "250 g",
    rating: 4.8,
    benefits: ["Date-based sweetness", "Lunchbox friendly", "No artificial colors"],
    colors: ["#ead2bf", "#6a3b32", "#c18443"],
  },
  {
    id: "choco-dates-dry-fruit-laddu",
    name: "Choco Dates Dry Fruit Laddu",
    category: "Laddus",
    tag: "Choco",
    description: "Chocolatey date laddus with nuts, cocoa notes, and no refined-sweet feel.",
    price: 699,
    mrp: 800,
    pack: "360 g",
    rating: 4.8,
    benefits: ["Chocolate-style taste", "Made with dates and nuts", "Good for sweet cravings"],
    colors: ["#e8d6cb", "#4c2b28", "#a96c4b"],
  },
  {
    id: "andhra-style-dry-fruit-laddu",
    name: "Andhra Style Dry Fruit Laddu",
    category: "Laddus",
    tag: "Homestyle",
    description: "Homemade-style laddus with dates, nuts, ghee, and a traditional South Indian touch.",
    price: 449,
    mrp: 525,
    pack: "250 g",
    rating: 4.6,
    benefits: ["Homestyle recipe", "Rich ghee aroma", "Traditional Indian taste"],
    colors: ["#f3dfbd", "#c18443", "#7c4b35"],
  },
  {
    id: "honey-dry-fruit-laddu",
    name: "Honey Dry Fruit Laddu",
    category: "Laddus",
    tag: "Honey",
    description: "Natural honey laddus with almonds, cashews, pistachios, dates, and seeds.",
    price: 379,
    mrp: 455,
    pack: "250 g",
    rating: 4.5,
    benefits: ["Honey-sweetened taste", "Nut and seed blend", "Soft chewy bite"],
    colors: ["#fff0c8", "#d69b33", "#8b6630"],
  },
  {
    id: "handmade-premium-dry-fruit-laddu",
    name: "Handmade Premium Dry Fruit Laddu",
    category: "Laddus",
    tag: "Handmade",
    description: "Premium handmade laddus with dates, cashews, apricots, figs, pista, and almonds.",
    price: 549,
    mrp: 650,
    pack: "300 g",
    rating: 4.7,
    benefits: ["Small-batch handmade", "Premium dry fruit mix", "Gift-ready quality"],
    colors: ["#f4e8d8", "#b47a35", "#7b4661"],
  },
  {
    id: "no-refined-sugar-laddoo",
    name: "No Refined Sugar Dry Fruit Laddoo",
    category: "Laddus",
    tag: "Clean sweet",
    description: "A guilt-free dry fruit laddoo for healthy Indian sweet cravings.",
    price: 258,
    mrp: 320,
    pack: "180 g",
    rating: 4.6,
    benefits: ["No refined sugar", "Quick snack pack", "Balanced dry fruit bite"],
    colors: ["#eaf4ee", "#246b45", "#d69b33"],
  },
  {
    id: "rose-dry-fruit-laddu",
    name: "Rose Dry Fruit Laddu",
    category: "Laddus",
    tag: "Rose",
    description: "Premium dry fruit laddus with edible rose petals for weddings and festive gifting.",
    price: 599,
    mrp: 720,
    pack: "250 g",
    rating: 4.8,
    benefits: ["Rose petal aroma", "Premium gifting sweet", "Festive presentation"],
    colors: ["#f8dce2", "#b44853", "#d69b33"],
  },
  {
    id: "natural-turmeric-powder",
    name: "Natural Turmeric Powder",
    category: "Spices",
    tag: "Haldi",
    description: "Pure haldi powder for everyday Indian cooking, curries, dals, vegetables, and golden milk.",
    price: 149,
    mrp: 185,
    pack: "200 g",
    rating: 4.7,
    benefits: ["Natural golden color", "No added color", "Fresh aromatic spice"],
    colors: ["#fff0c8", "#d69b33", "#9d6d43"],
  },
  {
    id: "red-mirchi-powder",
    name: "Red Mirchi Powder",
    category: "Spices",
    tag: "Lal Mirch",
    description: "Pure red chilli powder for curries, tadka, chutneys, marinades, and everyday Indian cooking.",
    price: 129,
    mrp: 165,
    pack: "200 g",
    rating: 4.6,
    benefits: ["Bold curry heat", "Natural red color", "No artificial color"],
    colors: ["#ffe3dd", "#c83b2f", "#7b1f1a"],
  },
  {
    id: "coriander-powder",
    name: "Coriander Powder",
    category: "Spices",
    tag: "Dhania",
    description: "Fresh dhania powder for curries, gravies, dals, sabzi, and everyday masala blends.",
    price: 99,
    mrp: 125,
    pack: "200 g",
    rating: 4.6,
    benefits: ["Warm citrus aroma", "Daily curry base", "Finely ground"],
    colors: ["#edf1c4", "#a3aa4f", "#686b2a"],
  },
  {
    id: "whole-cumin-seeds",
    name: "Whole Cumin Seeds",
    category: "Spices",
    tag: "Jeera",
    description: "Natural jeera seeds for tadka, dal, sabzi, jeera rice, chutneys, and masala blends.",
    price: 159,
    mrp: 199,
    pack: "200 g",
    rating: 4.7,
    benefits: ["Tadka essential", "Earthy aroma", "Clean whole seeds"],
    colors: ["#eadac5", "#9d6d43", "#684324"],
  },
  {
    id: "cumin-powder",
    name: "Cumin Powder",
    category: "Spices",
    tag: "Jeera",
    description: "Roasted-style jeera powder for raita, curries, chaas, chaat, and finishing masalas.",
    price: 139,
    mrp: 175,
    pack: "200 g",
    rating: 4.6,
    benefits: ["Earthy roasted taste", "Great for raita", "Aromatic powder"],
    colors: ["#f3dfbd", "#9d6d43", "#5f3f2d"],
  },
  {
    id: "garam-masala",
    name: "Garam Masala",
    category: "Spices",
    tag: "Blend",
    description: "Aromatic Indian spice blend for curries, lentils, pulao, soups, and finishing flavor.",
    price: 149,
    mrp: 190,
    pack: "100 g",
    rating: 4.8,
    benefits: ["Finishing masala", "Warm aroma", "Classic Indian blend"],
    colors: ["#e8d6cb", "#6a3b32", "#28302d"],
  },
  {
    id: "mustard-seeds",
    name: "Mustard Seeds",
    category: "Spices",
    tag: "Rai",
    description: "Small mustard seeds for South Indian tempering, pickles, poha, dal, and chutneys.",
    price: 89,
    mrp: 110,
    pack: "200 g",
    rating: 4.5,
    benefits: ["Tempering essential", "Pickle friendly", "Clean bold seeds"],
    colors: ["#f4e8d8", "#28302d", "#d69b33"],
  },
  {
    id: "black-pepper-powder",
    name: "Black Pepper Powder",
    category: "Spices",
    tag: "Kali Mirch",
    description: "Sharp black pepper powder for soups, eggs, rasam, marinades, and everyday seasoning.",
    price: 199,
    mrp: 249,
    pack: "100 g",
    rating: 4.7,
    benefits: ["Sharp warm spice", "Fine grind", "Kitchen seasoning staple"],
    colors: ["#d9e2df", "#28302d", "#606b66"],
  },
  {
    id: "kashmiri-chilli-powder",
    name: "Kashmiri Chilli Powder",
    category: "Spices",
    tag: "Color",
    description: "Mild red chilli powder for rich curry color, tandoori marinades, gravies, and chutneys.",
    price: 179,
    mrp: 225,
    pack: "200 g",
    rating: 4.6,
    benefits: ["Vibrant red color", "Milder heat", "Great for marinades"],
    colors: ["#ffe3dd", "#d45f3b", "#8d211c"],
  },
  {
    id: "sambar-masala",
    name: "Sambar Masala",
    category: "Spices",
    tag: "South",
    description: "South Indian spice blend for sambar, kuzhambu-style curries, vegetables, and lentils.",
    price: 129,
    mrp: 165,
    pack: "200 g",
    rating: 4.6,
    benefits: ["South Indian blend", "Dal and vegetable friendly", "Balanced spice"],
    colors: ["#f3dfbd", "#c18443", "#7b1f1a"],
  },
  {
    id: "chaat-masala",
    name: "Chaat Masala",
    category: "Spices",
    tag: "Tangy",
    description: "Tangy masala for fruits, salads, chaats, fries, raita, sandwiches, and snacks.",
    price: 99,
    mrp: 125,
    pack: "100 g",
    rating: 4.5,
    benefits: ["Tangy snack sprinkle", "Great on fruit", "Ready-to-use blend"],
    colors: ["#f4e8d8", "#9d6d43", "#5b405c"],
  },
  {
    id: "kasuri-methi",
    name: "Kasuri Methi",
    category: "Spices",
    tag: "Methi",
    description: "Dried fenugreek leaves for butter masala, dal, paratha dough, curries, and gravies.",
    price: 79,
    mrp: 99,
    pack: "50 g",
    rating: 4.7,
    benefits: ["Restaurant-style aroma", "Crush-and-add leaves", "Great for gravies"],
    colors: ["#e9f2e8", "#5c8d50", "#315a38"],
  },
];

function customProducts() {
  try {
    return JSON.parse(localStorage.getItem("seedoraCustomProducts") || "[]").map((product) => ({
      rating: 4.5,
      benefits: ["Fresh Seedora pack", "Quality checked", "All India delivery"],
      colors: ["#f4e8d8", "#246b45", "#d69b33"],
      ...product,
      price: Number(product.price),
      mrp: Number(product.mrp),
    }));
  } catch {
    return [];
  }
}

products = [...products, ...customProducts()];

let categories = ["All", "Nuts", "Dried Fruits", "Seeds", "Mixes", "Gifts", "Laddus", "Spices"];
categories = [...new Set([...categories, ...products.map((product) => product.category)])];
const freeDeliveryThreshold = 999;
const cart = new Map(JSON.parse(localStorage.getItem("seedoraCart") || "[]"));
const wishlist = new Set(JSON.parse(localStorage.getItem("seedoraWishlist") || "[]"));
let selectedCategory = "All";
let selectedProductId = products[0].id;
let selectedVariant = "250 g";
let activeQuickFilter = "all";
let appliedCoupon = "";

const productGrid = document.querySelector("#productGrid");
const categoryList = document.querySelector("#categoryList");
const resultCount = document.querySelector("#resultCount");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const priceFilter = document.querySelector("#priceFilter");
const resetFilters = document.querySelector("#resetFilters");
const quickFilters = document.querySelector("#quickFilters");
const emptyResults = document.querySelector("#emptyResults");
const productDrawer = document.querySelector("#productDrawer");
const cartDrawer = document.querySelector("#cartDrawer");
const authDrawer = document.querySelector("#authDrawer");
const overlay = document.querySelector("#overlay");
const productDetails = document.querySelector("#productDetails");
const accountButton = document.querySelector("#accountButton");
const cartButton = document.querySelector("#cartButton");
const cartCount = document.querySelector("#cartCount");
const wishlistButton = document.querySelector("#wishlistButton");
const wishlistCount = document.querySelector("#wishlistCount");
const cartItems = document.querySelector("#cartItems");
const savingsEl = document.querySelector("#savings");
const discountEl = document.querySelector("#discount");
const subtotalEl = document.querySelector("#subtotal");
const deliveryEl = document.querySelector("#delivery");
const totalEl = document.querySelector("#total");
const couponInput = document.querySelector("#couponInput");
const applyCoupon = document.querySelector("#applyCoupon");
const deliveryNote = document.querySelector("#deliveryNote");
const checkoutForm = document.querySelector("#checkoutForm");
const orderReceipt = document.querySelector("#orderReceipt");
const orderNote = document.querySelector("#orderNote");
const otpRequestForm = document.querySelector("#otpRequestForm");
const otpVerifyForm = document.querySelector("#otpVerifyForm");
const authNote = document.querySelector("#authNote");
const accountCard = document.querySelector("#accountCard");
const guestModeButton = document.querySelector("#guestModeButton");
let pendingOtpProfile = JSON.parse(localStorage.getItem("seedoraPendingOtpProfile") || "null");
let customerSession = JSON.parse(localStorage.getItem("seedoraCustomerSession") || "null");

const productArt = {
  "almond-california": ["almond", "almond", "almond", "almond", "almond", "almond"],
  "cashew-w320": ["cashew", "cashew", "cashew", "cashew", "cashew", "cashew"],
  "pista-roasted": ["pista", "pista-open", "pista", "pista-open", "pista", "pista-open"],
  "walnut-kernels": ["walnut", "walnut", "walnut", "walnut", "walnut"],
  "macadamia-nuts": ["macadamia", "macadamia", "macadamia", "macadamia", "macadamia"],
  "turkish-apricot": ["apricot", "apricot", "apricot", "apricot", "apricot"],
  "kimia-dates": ["date", "date", "date", "date", "date", "date"],
  "green-raisins": ["green-raisin", "green-raisin", "green-raisin", "green-raisin", "green-raisin", "green-raisin"],
  "premium-figs": ["fig", "fig-half", "fig", "fig-half", "fig"],
  "whole-cranberries": ["cranberry", "cranberry", "cranberry", "cranberry", "cranberry", "cranberry"],
  "premium-makhana": ["makhana", "makhana", "makhana", "makhana", "makhana"],
  "chilgoza-pine-nuts": ["pine-nut", "pine-nut", "pine-nut", "pine-nut", "pine-nut", "pine-nut"],
  "dry-coconut-slices": ["coconut", "coconut", "coconut", "coconut"],
  "mixed-dry-berries": ["cranberry", "berry-dark", "cranberry", "berry-dark", "green-raisin", "berry-dark"],
  "dried-prunes": ["prune", "prune", "prune", "prune", "prune"],
  hazelnuts: ["hazelnut", "hazelnut", "hazelnut", "hazelnut", "hazelnut"],
  pecans: ["pecan", "pecan", "pecan", "pecan", "pecan"],
  "pumpkin-seeds": ["pumpkin", "pumpkin", "pumpkin", "pumpkin", "pumpkin", "pumpkin"],
  "chia-seeds": ["chia", "chia", "chia", "chia", "chia", "chia", "chia", "chia"],
  "flax-seeds": ["flax", "flax", "flax", "flax", "flax", "flax"],
  "sunflower-seeds": ["sunflower", "sunflower", "sunflower", "sunflower", "sunflower", "sunflower"],
  "sesame-seeds": ["sesame", "sesame", "sesame", "sesame", "sesame", "sesame", "sesame", "sesame"],
  "watermelon-seeds": ["watermelon-seed", "watermelon-seed", "watermelon-seed", "watermelon-seed", "watermelon-seed"],
  "sabja-basil-seeds": ["basil-seed", "basil-seed", "basil-seed", "basil-seed", "basil-seed", "basil-seed"],
  "hemp-seeds": ["hemp-seed", "hemp-seed", "hemp-seed", "hemp-seed", "hemp-seed"],
  "fenugreek-seeds": ["fenugreek-seed", "fenugreek-seed", "fenugreek-seed", "fenugreek-seed", "fenugreek-seed"],
  "poppy-seeds": ["poppy-seed", "poppy-seed", "poppy-seed", "poppy-seed", "poppy-seed", "poppy-seed"],
  "fennel-seeds": ["fennel-seed", "fennel-seed", "fennel-seed", "fennel-seed", "fennel-seed"],
  "coriander-seeds": ["coriander-seed", "coriander-seed", "coriander-seed", "coriander-seed", "coriander-seed"],
  "nigella-seeds": ["nigella-seed", "nigella-seed", "nigella-seed", "nigella-seed", "nigella-seed"],
  "trail-mix": ["almond", "cashew", "green-raisin", "cranberry", "pumpkin", "pista-open"],
  "date-bites": ["date-bite", "date-bite", "date-bite", "date-bite", "date-bite"],
  "panchmeva-mix": ["almond", "cashew", "green-raisin", "date", "coconut", "pista"],
  "gift-box": ["gift-box"],
  "wedding-hamper": ["hamper"],
  "classic-dry-fruit-laddu": ["laddu", "laddu", "laddu", "almond", "cashew", "pista"],
  "anjeer-dry-fruit-laddu": ["laddu-fig", "laddu-fig", "laddu", "fig-half", "almond"],
  "sugar-free-dry-fruit-laddu": ["laddu-green", "laddu", "laddu-green", "date", "green-raisin"],
  "dates-dry-fruit-laddu": ["laddu-date", "laddu-date", "laddu", "date", "almond"],
  "choco-dates-dry-fruit-laddu": ["laddu-choco", "laddu-choco", "laddu-choco", "date-bite"],
  "andhra-style-dry-fruit-laddu": ["laddu-ghee", "laddu", "laddu-ghee", "cashew", "green-raisin"],
  "honey-dry-fruit-laddu": ["laddu-honey", "laddu-honey", "laddu", "honey-drop", "cashew"],
  "handmade-premium-dry-fruit-laddu": ["laddu-premium", "laddu", "laddu-fig", "almond", "pista-open"],
  "no-refined-sugar-laddoo": ["laddu-green", "laddu-date", "laddu", "pumpkin", "flax"],
  "rose-dry-fruit-laddu": ["laddu-rose", "laddu-rose", "laddu", "rose-petal", "almond"],
  "natural-turmeric-powder": ["turmeric-pack", "turmeric-powder", "turmeric-root", "turmeric-root"],
  "red-mirchi-powder": ["mirchi-pack", "mirchi-powder", "dry-red-chilli", "dry-red-chilli"],
  "coriander-powder": ["dhania-pack", "dhania-powder", "coriander-seed", "coriander-seed"],
  "whole-cumin-seeds": ["jeera-pack", "cumin-seed", "cumin-seed", "cumin-seed", "cumin-seed"],
  "cumin-powder": ["jeera-pack", "cumin-powder", "cumin-seed", "cumin-seed"],
  "garam-masala": ["masala-pack", "garam-powder", "clove", "cardamom", "peppercorn"],
  "mustard-seeds": ["rai-pack", "mustard-seed", "mustard-seed", "mustard-seed", "mustard-seed"],
  "black-pepper-powder": ["pepper-pack", "pepper-powder", "peppercorn", "peppercorn"],
  "kashmiri-chilli-powder": ["kashmiri-pack", "mirchi-powder", "dry-red-chilli", "dry-red-chilli"],
  "sambar-masala": ["sambar-pack", "sambar-powder", "dry-red-chilli", "coriander-seed"],
  "chaat-masala": ["chaat-pack", "chaat-powder", "cumin-seed", "peppercorn"],
  "kasuri-methi": ["methi-pack", "methi-leaf", "methi-leaf", "methi-leaf"],
};

async function loadBackendCatalog() {
  try {
    const response = await fetch("/api/products");
    if (!response.ok) throw new Error("Backend catalog unavailable");
    const catalog = await response.json();
    products = catalog.products;
    categories = ["All", ...catalog.categories.map((category) => category.name)];
    return;
  } catch {
  }
  try {
    const response = await fetch("data/seed.json?v=walnuts-photo", { cache: "no-store" });
    if (!response.ok) throw new Error("Seed catalog unavailable");
    const catalog = await response.json();
    products = catalog.products.filter((product) => product.active !== false);
    categories = ["All", ...catalog.categories.filter((category) => category.active !== false).map((category) => category.name)];
  } catch {
    products = [...products, ...customProducts()];
  }
}

function currency(value) {
  return `Rs. ${value.toLocaleString("en-IN")}`;
}

function productDiscount(product) {
  return Math.max(0, Math.round(((product.mrp - product.price) / product.mrp) * 100));
}

function variantOptions(product) {
  if (product.category === "Gifts") return [product.pack];
  if (product.category === "Spices") return ["100 g", "200 g", "500 g", "1 kg"];
  if (product.category === "Laddus") return ["250 g", "500 g", "1 kg"];
  if (product.category === "Mixes") return ["180 g", "250 g", "500 g"];
  return ["200 g", "250 g", "500 g", "1 kg"];
}

function variantMultiplier(pack, product) {
  const base = Number.parseInt(product.pack, 10) || 1;
  const size = Number.parseInt(pack, 10) || base;
  if (pack.includes("kg")) return 4;
  if (product.pack.includes("box") || product.pack.includes("hamper")) return 1;
  return Math.max(0.6, size / base);
}

function variantPrice(product, pack) {
  return Math.round(product.price * variantMultiplier(pack, product));
}

function variantMrp(product, pack) {
  return Math.round(product.mrp * variantMultiplier(pack, product));
}

function persistShop() {
  localStorage.setItem("seedoraCart", JSON.stringify([...cart.entries()]));
  localStorage.setItem("seedoraWishlist", JSON.stringify([...wishlist]));
}

function showToast(message) {
  orderNote.textContent = message;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    if (orderNote.textContent === message) orderNote.textContent = "";
  }, 2600);
}

function renderAccount() {
  if (!customerSession?.customer) {
    accountCard.hidden = true;
    accountButton.title = "Login to Seedora";
    return;
  }
  const customer = customerSession.customer;
  accountButton.title = `Logged in as ${customer.name || customer.mobile}`;
  accountCard.hidden = false;
  accountCard.innerHTML = `
    <strong>${customer.name || "Seedora customer"}</strong>
    <span>${customer.mobile}</span>
    ${customer.email ? `<span>${customer.email}</span>` : ""}
    <button class="reset-button" type="button" id="logoutButton">Logout</button>
  `;
  fillCheckoutProfile();
}

function fillCheckoutProfile() {
  if (!customerSession?.customer) return;
  const customer = customerSession.customer;
  if (checkoutForm.elements.name && !checkoutForm.elements.name.value) checkoutForm.elements.name.value = customer.name || "";
  if (checkoutForm.elements.mobile && !checkoutForm.elements.mobile.value) checkoutForm.elements.mobile.value = customer.mobile || "";
  if (checkoutForm.elements.email && !checkoutForm.elements.email.value) checkoutForm.elements.email.value = customer.email || "";
}

function setVisualStyle(element, product) {
  element.style.setProperty("--visual-bg", `linear-gradient(135deg, ${product.colors[0]}, #ffffff)`);
  element.style.setProperty("--visual-dot", product.colors[1]);
  element.style.setProperty("--visual-accent", product.colors[2]);
}

function productImageMarkup(product, size = "card") {
  if (product.image) {
    return `
      <div class="product-art ${size} uploaded-photo" role="img" aria-label="${product.name} product image">
        <img src="${product.image}" alt="${product.name}" />
        <span class="product-photo-label">${product.name}</span>
      </div>
    `;
  }
  const pieces = productArt[product.id] || ["almond", "cashew", "date"];
  return `
    <div class="product-art ${size}" role="img" aria-label="${product.name} product image">
      <span class="plate"></span>
      ${pieces.map((piece, index) => `<span class="food-piece ${piece} pos-${index + 1}"></span>`).join("")}
      <span class="product-photo-label">${product.name}</span>
    </div>
  `;
}

function renderCategories() {
  categoryList.innerHTML = categories
    .map((category) => {
      const count =
        category === "All" ? products.length : products.filter((product) => product.category === category).length;
      return `
        <button class="${category === selectedCategory ? "active" : ""}" type="button" data-category="${category}">
          ${category}
          <span>${count}</span>
        </button>
      `;
    })
    .join("");
}

function filteredProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = [product.name, product.category, product.description, product.tag]
      .join(" ")
      .toLowerCase()
      .includes(query);
    const matchesBudget =
      priceFilter.value === "all" ||
      (priceFilter.value === "under-200" && product.price < 200) ||
      (priceFilter.value === "200-500" && product.price >= 200 && product.price <= 500) ||
      (priceFilter.value === "500-plus" && product.price > 500);
    const matchesQuick =
      activeQuickFilter === "all" ||
      (activeQuickFilter === "bestsellers" && product.rating >= 4.8) ||
      (activeQuickFilter === "under-200" && product.price < 200) ||
      (activeQuickFilter === "spices" && product.category === "Spices") ||
      (activeQuickFilter === "gifts" && (product.category === "Gifts" || product.tag.toLowerCase().includes("gift"))) ||
      (activeQuickFilter === "wishlist" && wishlist.has(product.id));
    return matchesCategory && matchesSearch && matchesBudget && matchesQuick;
  });

  if (sortSelect.value === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (sortSelect.value === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  if (sortSelect.value === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  if (sortSelect.value === "discount") {
    filtered.sort((a, b) => productDiscount(b) - productDiscount(a));
  }

  return filtered;
}

function renderProducts() {
  const visibleProducts = filteredProducts();
  resultCount.textContent = `${visibleProducts.length} items`;
  document.querySelector("#productHeading").textContent =
    activeQuickFilter === "wishlist" ? "Your Wishlist" : selectedCategory === "All" ? "Premium Picks" : selectedCategory;
  emptyResults.hidden = visibleProducts.length > 0;
  productGrid.innerHTML = visibleProducts
    .map(
      (product) => `
      <article class="product-card" data-product-card="${product.id}">
        <div class="product-visual">
          <span class="badge">${product.tag}</span>
          <button class="wish-toggle ${wishlist.has(product.id) ? "saved" : ""}" type="button" data-wish="${product.id}" aria-label="Save ${product.name}">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
            </svg>
          </button>
          ${productImageMarkup(product)}
        </div>
        <div class="product-body">
          <div class="product-meta">
            <span>${product.category}</span>
            <span>${product.rating.toFixed(1)} star</span>
          </div>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="price-row">
            <strong>${currency(product.price)}</strong>
            <s>${currency(product.mrp)}</s>
            <span>${product.pack}</span>
          </div>
          <div class="stock-row">
            <span>In stock</span>
            <span>${productDiscount(product)}% off</span>
          </div>
          <div class="card-actions">
            <button type="button" data-add="${product.id}">Add to bag</button>
            <button class="ghost-button" type="button" data-view="${product.id}" aria-label="View ${product.name}">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>
      </article>
    `,
    )
    .join("");

  visibleProducts.forEach((product) => {
    const visual = productGrid.querySelector(`[data-product-card="${product.id}"] .product-visual`);
    if (visual) setVisualStyle(visual, product);
  });
  wishlistCount.textContent = wishlist.size;
}

function openDrawer(drawer) {
  overlay.hidden = false;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
}

function closeDrawers() {
  productDrawer.classList.remove("open");
  cartDrawer.classList.remove("open");
  authDrawer.classList.remove("open");
  productDrawer.setAttribute("aria-hidden", "true");
  cartDrawer.setAttribute("aria-hidden", "true");
  authDrawer.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
}

function renderProductDetails(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  selectedProductId = product.id;
  selectedVariant = product.pack;
  const options = variantOptions(product);
  productDetails.innerHTML = `
    <div class="product-visual detail-visual">${productImageMarkup(product, "detail")}</div>
    <p class="eyebrow">${product.category} · ${product.tag}</p>
    <h2>${product.name}</h2>
    <p>${product.description}</p>
    <div class="price-row" id="detailPrice">
      <strong>${currency(variantPrice(product, selectedVariant))}</strong>
      <s>${currency(variantMrp(product, selectedVariant))}</s>
      <span>${product.rating.toFixed(1)} star</span>
    </div>
    <div class="stock-row detail-stock">
      <span>In stock</span>
      <span>Fresh dispatch in 24 hours</span>
    </div>
    <ul class="detail-list">
      ${product.benefits.map((benefit) => `<li>${benefit}</li>`).join("")}
    </ul>
    <div class="variant-row" aria-label="Pack sizes">
      ${options
        .map(
          (size) => `
          <button class="${size === product.pack ? "active" : ""}" type="button" data-variant="${size}">
            ${size}
          </button>
        `,
        )
        .join("")}
    </div>
    <button class="primary-action" type="button" data-detail-add="${product.id}">Add ${product.pack} · ${currency(product.price)}</button>
    <button class="secondary-action full-width-action" type="button" data-detail-wish="${product.id}">
      ${wishlist.has(product.id) ? "Saved to wishlist" : "Save to wishlist"}
    </button>
  `;

  const visual = productDetails.querySelector(".detail-visual");
  setVisualStyle(visual, product);
  openDrawer(productDrawer);
}

function addToCart(productId, variant) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const pack = variant || product.pack;
  const key = `${product.id}-${pack}`;
  const existing = cart.get(key);
  cart.set(key, {
    ...product,
    key,
    pack,
    price: variantPrice(product, pack),
    mrp: variantMrp(product, pack),
    qty: existing ? existing.qty + 1 : 1,
  });
  persistShop();
  renderCart();
  showToast(`${product.name} added to your bag.`);
}

function addPlan(planName) {
  const product = {
    id: planName.toLowerCase().replaceAll(" ", "-"),
    name: planName,
    category: "Plans",
    tag: "Monthly",
    description: "Seedora recurring snack plan",
    price: planName.includes("Kitchen") ? 1499 : planName.includes("Desk") ? 1299 : 899,
    mrp: planName.includes("Kitchen") ? 1799 : planName.includes("Desk") ? 1599 : 1099,
    pack: "Monthly",
    rating: 4.8,
    benefits: [],
    colors: ["#e9f2e8", "#246b45", "#d69b33"],
  };
  const key = `${product.id}-Monthly`;
  const existing = cart.get(key);
  cart.set(key, {
    ...product,
    key,
    pack: "Monthly",
    qty: existing ? existing.qty + 1 : 1,
  });
  persistShop();
  renderCart();
  showToast(`${product.name} added to your bag.`);
}

function updateQty(key, delta) {
  const item = cart.get(key);
  if (!item) return;
  const qty = item.qty + delta;
  if (qty <= 0) {
    cart.delete(key);
  } else {
    cart.set(key, { ...item, qty });
  }
  persistShop();
  renderCart();
}

function renderCart() {
  const items = [...cart.values()];
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const savings = items.reduce((sum, item) => sum + (item.mrp - item.price) * item.qty, 0);
  const couponDiscount = appliedCoupon && subtotal > 0 ? Math.round(subtotal * 0.1) : 0;
  const delivery = subtotal === 0 || subtotal >= freeDeliveryThreshold ? 0 : 49;
  const total = Math.max(0, subtotal - couponDiscount + delivery);

  cartCount.textContent = itemCount;
  savingsEl.textContent = currency(savings);
  discountEl.textContent = couponDiscount ? `-${currency(couponDiscount)}` : currency(0);
  subtotalEl.textContent = currency(subtotal);
  deliveryEl.textContent = delivery === 0 ? "Free" : currency(delivery);
  totalEl.textContent = currency(total);
  deliveryNote.textContent =
    subtotal === 0
      ? "Free delivery on orders above Rs. 999."
      : delivery === 0
        ? "Free delivery unlocked for this order."
        : `Add ${currency(freeDeliveryThreshold - subtotal)} more for free delivery.`;
  wishlistCount.textContent = wishlist.size;

  if (!items.length) {
    cartItems.innerHTML = `<div class="empty-cart">Your Seedora bag is empty.</div>`;
    return;
  }

  cartItems.innerHTML = items
    .map(
      (item) => `
      <article class="cart-item" data-cart-row="${item.key}">
        <div class="cart-thumb">${productImageMarkup(item, "thumb")}</div>
        <div>
          <h3>${item.name}</h3>
          <p>${item.pack} · ${currency(item.price)}</p>
          <div class="cart-line">
            <div class="qty" aria-label="Quantity for ${item.name}">
              <button type="button" data-qty="${item.key}" data-delta="-1">-</button>
              <span>${item.qty}</span>
              <button type="button" data-qty="${item.key}" data-delta="1">+</button>
            </div>
            <strong>${currency(item.price * item.qty)}</strong>
          </div>
        </div>
      </article>
    `,
    )
    .join("");

  items.forEach((item) => {
    const thumb = cartItems.querySelector(`[data-cart-row="${item.key}"] .cart-thumb`);
    if (thumb) setVisualStyle(thumb, item);
  });
}

categoryList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  selectedCategory = button.dataset.category;
  renderCategories();
  renderProducts();
});

document.querySelectorAll("[data-nav-category]").forEach((link) => {
  link.addEventListener("click", () => {
    selectedCategory = link.dataset.navCategory;
    activeQuickFilter = "all";
    searchInput.value = "";
    renderCategories();
    renderProducts();
  });
});

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const viewButton = event.target.closest("[data-view]");
  const wishButton = event.target.closest("[data-wish]");
  if (wishButton) {
    const productId = wishButton.dataset.wish;
    if (wishlist.has(productId)) {
      wishlist.delete(productId);
      showToast("Removed from wishlist.");
    } else {
      wishlist.add(productId);
      showToast("Saved to wishlist.");
    }
    persistShop();
    renderProducts();
    renderCart();
    return;
  }
  if (addButton) {
    addToCart(addButton.dataset.add);
    openDrawer(cartDrawer);
  }
  if (viewButton) {
    renderProductDetails(viewButton.dataset.view);
  }
});

productDetails.addEventListener("click", (event) => {
  const variantButton = event.target.closest("[data-variant]");
  const addButton = event.target.closest("[data-detail-add]");
  const wishButton = event.target.closest("[data-detail-wish]");

  if (variantButton) {
    selectedVariant = variantButton.dataset.variant;
    const product = products.find((item) => item.id === selectedProductId);
    productDetails.querySelectorAll("[data-variant]").forEach((button) => button.classList.remove("active"));
    variantButton.classList.add("active");
    productDetails.querySelector("#detailPrice").innerHTML = `
      <strong>${currency(variantPrice(product, selectedVariant))}</strong>
      <s>${currency(variantMrp(product, selectedVariant))}</s>
      <span>${product.rating.toFixed(1)} star</span>
    `;
    productDetails.querySelector("[data-detail-add]").textContent =
      `Add ${selectedVariant} · ${currency(variantPrice(product, selectedVariant))}`;
  }

  if (wishButton) {
    const productId = wishButton.dataset.detailWish;
    if (wishlist.has(productId)) {
      wishlist.delete(productId);
      wishButton.textContent = "Save to wishlist";
      showToast("Removed from wishlist.");
    } else {
      wishlist.add(productId);
      wishButton.textContent = "Saved to wishlist";
      showToast("Saved to wishlist.");
    }
    persistShop();
    renderProducts();
    renderCart();
  }

  if (addButton) {
    addToCart(selectedProductId, selectedVariant);
    closeDrawers();
    openDrawer(cartDrawer);
  }
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-qty]");
  if (!button) return;
  updateQty(button.dataset.qty, Number(button.dataset.delta));
});

document.addEventListener("click", (event) => {
  const closeButton = event.target.closest("[data-close-drawer]");
  const giftButton = event.target.closest("[data-open-product]");
  const planButton = event.target.closest("[data-add-plan]");
  const footerCategory = event.target.closest("[data-footer-category]");

  if (closeButton || event.target === overlay) closeDrawers();
  if (giftButton) renderProductDetails(giftButton.dataset.openProduct);
  if (planButton) {
    addPlan(planButton.dataset.addPlan);
    openDrawer(cartDrawer);
  }
  if (footerCategory) {
    selectedCategory = footerCategory.dataset.footerCategory;
    activeQuickFilter = "all";
    searchInput.value = "";
    renderCategories();
    renderProducts();
  }
});

cartButton.addEventListener("click", () => openDrawer(cartDrawer));
accountButton.addEventListener("click", () => {
  renderAccount();
  openDrawer(authDrawer);
});
guestModeButton.addEventListener("click", () => {
  closeDrawers();
  document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
  showToast("Guest mode is active. You can browse and checkout without login.");
});
wishlistButton.addEventListener("click", () => {
  activeQuickFilter = "wishlist";
  selectedCategory = "All";
  renderCategories();
  quickFilters.querySelectorAll("[data-quick]").forEach((button) => {
    button.classList.toggle("active", button.dataset.quick === "wishlist");
  });
  renderProducts();
  document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
});
searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);
priceFilter.addEventListener("change", renderProducts);
quickFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-quick]");
  if (!button) return;
  activeQuickFilter = button.dataset.quick;
  quickFilters.querySelectorAll("[data-quick]").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  renderProducts();
});
resetFilters.addEventListener("click", () => {
  selectedCategory = "All";
  activeQuickFilter = "all";
  searchInput.value = "";
  sortSelect.value = "featured";
  priceFilter.value = "all";
  quickFilters.querySelectorAll("[data-quick]").forEach((button) => {
    button.classList.toggle("active", button.dataset.quick === "all");
  });
  renderCategories();
  renderProducts();
});
applyCoupon.addEventListener("click", () => {
  const code = couponInput.value.trim().toUpperCase();
  if (code === businessSettings.couponCode) {
    appliedCoupon = code;
    showToast(`${businessSettings.couponCode} applied. You got 10% off.`);
  } else {
    appliedCoupon = "";
    showToast(`Try ${businessSettings.couponCode} for 10% off.`);
  }
  renderCart();
});

otpRequestForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(otpRequestForm);
  const mobile = data.get("mobile").toString().trim();
  if (!/^\d{10}$/.test(mobile)) {
    authNote.textContent = "Please enter a valid 10-digit mobile number.";
    return;
  }
  pendingOtpProfile = {
    name: data.get("name").toString().trim(),
    mobile,
    email: data.get("email").toString().trim(),
    consent: data.get("consent") === "on",
  };
  localStorage.setItem("seedoraPendingOtpProfile", JSON.stringify(pendingOtpProfile));
  try {
    const response = await fetch("/api/auth/request-otp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(pendingOtpProfile),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not send OTP");
    authNote.textContent = result.devOtp
      ? `OTP sent. Development OTP: ${result.devOtp}`
      : "OTP sent to your mobile.";
  } catch (error) {
    authNote.textContent = error.message;
  }
});

otpVerifyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!pendingOtpProfile) {
    authNote.textContent = "Please request OTP first.";
    return;
  }
  const data = new FormData(otpVerifyForm);
  try {
    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...pendingOtpProfile,
        otp: data.get("otp").toString().trim(),
      }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "OTP verification failed");
    customerSession = result;
    pendingOtpProfile = null;
    localStorage.setItem("seedoraCustomerSession", JSON.stringify(customerSession));
    localStorage.removeItem("seedoraPendingOtpProfile");
    authNote.textContent = "Logged in successfully.";
    otpRequestForm.reset();
    otpVerifyForm.reset();
    renderAccount();
  } catch (error) {
    authNote.textContent = error.message;
  }
});

accountCard.addEventListener("click", (event) => {
  if (!event.target.closest("#logoutButton")) return;
  customerSession = null;
  localStorage.removeItem("seedoraCustomerSession");
  authNote.textContent = "Logged out.";
  renderAccount();
});

checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!cart.size) {
    orderNote.textContent = "Add at least one Seedora item before checkout.";
    return;
  }
  const data = new FormData(checkoutForm);
  const name = data.get("name").toString().trim().split(" ")[0] || "there";
  const mobile = data.get("mobile").toString().trim();
  const email = data.get("email").toString().trim();
  const pincode = data.get("pincode").toString().trim();
  const payment = data.get("payment").toString();
  if (!/^\d{10}$/.test(mobile)) {
    showToast("Please enter a valid 10-digit mobile number.");
    return;
  }
  if (!/^\d{6}$/.test(pincode)) {
    showToast("Please enter a valid 6-digit pincode.");
    return;
  }
  let orderId = `SDR${Date.now().toString().slice(-6)}`;
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        customer: {
          name: data.get("name").toString().trim(),
          mobile,
          email,
          consent: true,
        },
        address: {
          area: data.get("area").toString().trim(),
          address: data.get("address").toString().trim(),
          pincode,
        },
        paymentMethod: payment,
        couponCode: appliedCoupon,
        items: [...cart.values()].map((item) => ({
          productId: item.id,
          pack: item.pack,
          qty: item.qty,
          price: item.price,
          mrp: item.mrp,
        })),
      }),
    });
    if (response.ok) {
      const saved = await response.json();
      orderId = saved.order.id;
    }
  } catch {
    showToast("Order saved locally. Backend is not reachable.");
  }
  orderReceipt.hidden = false;
  orderReceipt.innerHTML = `
    <strong>Order ${orderId} confirmed</strong>
    <span>Thanks ${name}. Your Seedora order will be dispatched in 24 hours.</span>
    <span>Payment: ${payment}</span>
  `;
  orderNote.textContent = `Order confirmed for ${name}.`;
  checkoutForm.reset();
  cart.clear();
  appliedCoupon = "";
  couponInput.value = "";
  persistShop();
  renderCart();
});

async function initSeedora() {
  await loadBackendCatalog();
  renderAccount();
  renderCategories();
  renderProducts();
  renderCart();
}

initSeedora();
