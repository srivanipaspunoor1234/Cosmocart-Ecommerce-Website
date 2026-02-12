let bg = document.getElementById("bg");

// Redirect to login if not logged in
if (localStorage.getItem("login_user") == null) {
  location.replace("login.html");
}

// ----------------------------
// Get cart items for the currently logged-in user
// ----------------------------
function getCartDetails() {
  let data = localStorage.getItem("cart");
  if (!data) return []; // return empty if no cart

  let cartData = JSON.parse(data);

  // Filter only items belonging to the logged-in user
  return cartData.filter(i => i.userId === localStorage.getItem("login_user"));
}

// ----------------------------
// Save cart for current user (without affecting other users' carts)
// ----------------------------
function saveCartForUser(cartForCurrentUser) {
  let data = localStorage.getItem("cart");
  let allCart = data ? JSON.parse(data) : [];

  // Remove old cart items for this user
  allCart = allCart.filter(item => item.userId !== localStorage.getItem("login_user"));

  // Add updated cart for this user
  allCart = allCart.concat(cartForCurrentUser);

  // Save back to localStorage
  localStorage.setItem("cart", JSON.stringify(allCart));
}

let cart = getCartDetails(); // current user's cart

// ----------------------------
// Function to create a single product card
// ----------------------------
function createProductCard(product) {

  let div = document.createElement("div");
  bg.appendChild(div);

  let img = document.createElement("img");
  img.src = product.image;
  div.appendChild(img);

  let h1 = document.createElement("h1");
  h1.textContent = product.title;
  div.appendChild(h1);

  let p = document.createElement("p");
  p.textContent = product.description;
  div.appendChild(p);

  let h2 = document.createElement("h2");
  h2.textContent = "Price: $" + product.price;
  div.appendChild(h2);

  let h3 = document.createElement("h3");
  h3.textContent = "Rating: " + product.rating.rate;
  div.appendChild(h3);

  let button = document.createElement("button");
  button.textContent = "Delete";
  div.appendChild(button);

  // ----------------------------
  // Delete functionality
  // ----------------------------
  button.onclick = () => {
    // Remove item from current user's cart
    let index = cart.indexOf(product);
    cart.splice(index, 1);

    // Save updated cart for this user
    saveCartForUser(cart);

    // Clear and re-render all cards
    bg.textContent = "";
    for (let i of cart) {
      createProductCard(i);
    }

    // Update total after deletion
    addTotalAndPlaceOrder();

    // Show empty message if cart is empty
    if (cart.length == 0) {
      let h1 = document.createElement("h1");
      h1.textContent = "Your Cart Is Empty";
      bg.appendChild(h1);
      bg.style.display = "flex";
      bg.style.justifyContent = "center";
      bg.style.alignItems = "center";
    }
  };
}

// ----------------------------
// Render initial product cards
// ----------------------------
if (cart.length == 0) {
  let h1 = document.createElement("h1");
  h1.textContent = "Your Cart Is Empty!";
  bg.appendChild(h1);
  bg.style.display = "flex";
  bg.style.justifyContent = "center";
  bg.style.alignItems = "center";
} else {
  for (let product of cart) {
    createProductCard(product);
  }

  // Add total price + Place Order button
  addTotalAndPlaceOrder();
}

// ----------------------------
// Function to create Total + Place Order section
// ----------------------------
function addTotalAndPlaceOrder() {
  // Remove previous total section if exists
  let existingTotal = document.getElementById("total-section");
  if (existingTotal) existingTotal.remove();

  if (cart.length === 0) return; // Do nothing if cart empty

  let totalDiv = document.createElement("div");
  totalDiv.id = "total-section";
  totalDiv.style.width = "100%";
  totalDiv.style.marginTop = "20px";
  totalDiv.style.textAlign = "center";

  // Total price
  let totalPrice = document.createElement("h2");
  totalPrice.textContent = "Total: $" + cart.reduce((sum, p) => sum + p.price, 0).toFixed(2);
  totalPrice.style.marginBottom = "10px";
  totalDiv.appendChild(totalPrice);

  // Place Order button
  let placeOrderBtn = document.createElement("button");
  placeOrderBtn.textContent = "Place Order";
  totalDiv.appendChild(placeOrderBtn);

  // ----------------------------
  // Place Order functionality
  // ----------------------------
  placeOrderBtn.onclick = () => {
    // Clear current user's cart
    cart = [];
    saveCartForUser(cart);

    // Redirect to order success page
    localStorage.setItem("orderPlaced", "true");
    window.location.href = "orderStatus.html";
  };

  bg.appendChild(totalDiv);
}
