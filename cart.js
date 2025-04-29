// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to all add-to-cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            
            addToCart(productId, productName, productPrice);
            updateCartCount();
            
            // Show confirmation message
            showAddedToCartMessage(productName);
            
            // Animation effect
            this.classList.add('added');
            setTimeout(() => {
                this.classList.remove('added');
            }, 1000);
        });
    });
    
    // Update cart count on page load
    updateCartCount();
    
    // If we're on the cart page, load the cart contents
    if (isCartPage()) {
        loadCart();
    }
});

// Helper function to check if we're on the cart page
function isCartPage() {
    return window.location.href && window.location.href.includes('cart.html');
}

function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Get product image path
        let imagePath = "images/placeholder.png"; // Changed from API placeholder
        
        // Try to determine a more specific image path based on product ID
        if (id.includes('watch')) {
            imagePath = "images/watches/watchfront.png";
        } else if (id.includes('chain')) {
            imagePath = "images/chain/chain.png";
        } else if (id.includes('pendant')) {
            imagePath = "images/pendant/Pendant.png";
        }
        
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1,
            image: imagePath
        });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
}

function loadCart() {
    console.log("loadCart function called");
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) {
        console.log("cart-items element not found");
        return; // Not on the cart page
    }
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log("Cart data from localStorage:", cart);
    
    // Check if empty-cart element exists
    const emptyCartElement = document.querySelector('.empty-cart');
    if (!emptyCartElement) {
        console.log("empty-cart element not found");
        // Create the empty cart message if it doesn't exist
        const emptyCartMsg = document.createElement('div');
        emptyCartMsg.className = 'empty-cart';
        emptyCartMsg.textContent = 'Your cart is empty';
        cartItems.appendChild(emptyCartMsg);
    }
    
    // Show empty cart message if cart is empty
    if (cart.length === 0) {
        console.log("Cart is empty");
        document.querySelector('.empty-cart').style.display = 'block';
        
        // Check if checkout button exists before trying to disable it
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.disabled = true;
        }
        
        updateOrderSummary(0);
        return;
    }
    
    // Hide empty cart message and show items
    document.querySelector('.empty-cart').style.display = 'none';
    
    // Check if checkout button exists before trying to enable it
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = false;
    }
    
    // Clear previous items
    const emptyCartEl = document.querySelector('.empty-cart');
    while (cartItems.firstChild && (!emptyCartEl || cartItems.firstChild !== emptyCartEl)) {
        cartItems.removeChild(cartItems.firstChild);
    }
    
    // Add each item to the cart
    let subtotal = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image || 'images/placeholder.png'}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="item-price">$${item.price.toLocaleString()}</p>
                <div class="quantity-control">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
            </div>
            <div class="cart-item-total">
                <p>$${itemTotal.toLocaleString()}</p>
                <button class="remove-btn" data-id="${item.id}">×</button>
            </div>
        `;
        
        const emptyCart = document.querySelector('.empty-cart');
        if (emptyCart) {
            cartItems.insertBefore(cartItem, emptyCart);
        } else {
            cartItems.appendChild(cartItem);
        }
    });
    
    // Add event listeners to quantity buttons and remove buttons
    const minusButtons = document.querySelectorAll('.quantity-btn.minus');
    const plusButtons = document.querySelectorAll('.quantity-btn.plus');
    const removeButtons = document.querySelectorAll('.remove-btn');
    
    minusButtons.forEach(button => {
        button.addEventListener('click', function() {
            updateQuantity(this.getAttribute('data-id'), -1);
        });
    });
    
    plusButtons.forEach(button => {
        button.addEventListener('click', function() {
            updateQuantity(this.getAttribute('data-id'), 1);
        });
    });
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            removeFromCart(this.getAttribute('data-id'));
        });
    });
    
    // Update order summary
    updateOrderSummary(subtotal);
}

function updateQuantity(id, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id === id);
    
    if (index !== -1) {
        cart[index].quantity += change;
        
        // Remove item if quantity is 0 or less
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Reload cart
        loadCart();
        updateCartCount();
    }
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id === id);
    
    if (index !== -1) {
        // Get the name for the confirmation message
        const productName = cart[index].name;
        
        // Remove the item
        cart.splice(index, 1);
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Show removed message
        showRemovedFromCartMessage(productName);
        
        // Reload cart
        loadCart();
        updateCartCount();
    }
}

function updateOrderSummary(subtotal) {
    const subtotalElement = document.getElementById('subtotal');
    if (!subtotalElement) return; // Not on the cart page
    
    // Calculate shipping and tax
    const shipping = subtotal > 0 ? 50 : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    // Update display
    subtotalElement.textContent = `$${subtotal.toLocaleString()}`;
    
    const shippingElement = document.getElementById('shipping');
    if (shippingElement) {
        shippingElement.textContent = `$${shipping.toLocaleString()}`;
    }
    
    const taxElement = document.getElementById('tax');
    if (taxElement) {
        taxElement.textContent = `$${tax.toLocaleString()}`;
    }
    
    const totalElement = document.getElementById('total');
    if (totalElement) {
        totalElement.textContent = `$${total.toLocaleString()}`;
    }
}

function showAddedToCartMessage(productName) {
    // Create message element if it doesn't exist
    let messageContainer = document.querySelector('.cart-message-container');
    
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.className = 'cart-message-container';
        document.body.appendChild(messageContainer);
    }
    
    const message = document.createElement('div');
    message.className = 'cart-message added';
    message.innerHTML = `
        <div class="cart-message-icon">✓</div>
        <div class="cart-message-text">
            <p><strong>${productName}</strong> has been added to your cart</p>
            <a href="cart.html" class="view-cart-link">View Cart</a>
        </div>
        <button class="cart-message-close">×</button>
    `;
    
    messageContainer.appendChild(message);
    
    // Add event listener to close button
    message.querySelector('.cart-message-close').addEventListener('click', function() {
        message.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 5000);
}

function showRemovedFromCartMessage(productName) {
    // Create message element if it doesn't exist
    let messageContainer = document.querySelector('.cart-message-container');
    
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.className = 'cart-message-container';
        document.body.appendChild(messageContainer);
    }
    
    const message = document.createElement('div');
    message.className = 'cart-message removed';
    message.innerHTML = `
        <div class="cart-message-icon">✓</div>
        <div class="cart-message-text">
            <p><strong>${productName}</strong> has been removed from your cart</p>
        </div>
        <button class="cart-message-close">×</button>
    `;
    
    messageContainer.appendChild(message);
    
    // Add event listener to close button
    message.querySelector('.cart-message-close').addEventListener('click', function() {
        message.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 5000);
}

// Directly load cart if we're on the cart.html page - this is a failsafe
if (window.location.href.includes('cart.html')) {
    console.log("Direct check for cart.html page - attempting to load cart");
    setTimeout(() => {
        loadCart();
    }, 500); // Small delay to ensure DOM is fully loaded
} 