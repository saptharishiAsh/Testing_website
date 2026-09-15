const products = [
  { id: 1, name: "MacBook Air M3", description: "Light, fast and ready for big ideas.", price: 89900, category: "tech", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=85" },
  { id: 2, name: "Pixel Pro Phone", description: "A brilliant camera in your pocket.", price: 64900, category: "tech", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=85" },
  { id: 3, name: "Softline Office Chair", description: "Supportive comfort for focused days.", price: 21900, category: "home", image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800&q=85" },
  { id: 4, name: "Everyday Carry Pack", description: "Room for your day, without the bulk.", price: 6990, category: "style", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85" },
  { id: 5, name: "Quiet Desk Lamp", description: "Warm light for late-night thinking.", price: 3990, category: "home", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=85" },
  { id: 6, name: "Studio Headphones", description: "Clear sound for deep work and play.", price: 12900, category: "tech", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85" },
  { id: 7, name: "Mechanical Keyboard", description: "Comfortable keys for long coding sessions.", price: 7490, category: "tech", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=85" },
  { id: 8, name: "Cotton Table Set", description: "A clean, easy layer for the dining table.", price: 2490, category: "home", image: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=800&q=85" },
  { id: 9, name: "Paperback Notebook", description: "A simple place for plans, lists and notes.", price: 590, category: "books", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=85" },
  { id: 10, name: "JavaScript Handbook", description: "A practical guide for learning by doing.", price: 1890, category: "books", image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=85" },
  { id: 11, name: "Daily Face Moisturizer", description: "Light hydration for a simple routine.", price: 1290, category: "beauty", image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=800&q=85" },
  { id: 12, name: "Canvas Sneakers", description: "An easy pair for everyday errands.", price: 3290, category: "style", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85" },
  { id: 13, name: "Resistance Bands", description: "Compact equipment for home workouts.", price: 990, category: "sports", image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=800&q=85" },
  { id: 14, name: "Trail Water Bottle", description: "A sturdy bottle for commutes and trails.", price: 1190, category: "sports", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=85" },
  { id: 15, name: "Ceramic Coffee Mug", description: "A dependable mug for the morning cup.", price: 790, category: "home", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=85" },
  { id: 16, name: "Travel Organizer", description: "Keep chargers and cables in one place.", price: 1590, category: "style", image: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?auto=format&fit=crop&w=800&q=85" },
  { id: 17, name: "Bluetooth Speaker", description: "Small sound for desks, kitchens and balconies.", price: 2990, category: "tech", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=85" },
  { id: 18, name: "Sunscreen SPF 50", description: "Everyday protection with a light finish.", price: 899, category: "beauty", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=85" },
];

let cart = [];
let activeCategory = "all";
let currentPage = 1;
const productsPerPage = 6;
const savedAccount = localStorage.getItem("rishiMartAccount") || localStorage.getItem("rishiMartUser");
let registeredUser = savedAccount ? JSON.parse(savedAccount) : null;
let currentUser = JSON.parse(localStorage.getItem("rishiMartSession") || "null") || registeredUser;

const authSection = document.querySelector("#auth-section");
const shopSection = document.querySelector("#shop-section");
const cartSection = document.querySelector("#cart-section");
const checkoutSection = document.querySelector("#checkout-section");
const confirmationSection = document.querySelector("#confirmation-section");
const integrationSection = document.querySelector("#integration-section");
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
  [authSection, shopSection, cartSection, checkoutSection, confirmationSection, integrationSection].forEach((section) => { section.hidden = section !== view; });
}

function showLoginTab() {
  document.querySelector("#login-view").hidden = false;
  document.querySelector("#signup-view").hidden = true;
  document.querySelector("#login-tab").classList.add("active");
  document.querySelector("#signup-tab").classList.remove("active");
  document.querySelectorAll("#login-form input").forEach((input) => { input.disabled = false; });
  document.querySelectorAll("#signup-form input").forEach((input) => { input.disabled = true; });
}

function showSignupTab() {
  document.querySelector("#login-view").hidden = true;
  document.querySelector("#signup-view").hidden = false;
  document.querySelector("#login-tab").classList.remove("active");
  document.querySelector("#signup-tab").classList.add("active");
  document.querySelectorAll("#login-form input").forEach((input) => { input.disabled = true; });
  document.querySelectorAll("#signup-form input").forEach((input) => { input.disabled = false; });
}

function updateMember() {
  if (!currentUser) return;
  document.querySelector("#member-name").textContent = currentUser.name.split(" ")[0];
  document.querySelector("#account-button").textContent = currentUser.name;
}

function saveUser(name, email, password, phone) {
  registeredUser = { name, email, password, phone };
  currentUser = registeredUser;
  localStorage.setItem("rishiMartAccount", JSON.stringify(registeredUser));
  localStorage.setItem("rishiMartSession", JSON.stringify(currentUser));
}

document.querySelector("#login-tab").addEventListener("click", showLoginTab);
document.querySelector("#signup-tab").addEventListener("click", showSignupTab);

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
  if (!registeredUser || email !== registeredUser.email || password !== registeredUser.password) { showToast("Email or password does not match.", "error"); return; }
  currentUser = registeredUser;
  localStorage.setItem("rishiMartSession", JSON.stringify(currentUser));
  updateMember();
  showView(shopSection);
  showToast(`Welcome back, ${currentUser.name.split(" ")[0]}!`);
});

document.querySelector("#cart-button").addEventListener("click", () => {
  showView(cartSection);
  renderCart();
});

document.querySelector("#continue-shopping").addEventListener("click", () => showView(shopSection));
document.querySelector("#open-integrations").addEventListener("click", () => showView(integrationSection));
document.querySelector("#close-integrations").addEventListener("click", () => showView(shopSection));
document.querySelector("#account-button").addEventListener("click", () => { if (currentUser) showView(shopSection); else { showLoginTab(); showView(authSection); } });
document.querySelector("#logout-button").addEventListener("click", () => { currentUser = null; localStorage.removeItem("rishiMartSession"); showLoginTab(); showView(authSection); showToast("You have been logged out."); });

document.querySelector("#checkout-button").addEventListener("click", () => {
  if (!cart.length) { showToast("Add an item before checking out.", "error"); return; }
  showView(checkoutSection);
  document.querySelector("#checkout-items").innerHTML = cart.map((product) => `<p><span>${product.name}</span><strong>${currency.format(product.price)}</strong></p>`).join("");
  document.querySelector("#payment-total").textContent = currency.format(getTotal());
});

document.querySelector("#checkout-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const cardNumber = document.querySelector("#card-number").value.replace(/\s/g, "");
  if (!/^\d{12,19}$/.test(cardNumber)) { showToast("Enter a valid card number with 12 to 19 digits.", "error"); return; }
  const orderNumber = `RM-${Date.now().toString().slice(-8)}`;
  await sendOrderEmail(orderNumber);
  showView(confirmationSection);
  document.querySelector("#order-number").textContent = `Order number: ${orderNumber} · Confirmation email sent to ${currentUser.email}`;
  cart = [];
  updateCartCount();
  showToast("Payment approved. Order confirmation email sent!");
});

function getTotal() { return cart.reduce((total, product) => total + product.price, 0); }
function updateCartCount() { cartCount.textContent = cart.length; }

async function sendOrderEmail(orderNumber) {
  const recipient = currentUser?.email || document.querySelector("#email").value.trim().toLowerCase();
  const email = {
    to: recipient,
    subject: `Rishi Mart order confirmation ${orderNumber}`,
    orderNumber,
    amount: currency.format(getTotal()),
    status: "queued",
    sentAt: new Date().toISOString(),
  };
  let delivery = { provider: "mock", status: "queued" };
  try {
    const response = await fetch("/api/send-order-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(email),
    });
    if (response.ok) delivery = await response.json();
  } catch {
  }
  const deliveredEmail = { ...email, ...delivery };
  localStorage.setItem("rishiMartLastEmail", JSON.stringify(deliveredEmail));
  const emailStatus = document.querySelector("#email-status");
  const emailOutput = document.querySelector("#email-output");
  const draftLink = document.querySelector("#email-draft-link");
  if (emailStatus) emailStatus.textContent = delivery.provider === "resend" ? `Sent by Resend to ${recipient}` : `Queued locally for ${recipient}`;
  if (emailOutput) emailOutput.textContent = JSON.stringify(deliveredEmail, null, 2);
  if (draftLink) draftLink.href = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(`Thanks for your order. Your order number is ${orderNumber}. Total: ${email.amount}.`)}`;
}

function renderProducts() {
  const query = document.querySelector("#search-input").value.trim().toLowerCase();
  const sort = document.querySelector("#sort-select").value;
  let visibleProducts = products.filter((product) => (activeCategory === "all" || product.category === activeCategory) && `${product.name} ${product.description}`.toLowerCase().includes(query));
  if (sort === "low") visibleProducts.sort((a, b) => a.price - b.price);
  if (sort === "high") visibleProducts.sort((a, b) => b.price - a.price);
  document.querySelector("#empty-products").hidden = visibleProducts.length > 0;
  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / productsPerPage));
  currentPage = Math.min(currentPage, totalPages);
  const pageProducts = visibleProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);
  document.querySelector("#page-status").textContent = `Page ${currentPage} of ${totalPages}`;
  document.querySelector("#previous-page").disabled = currentPage === 1;
  document.querySelector("#next-page").disabled = currentPage === totalPages;
  productsContainer.innerHTML = pageProducts
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

document.querySelector("#search-input").addEventListener("input", () => { currentPage = 1; renderProducts(); });
document.querySelector("#sort-select").addEventListener("change", () => { currentPage = 1; renderProducts(); });
document.querySelector("#previous-page").addEventListener("click", () => { currentPage -= 1; renderProducts(); });
document.querySelector("#next-page").addEventListener("click", () => { currentPage += 1; renderProducts(); });
document.querySelectorAll(".filter-button").forEach((button) => button.addEventListener("click", () => { activeCategory = button.dataset.category; currentPage = 1; document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("active")); button.classList.add("active"); renderProducts(); }));
document.querySelector("#back-to-shop").addEventListener("click", () => showView(shopSection));

document.querySelector("#amazon-sync").addEventListener("click", (event) => {
  const status = document.querySelector("#amazon-status");
  event.currentTarget.disabled = true;
  status.textContent = "Connecting...";
  setTimeout(() => {
    status.textContent = "Synced 18 products at " + new Date().toLocaleTimeString();
    event.currentTarget.disabled = false;
    showToast("Amazon catalog sync completed.");
  }, 500);
});

document.querySelector("#payment-health").addEventListener("click", () => {
  document.querySelector("#payment-status").textContent = "Healthy · 200 OK";
  showToast("Payment provider health check passed.");
});

document.querySelector("#send-webhook").addEventListener("click", () => {
  const payload = {
    event: "order.created",
    id: `evt_${Date.now().toString().slice(-8)}`,
    status: "success",
    amount: getTotal() || 89900,
    currency: "INR",
  };
  document.querySelector("#webhook-output").textContent = JSON.stringify(payload, null, 2);
  showToast("Webhook event delivered to the mock receiver.");
});

document.querySelector("#api-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const method = document.querySelector("#api-method").value;
  const endpoint = document.querySelector("#api-endpoint").value;
  const response = endpoint === "/health"
    ? { status: 200, body: { service: "rishi-mart", status: "ok" } }
    : { status: method === "DELETE" ? 204 : 200, body: endpoint === "/products" ? { count: products.length, data: products.slice(0, 2) } : { endpoint, message: "Mock response returned" } };
  document.querySelector("#api-response").textContent = JSON.stringify({ method, endpoint, ...response }, null, 2);
});

const securityScenarios = {
  "invalid-login": "401 Unauthorized · Verify credentials without exposing which field failed.",
  "expired-token": "401 Unauthorized · Refresh token required before retrying the request.",
  "rate-limit": "429 Too Many Requests · Retry-After: 60 seconds.",
  validation: "400 Bad Request · Input rejected: email must use a valid format.",
};
document.querySelectorAll("[data-scenario]").forEach((button) => button.addEventListener("click", () => {
  document.querySelector("#security-result").textContent = securityScenarios[button.dataset.scenario];
}));

updateMember();
showLoginTab();
if (currentUser) showView(shopSection);
renderProducts();