$(document).ready(clearCartToLocalStorage());
function clearCartToLocalStorage() {
    cart = {};
    localStorage.setItem('cart', JSON.stringify(cart));
}