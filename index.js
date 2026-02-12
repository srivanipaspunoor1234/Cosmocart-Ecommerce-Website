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
}
