
let cart = [];
function addToCart(item) {
  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}
function renderCart() {
  let cartItems = document.getElementById('cartItems');
  cartItems.innerHTML = '';
  cart.forEach((item, index) => {
    let li = document.createElement('li');
    li.textContent = item;
    cartItems.appendChild(li);
  });
  document.getElementById('cartDrawer').style.display = 'block';
}
function checkout() {
  let message = encodeURIComponent("Halo, saya ingin checkout produk berikut: " + cart.join(", "));
  window.open("https://wa.me/6281234567890?text=" + message, "_blank");
}
