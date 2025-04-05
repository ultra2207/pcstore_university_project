document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    let currentView = 'home';
    let cart = [];
    let currentProduct = null;
    let filteredProducts = [];
    
    // DOM Elements
    const homeLink = document.getElementById('home-link');
    const categoryLinks = document.querySelectorAll('.category-link');
    const brandLinks = document.querySelectorAll('.brand-link');
    const cartLink = document.getElementById('cart-link');
    const shopNowBtn = document.getElementById('shop-now-btn');
    const categoryCards = document.querySelectorAll('.category-card');
    const featuredProductsContainer = document.getElementById('featured-products-container');
    const productListSection = document.getElementById('product-listing');
    const productListTitle = document.getElementById('product-listing-title');
    const productListContainer = document.getElementById('product-list');
    const productDetailSection = document.getElementById('product-detail');
    const backToProductsBtn = document.getElementById('back-to-products');
    const shoppingCartSection = document.getElementById('shopping-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartShipping = document.getElementById('cart-shipping');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartCount = document.getElementById('cart-count');
    const sortOptions = document.getElementById('sort-options');
    const priceRange = document.getElementById('price-range');
    const priceDisplay = document.getElementById('price-display');
    
    // Initialize the page
    init();
    
    function init() {
        // Display featured products
        displayFeaturedProducts();
        
        // Add event listeners
        addEventListeners();
        
        // Load cart from localStorage if available
        loadCart();
        
        // Update cart count
        updateCartCount();
    }
    
    function addEventListeners() {
        // Navigation events
        homeLink.addEventListener('click', showHome);
        
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const category = this.getAttribute('data-category');
                showProductsByCategory(category);
            });
        });
        
        brandLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const brand = this.getAttribute('data-brand');
                showProductsByBrand(brand);
            });
        });
        
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            showCart();
        });
        
        shopNowBtn.addEventListener('click', function() {
            showProductsByCategory('coolers');
        });
        
        categoryCards.forEach(card => {
            card.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                showProductsByCategory(category);
            });
        });
        
        backToProductsBtn.addEventListener('click', function() {
            if (currentView === 'productsByCategory') {
                const category = productListTitle.getAttribute('data-current-category');
                showProductsByCategory(category);
            } else if (currentView === 'productsByBrand') {
                const brand = productListTitle.getAttribute('data-current-brand');
                showProductsByBrand(brand);
            } else {
                showHome();
            }
        });
        
        checkoutBtn.addEventListener('click', function() {
            checkout();
        });
        
        // Filter events
        sortOptions.addEventListener('change', applyFilters);
        
        priceRange.addEventListener('input', function() {
            priceDisplay.textContent = `$0 - $${this.value}`;
            applyFilters();
        });
    }
    
    function displayFeaturedProducts() {
        const featuredProducts = products.filter(product => product.featured);
        
        featuredProductsContainer.innerHTML = '';
        
        featuredProducts.forEach(product => {
            const productCard = createProductCard(product);
            featuredProductsContainer.appendChild(productCard);
        });
    }
    
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.brand}</p>
                <span class="price">$${product.price.toFixed(2)}</span>
                <div class="product-actions">
                    <button class="view-details" data-id="${product.id}">View Details</button>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
        
        // Add event listeners to buttons
        card.querySelector('.view-details').addEventListener('click', function() {
            showProductDetail(product.id);
        });
        
        card.querySelector('.add-to-cart').addEventListener('click', function() {
            addToCart(product.id);
        });
        
        return card;
    }
    
    function showHome() {
        // Hide all sections
        hideAllSections();
        
        // Show hero and featured products
        document.getElementById('hero-section').style.display = 'flex';
        document.getElementById('featured-products').style.display = 'block';
        document.getElementById('categories-section').style.display = 'block';
        
        currentView = 'home';
    }
    
    function showProductsByCategory(category) {
        // Get products of this category
        filteredProducts = products.filter(product => product.category === category);
        
        // Update product listing title
        productListTitle.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)}`;
        productListTitle.setAttribute('data-current-category', category);
        
        // Display products
        displayFilteredProducts();
        
        // Hide all sections
        hideAllSections();
        
        // Show product listing
        productListSection.style.display = 'block';
        
        currentView = 'productsByCategory';
    }
    
    function showProductsByBrand(brand) {
        // Get products of this brand
        filteredProducts = products.filter(product => product.brand.toLowerCase() === brand.toLowerCase());
        
        // Update product listing title
        productListTitle.textContent = `${brand.charAt(0).toUpperCase() + brand.slice(1)} Products`;
        productListTitle.setAttribute('data-current-brand', brand);
        
        // Display products
        displayFilteredProducts();
        
        // Hide all sections
        hideAllSections();
        
        // Show product listing
        productListSection.style.display = 'block';
        
        currentView = 'productsByBrand';
    }
    
    function displayFilteredProducts() {
        productListContainer.innerHTML = '';
        
        if (filteredProducts.length === 0) {
            productListContainer.innerHTML = '<p class="no-products">No products found.</p>';
            return;
        }
        
        filteredProducts.forEach(product => {
            const productCard = createProductCard(product);
            productListContainer.appendChild(productCard);
        });
    }
    
    function showProductDetail(productId) {
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            return;
        }
        
        currentProduct = product;
        
        const detailContainer = document.querySelector('.product-detail-container');
        
        detailContainer.innerHTML = `
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-detail-info">
                <h2>${product.name}</h2>
                <span class="brand">${product.brand}</span>
                <span class="price">$${product.price.toFixed(2)}</span>
                <p class="description">${product.description}</p>
                <p class="stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                    ${product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </p>
                <div class="quantity-selector">
                    <button id="decrease-quantity">-</button>
                    <input type="number" id="product-quantity" value="1" min="1" max="${product.stock}">
                    <button id="increase-quantity">+</button>
                </div>
                <div class="product-detail-actions">
                    <button id="add-to-cart-detail" ${product.stock <= 0 ? 'disabled' : ''}>Add to Cart</button>
                </div>
            </div>
        `;
        
        // Add event listeners to buttons
        const quantityInput = document.getElementById('product-quantity');
        const decreaseBtn = document.getElementById('decrease-quantity');
        const increaseBtn = document.getElementById('increase-quantity');
        const addToCartBtn = document.getElementById('add-to-cart-detail');
        
        decreaseBtn.addEventListener('click', function() {
            if (parseInt(quantityInput.value) > 1) {
                quantityInput.value = parseInt(quantityInput.value) - 1;
            }
        });
        
        increaseBtn.addEventListener('click', function() {
            if (parseInt(quantityInput.value) < product.stock) {
                quantityInput.value = parseInt(quantityInput.value) + 1;
            }
        });
        
        addToCartBtn.addEventListener('click', function() {
            const quantity = parseInt(quantityInput.value);
            addToCart(product.id, quantity);
        });
        
        // Hide all sections
        hideAllSections();
        
        // Show product detail
        productDetailSection.style.display = 'block';
    }
    
    function showCart() {
        // Update cart display
        updateCartDisplay();
        
        // Hide all sections
        hideAllSections();
        
        // Show cart section
        shoppingCartSection.style.display = 'block';
        
        currentView = 'cart';
    }
    
    function hideAllSections() {
        document.getElementById('hero-section').style.display = 'none';
        document.getElementById('featured-products').style.display = 'none';
        document.getElementById('categories-section').style.display = 'none';
        productListSection.style.display = 'none';
        productDetailSection.style.display = 'none';
        shoppingCartSection.style.display = 'none';
    }
    
    function addToCart(productId, quantity = 1) {
        const product = products.find(p => p.id === productId);
        
        if (!product || product.stock <= 0) {
            return;
        }
        
        // Check if product is already in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            // Ensure we don't exceed stock
            const newQuantity = Math.min(existingItem.quantity + quantity, product.stock);
            existingItem.quantity = newQuantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: Math.min(quantity, product.stock)
            });
        }
        
        // Save cart to localStorage
        saveCart();
        
        // Update cart count
        updateCartCount();
        
        // Show notification
        showNotification(`${product.name} added to cart!`);
    }
    
    function updateCartDisplay() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
            cartSubtotal.textContent = '$0.00';
            cartShipping.textContent = '$0.00';
            cartTotal.textContent = '$0.00';
            return;
        }
        
        let subtotal = 0;
        
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const cartItemHTML = `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h3>${item.name}</h3>
                        <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                    </div>
                    <div class="cart-item-actions">
                        <div class="cart-item-quantity">
                            <button class="decrease-cart-quantity" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase-cart-quantity" data-id="${item.id}" ${item.quantity >= product.stock ? 'disabled' : ''}>+</button>
                        </div>
                        <span class="cart-item-total">$${itemTotal.toFixed(2)}</span>
                        <button class="remove-from-cart" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            `;
            
            cartItemsContainer.innerHTML += cartItemHTML;
        });
        
        // Add event listeners to cart item buttons
        document.querySelectorAll('.decrease-cart-quantity').forEach(btn => {
            btn.addEventListener('click', function() {
                updateCartItemQuantity(this.getAttribute('data-id'), -1);
            });
        });
        
        document.querySelectorAll('.increase-cart-quantity').forEach(btn => {
            btn.addEventListener('click', function() {
                updateCartItemQuantity(this.getAttribute('data-id'), 1);
            });
        });
        
        document.querySelectorAll('.remove-from-cart').forEach(btn => {
            btn.addEventListener('click', function() {
                removeFromCart(this.getAttribute('data-id'));
            });
        });
        
        // Calculate shipping and total
        let shipping = subtotal > 0 ? 10 : 0;
        let total = subtotal + shipping;
        
        // Free shipping for orders over $100
        if (subtotal >= 100) {
            shipping = 0;
            total = subtotal;
        }
        
        // Update summary
        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        cartShipping.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    function updateCartItemQuantity(productId, change) {
        const cartItem = cart.find(item => item.id === productId);
        const product = products.find(p => p.id === productId);
        
        if (!cartItem || !product) {
            return;
        }
        
        // Update quantity
        cartItem.quantity += change;
        
        // Ensure quantity is within limits
        if (cartItem.quantity < 1) {
            removeFromCart(productId);
            return;
        }
        
        if (cartItem.quantity > product.stock) {
            cartItem.quantity = product.stock;
        }
        
        // Save cart and update display
        saveCart();
        updateCartDisplay();
        updateCartCount();
    }
    
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        
        // Save cart and update display
        saveCart();
        updateCartDisplay();
        updateCartCount();
    }
    
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = count;
    }
    
    function saveCart() {
        localStorage.setItem('sivasaipc_cart', JSON.stringify(cart));
    }
    
    function loadCart() {
        const savedCart = localStorage.getItem('sivasaipc_cart');
        
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    }
    
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Add active class to animate in
        setTimeout(() => {
            notification.classList.add('active');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    function applyFilters() {
        const sortValue = sortOptions.value;
        const maxPrice = parseInt(priceRange.value);
        
        // Apply price filter
        let filtered = filteredProducts.filter(product => product.price <= maxPrice);
        
        // Apply sorting
        switch (sortValue) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }
        
        // Update display
        productListContainer.innerHTML = '';
        
        if (filtered.length === 0) {
            productListContainer.innerHTML = '<p class="no-products">No products match your filters.</p>';
            return;
        }
        
        filtered.forEach(product => {
            const productCard = createProductCard(product);
            productListContainer.appendChild(productCard);
        });
    }
    
    function checkout() {
        if (cart.length === 0) {
            showNotification('Your cart is empty.');
            return;
        }
        
        window.location.href = 'payment.html';
    }
    
});
