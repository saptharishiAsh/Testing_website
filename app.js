const products = [
  { id: 1, name: "MacBook Air M3", description: "Light, fast and ready for big ideas.", price: 89900, category: "tech", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=85" },
  { id: 2, name: "Pixel Pro Phone", description: "A brilliant camera in your pocket.", price: 64900, category: "tech", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=85" },
  { id: 3, name: "Softline Office Chair", description: "Supportive comfort for focused days.", price: 21900, category: "home", image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800&q=85" },
  { id: 4, name: "Everyday Carry Pack", description: "Room for your day, without the bulk.", price: 6990, category: "style", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85" },
  { id: 5, name: "Quiet Desk Lamp", description: "Warm light for late-night thinking.", price: 3990, category: "home", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=85" },
  { id: 6, name: "Studio Headphones", description: "Clear sound for deep work and play.", price: 12900, category: "tech", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85" },
];

let cart = [];
let activeCategory = "all";
let currentUser = JSON.parse(localStorage.getItem("rishiMartUser") || "null");

const authSection = document.querySelector("#auth-section");
const shopSection = document.querySelector("#shop-section");
const cartSection = document.querySelector("#cart-section");
const checkoutSection = document.querySelector("#checkout-section");
const confirmationSection = document.querySelector("#confirmation-section");
const productsContainer = document.querySelector("#products");
const cartItems = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");
const toastRegion = document.querySelector("#toast-region");
const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastRegion.append(toast);
  setTimeout(() => toast.remove(), 3200);
}

function showView(view) {
  [authSection, shopSection, cartSection, checkoutSection, confirmationSection].forEach((section) => { section.hidden = section !== view; });
}

function updateMember() {
  if (!currentUser) return;
  document.querySelector("#member-name").textContent = currentUser.name.split(" ")[0];
  document.querySelector("#account-button").textContent = currentUser.name;
}

function saveUser(name, email, password, phone) {
  currentUser = { name, email, password, phone };
  localStorage.setItem("rishiMartUser", JSON.stringify(currentUser));
}

document.querySelector("#login-tab").addEventListener("click", () => { document.querySelector("#login-view").hidden = false; document.querySelector("#signup-view").hidden = true; document.querySelector("#login-tab").classList.add("active"); document.querySelector("#signup-tab").classList.remove("active"); });
document.querySelector("#signup-tab").addEventListener("click", () => { document.querySelector("#login-view").hidden = true; document.querySelector("#signup-view").hidden = false; document.querySelector("#signup-tab").classList.add("active"); document.querySelector("#login-tab").classList.remove("active"); });

document.querySelector("#signup-form").addEventListener("submit", (event) => {
  event.preventDefault();
  saveUser(document.querySelector("#signup-name").value.trim(), document.querySelector("#signup-email").value.trim().toLowerCase(), document.querySelector("#signup-password").value, document.querySelector("#signup-phone").value.trim());
  updateMember();
  showView(shopSection);
  showToast("Account created. Welcome to Rishi Mart!");
});

document.querySelector("#login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#email").value.trim().toLowerCase();
  const password = document.querySelector("#password").value;
  if (!currentUser || email !== currentUser.email || password !== currentUser.password) { showToast("Email or password does not match.", "error"); return; }
  updateMember();
  showView(shopSection);
  showToast(`Welcome back, ${currentUser.name.split(" ")[0]}!`);
});

document.querySelector("#cart-button").addEventListener("click", () => {
  showView(cartSection);
  renderCart();
});

document.querySelector("#continue-shopping").addEventListener("click", () => showView(shopSection));
document.querySelector("#account-button").addEventListener("click", () => { if (currentUser) showView(shopSection); else showView(authSection); });
document.querySelector("#logout-button").addEventListener("click", () => { currentUser = null; localStorage.removeItem("rishiMartUser"); showView(authSection); showToast("You have been logged out."); });

document.querySelector("#checkout-button").addEventListener("click", () => {
  if (!cart.length) { showToast("Add an item before checking out.", "error"); return; }
  showView(checkoutSection);
  document.querySelector("#checkout-items").innerHTML = cart.map((product) => `<p><span>${product.name}</span><strong>${currency.format(product.price)}</strong></p>`).join("");
  document.querySelector("#payment-total").textContent = currency.format(getTotal());
});

document.querySelector("#checkout-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const cardNumber = document.querySelector("#card-number").value.replace(/\s/g, "");
  if (cardNumber !== "4242424242424242") { showToast("Payment declined. Use the test card 4242 4242 4242 4242.", "error"); return; }
  showView(confirmationSection);
  document.querySelector("#order-number").textContent =
    `Order number: RM-${Date.now().toString().slice(-8)}`;
  cart = [];
  updateCartCount();
  showToast("Payment approved. Your order is confirmed!");
});

function getTotal() { return cart.reduce((total, product) => total + product.price, 0); }
function updateCartCount() { cartCount.textContent = cart.length; }

function renderProducts() {
  const query = document.querySelector("#search-input").value.trim().toLowerCase();
  const sort = document.querySelector("#sort-select").value;
  let visibleProducts = products.filter((product) => (activeCategory === "all" || product.category === activeCategory) && `${product.name} ${product.description}`.toLowerCase().includes(query));
  if (sort === "low") visibleProducts.sort((a, b) => a.price - b.price);
  if (sort === "high") visibleProducts.sort((a, b) => b.price - a.price);
  document.querySelector("#empty-products").hidden = visibleProducts.length > 0;
  productsContainer.innerHTML = products
    .filter((product) => visibleProducts.includes(product))
    .map(
      (product) => `
        <article class="product-card" data-testid="product-card">
          <div class="product-image-wrap"><img src="${product.image}" alt="${product.name}" /><span class="category-label">${product.category}</span></div>
          <div class="product-info"><div><h3>${product.name}</h3><p>${product.description}</p></div><strong>${currency.format(product.price)}</strong></div>
          <button class="add-button" data-product-id="${product.id}" type="button">Add to bag <span>+</span></button>
        </article>
      `
    )
    .join("");

  document.querySelectorAll("[data-product-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const product = products.find(
        (item) => item.id === Number(button.dataset.productId)
      );

      cart.push(product);
      updateCartCount();
      showToast(`${product.name} added to your bag.`);
    });
  });
}

function renderCart() {
  cartItems.innerHTML = cart.length
    ? cart.map((product, index) => `<div class="cart-row"><img src="${product.image}" alt="" /><div><strong>${product.name}</strong><span>${currency.format(product.price)}</span></div><button class="remove-button" data-remove-index="${index}" type="button" aria-label="Remove ${product.name}">×</button></div>`).join("")
    : "<p class=\"empty-state\">Your bag is waiting for something good.</p>";
  document.querySelector("#cart-total").textContent = currency.format(getTotal());
  document.querySelectorAll("[data-remove-index]").forEach((button) => button.addEventListener("click", () => { cart.splice(Number(button.dataset.removeIndex), 1); updateCartCount(); renderCart(); showToast("Item removed from your bag."); }));
}

document.querySelector("#search-input").addEventListener("input", renderProducts);
document.querySelector("#sort-select").addEventListener("change", renderProducts);
document.querySelectorAll(".filter-button").forEach((button) => button.addEventListener("click", () => { activeCategory = button.dataset.category; document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("active")); button.classList.add("active"); renderProducts(); }));
document.querySelector("#back-to-shop").addEventListener("click", () => showView(shopSection));
updateMember();
if (currentUser) showView(shopSection);
renderProducts();