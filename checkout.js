const checkoutItems = document.getElementById("checkoutItems");
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutForm = document.getElementById("checkoutForm");
const successModal = document.getElementById("successModal");
const successMessage = document.getElementById("successMessage");
const rupees = amount => `₹${Number(amount).toLocaleString("en-IN")}`;
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));

let orderItems = [];
try {
    const storedCart = JSON.parse(localStorage.getItem("ecomstoreCart") || "[]");
    orderItems = Array.isArray(storedCart) ? storedCart.filter(item =>
        item && typeof item.name === "string" && Number(item.price) > 0 && Number(item.quantity) > 0
    ) : [];
} catch {
    orderItems = [];
}

if (!orderItems.length) {
    checkoutItems.innerHTML = '<p class="checkout-empty">Your cart is empty. <a href="index.html">Return to the store</a>.</p>';
    checkoutForm.querySelector("button[type=submit]").disabled = true;
} else {
    checkoutItems.innerHTML = orderItems.map(item => `
        <div class="order-line"><span>${escapeHTML(item.name)} <small>× ${Number(item.quantity)}</small></span><strong>${rupees(Number(item.price) * Number(item.quantity))}</strong></div>
    `).join("");
    checkoutTotal.textContent = rupees(orderItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0));
}

checkoutForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!orderItems.length || !checkoutForm.reportValidity()) return;
    const orderNumber = `EC-${Date.now().toString().slice(-8)}`;
    successMessage.textContent = `Thanks, ${checkoutForm.elements.name.value.trim()}! Your demo order ${orderNumber} is confirmed.`;
    localStorage.removeItem("ecomstoreCart");
    successModal.classList.remove("hidden");
});
