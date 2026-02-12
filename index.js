<<<<<<< HEAD
let bg = document.getElementById("bg");
let cartLength = document.getElementById("cart-length");
let search = document.getElementById("search");
let Logout = document.getElementById("logout");
let allProducts;

// Redirect to login if user is not logged in
if (localStorage.getItem("login_user") == null) {
    location.replace("login.html");
}

// ----------------------------
// Function to get cart details for the currently logged-in user
// ----------------------------
function getCartDetails() {
    let data = localStorage.getItem("cart");
    if (!data) return []; // If no cart in localStorage, return empty array

    let cartData = JSON.parse(data);

    // Filter only the cart items for the logged-in user
    return cartData.filter(item => item.userId === localStorage.getItem("login_user"));
}

// ----------------------------
// Function to save/update cart for all users in localStorage
// ----------------------------
function saveCartForUser(cartForCurrentUser) {
    let data = localStorage.getItem("cart");
    let allCart = data ? JSON.parse(data) : [];

    // Remove old entries for this user
    allCart = allCart.filter(item => item.userId !== localStorage.getItem("login_user"));

    // Add updated cart for this user
    allCart = allCart.concat(cartForCurrentUser);

    // Save back to localStorage
    localStorage.setItem("cart", JSON.stringify(allCart));
}

// Get current user's cart
let data = getCartDetails();
cartLength.textContent = "Cart(" + data.length + ")";

// ----------------------------
// Function to create product cards dynamically
// ----------------------------
function CreateProductCard(products) {
    for (let product of products) {
        let a = document.createElement("a");
        a.href = "singleProduct.html"; // Redirect to single product page
        bg.appendChild(a);

        let div = document.createElement("div");
        a.appendChild(div);

        // Product image
        let img = document.createElement("img");
        img.src = product.image;
        div.appendChild(img);

        // Product title
        let h1 = document.createElement("h1");
        h1.textContent = product.title;
        div.appendChild(h1);

        // Product description
        let p = document.createElement("p");
        p.textContent = product.description;
        div.appendChild(p);

        // Product price
        let h2 = document.createElement("h2");
        h2.textContent = "Price: $" + product.price;
        div.appendChild(h2);

        // Product rating
        let h3 = document.createElement("h3");
        h3.textContent = "Rating: " + product.rating.rate;
        div.appendChild(h3);

        // Store clicked product ID in localStorage for single product page
        div.onclick = function () {
            localStorage.setItem("productId", product.id);
        };
    }
}

// ----------------------------
// Fetch all products from API
// ----------------------------
async function getData() {
    try {
        if (localStorage.getItem("login_user") == null) {
            location.replace("login.html");
        }

        let res = await fetch("https://fakestoreapi.com/products");
        let jsonRes = await res.json();
        allProducts = jsonRes;

        CreateProductCard(jsonRes);
    } catch (error) {
        console.log(error);
    }
}

getData();

// ----------------------------
// Centralized search function
// ----------------------------
function handleSearch() {
    let query = search.value.trim().toLowerCase();
    bg.textContent = ""; // Clear current display

    if (query === "") {
        // Show all products if search box is empty
        if (allProducts) {
            CreateProductCard(allProducts);
        }
        return;
    }

    // Filter products based on search query
    let filteredData = allProducts.filter(product => {
        return product.title.toLowerCase().includes(query);
    });

    if (filteredData.length === 0) {
        let h1 = document.createElement("h1");
        h1.textContent = "No Products Found!";
        h1.style.width = "100%";
        h1.style.textAlign = "center";
        h1.style.fontSize = "18px";
        bg.appendChild(h1);
    } else {
        CreateProductCard(filteredData);
    }
}

// ----------------------------
// Listen to search input events
// ----------------------------
search.addEventListener("keyup", handleSearch);
search.addEventListener("input", handleSearch);

// ----------------------------
// Logout functionality
// ----------------------------
Logout.onclick = function () {
    localStorage.removeItem("login_user");
    location.replace("login.html");
};

// ----------------------------
// Example: Adding product to cart
// This function should be called from single product page
// ----------------------------
function addToCart(product) {
    let cartForUser = getCartDetails(); // get current user's cart
    product.userId = localStorage.getItem("login_user"); // mark product with user
    cartForUser.push(product);

    // Save cart back per user
    saveCartForUser(cartForUser);

    // Update cart length display
    cartLength.textContent = "Cart(" + cartForUser.length + ")";
=======
let time = 0;
let timer = null;
let number = "";

const numberEl = document.getElementById("number");
const timeEl = document.getElementById("time");
const statusEl = document.getElementById("status");

function insertCoin() {
  time += 60;
  updateTime();
  statusEl.textContent = "₹1 coin accepted. Time added!";
}

function pressKey(key) {

  // * key
  if (key === '*') {
    if (timer) {
      endCall();
      return;
    }

    // Before call ---->  clear number
    number = "";
    numberEl.textContent = "";
    statusEl.textContent = "❌ Number cleared";
    return;
  }

  // # key -----> start call
  if (key === '#') {
    if (!timer) startCall();
    return;
  }

  // Disable input during call
  if (timer) return;

  // Allow only digits
  if (key < '0' || key > '9') return;
  if (number.length >= 10) return;

  number += key;
  numberEl.textContent = number;
}


// Indian mobile number validation
function isValidIndianMobile(num) {
  return (
    num.length === 10 &&
    !isNaN(num) &&
    (
      num.startsWith('6') ||
      num.startsWith('7') ||
      num.startsWith('8') ||
      num.startsWith('9')
    )
  );
}

function startCall() {
  // Only start if number is valid and timer not running
  if (!isValidIndianMobile(number)) {
    alert("Please enter a valid Indian mobile number (starts with 6/7/8/9)");
    return;
  }

  if (time <= 0) {
    alert("Insert ₹1 coin to start the call");
    return;
  }

  if (timer) return; // Prevent double start

  // Show call state ONLY in number box
  numberEl.textContent = "📞 Call Connected";
  statusEl.textContent = ""; // Clear status to avoid duplication

  timer = setInterval(() => {
    time--;
    updateTime();

    if (time <= 0) {
      endCall();
    }
  }, 1000);
}

function endCall() {
  clearInterval(timer);
  timer = null;
  time = 0;
  updateTime();

  number = "";

  // Show END message ONLY in number box
  numberEl.textContent = "⛔ Call Ended";

  // Clear status box to avoid duplication
  statusEl.textContent = "";
}

function updateTime() {
  const min = Math.floor(time / 60);
  const sec = time % 60;

  timeEl.textContent =
    min + ":" + (sec < 10 ? "0" + sec : sec);
>>>>>>> a8ce337915facdaf71e5b33275e7fd2040d18d66
}
