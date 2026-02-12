let productBg = document.getElementById("product-bg");
let cartLength = document.getElementById("cart-length");
let search = document.getElementById("search");

let allProducts;
let firstOpenedProduct = null;  // Store the first single product opened
let currentSingleProduct = null; // Store the last displayed product

// ----------------------------
// Redirect if not logged in
// ----------------------------
if (localStorage.getItem("login_user") == null) {
    location.replace("login.html");
}

// ----------------------------
// Get cart items for the currently logged-in user
// ----------------------------
function getCartDetails() {
    let data = localStorage.getItem("cart");
    if (!data) return [];

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

// ----------------------------
// Initialize cart for this user
// ----------------------------
let cart = getCartDetails();
let count = cart.length;
cartLength.textContent = "Cart(" + count + ")";

// ----------------------------
// Display a single product card
// ----------------------------
function singleproductInteface(product) {
    let div = document.createElement("div");
    productBg.appendChild(div);

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
    button.textContent = "Add To Cart";
    div.appendChild(button);

    // ----------------------------
    // Add to Cart functionality
    // ----------------------------
    button.onclick = () => {
        // Create a copy with userId
        let productCopy = { ...product, userId: localStorage.getItem("login_user") };

        // Add to current user's cart
        cart.push(productCopy);
        saveCartForUser(cart);

        // Update cart count display
        count++;
        cartLength.textContent = "Cart(" + count + ")";
    };

    // Set first opened product if not already set
    if (!firstOpenedProduct) firstOpenedProduct = product;

    // Always update current displayed product
    currentSingleProduct = product;
}

// ----------------------------
// Fetch single product from API
// ----------------------------
async function getSingleProduct() {
    try {
        let id = localStorage.getItem("productId");
        let res = await fetch("https://fakestoreapi.com/products/" + id);
        let jsonRes = await res.json();
        singleproductInteface(jsonRes);
    } catch (error) {
        console.log(error);
    }
}
getSingleProduct();

// ----------------------------
// Fetch all products for search functionality
// ----------------------------
async function getAllProducts() {
    try {
        let res = await fetch("https://fakestoreapi.com/products");
        let jsonRes = await res.json();
        allProducts = jsonRes;
    } catch (error) {
        console.log(error);
    }
}
getAllProducts();

// ----------------------------
// Centralized function to handle search/filter
// ----------------------------
function handleSearch() {
    let query = search.value.trim().toLowerCase();
    productBg.textContent = ""; // Clear current display

    if (query === "") {
        // If search box is empty or cleared, show the first opened product
        if (firstOpenedProduct) singleproductInteface(firstOpenedProduct);
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
        productBg.appendChild(h1);
    } else {
        filteredData.forEach(product => {
            singleproductInteface(product);
        });
    }
}

// ----------------------------
// Listen to search input events
// ----------------------------
search.addEventListener("keyup", handleSearch);
search.addEventListener("input", handleSearch);
