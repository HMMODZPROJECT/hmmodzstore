const products = [
  { 
    id: 1,
    name: "Injection Device Pro",
    price: 35000,
    category: "game",
    image: "InjectionDevice.jpg",
    description: "Tool injeksi premium dengan fitur anti-detect dan bypass security terbaru",
    features: ["Anti-Detection", "Bypass Security", "Auto Update", "24/7 Support"]
  },
  { 
    id: 2,
    name: "FC Mobile Auto Win",
    price: 25000,
    category: "game",
    image: "FcMobile.jpg",
    description: "Script auto win untuk FC Mobile dengan win rate 90%+ dan fitur custom",
    features: ["90% Win Rate", "Anti-Ban", "Custom Settings", "Easy Setup"]
  },
  { 
    id: 3,
    name: "PUBG Mobile Hack V5",
    price: 30000,
    category: "game",
    image: "PubgMobile.jpg",
    description: "Hack PUBG terbaru dengan wallhack, aimbot, dan fitur premium lainnya",
    features: ["Wallhack", "No Recoil", "hologram"]
  },
  { 
    id: 4,
    name: "Android Optimizer Pro",
    price: 25000,
    category: "tool",
    image: "OptimalAndroid.jpg",
    description: "Tool optimasi Android untuk gaming dengan performa maksimal",
    features: ["RAM Optimizer", "CPU Booster", "Game Mode", "Battery Saver"]
  },
  { 
    id: 5,
    name: "Design Picture Premium",
    price: 20000,
    category: "design",
    image: "Editing.jpg",
    description: "Layanan design grafis profesional untuk kebutuhan visual Anda",
    features: ["Custom Design", "Quick Delivery", "Unlimited Revisi", "HD Quality"]
  },
  { 
    id: 6,
    name: "Video Editor Pro",
    price: 28000,
    category: "design",
    image: "Editing.jpg",
    description: "Software editing video dengan efek premium dan transisi profesional",
    features: ["Pro Effects", "4K Support", "Audio Editor", "Templates"]
  },
  { 
    id: 7,
    name: "Ransonware apps",
    price: 45000,
    category: "tool",
    image: "Ransomware.jpg",
    description: "aplikasi dengan system malware attack system yang merusak system Android",
    features: ["Destroy System", "No Encryption", "File Lock", "Data Deleted"]
  }
];


let cart = [];
let currentFilter = 'all';
let isCartOpen = false;


const cartPanel = document.getElementById('cartPanel');
const overlay = document.getElementById('overlay');
const cartCount = document.getElementById('cartCount');
const searchInput = document.getElementById('searchInput');


document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  
 
  searchInput.addEventListener('input', debounce(() => {
    const searchTerm = searchInput.value.toLowerCase();
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) || 
      product.description.toLowerCase().includes(searchTerm)
    );
    renderProducts(currentFilter, filtered);
  }, 300));
});


function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}


function renderProducts(category = 'all', searchResults = null) {
  const productList = document.getElementById('product-list');
  const productsToRender = searchResults || products;
  
  let filtered = productsToRender;
  if (category !== 'all') {
    filtered = productsToRender.filter(p => p.category === category);
  }

  productList.innerHTML = '';
  
  if (filtered.length === 0) {
    productList.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem;"></i>
        <p>Tidak ada produk yang ditemukan</p>
      </div>
    `;
    return;
  }

  filtered.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="description">${product.description}</p>
        <div class="features">
          ${product.features.map(feature => 
            `<span class="feature"><i class="fas fa-check"></i> ${feature}</span>`
          ).join('')}
        </div>
        <p class="price">Rp${product.price.toLocaleString()}</p>
        <button class="btn" onclick="addToCart(${product.id})">
          <i class="fas fa-shopping-cart"></i> Tambah ke Keranjang
        </button>
      </div>
    `;
    productList.appendChild(div);
  });

  
  document.querySelectorAll('.filter-container button').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick').includes(category));
  });
  
  currentFilter = category;
}


function filterProducts(category) {
  renderProducts(category);
}


function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  cart.push({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1
  });

  updateCart();
  showNotification(`✓ ${product.name} ditambahkan ke keranjang`);
}


function updateCart() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  
  cartCount.textContent = cart.length;
  cartItems.innerHTML = '';
  
  let total = 0;
  
  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>Rp${item.price.toLocaleString()}</p>
      </div>
      <div class="cart-item-actions">
        <button onclick="removeFromCart(${index})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    cartItems.appendChild(div);
    total += item.price * item.quantity;
  });
  
  cartTotal.textContent = total.toLocaleString();
}

function removeFromCart(index) {
  const removed = cart[index];
  cart.splice(index, 1);
  updateCart();
  showNotification(`✓ ${removed.name} dihapus dari keranjang`);
}

function toggleCart() {
  isCartOpen = !isCartOpen;
  cartPanel.classList.toggle('active');
  overlay.classList.toggle('active');
  document.body.style.overflow = isCartOpen ? 'hidden' : '';
}


function showNotification(message) {
  const notification = document.getElementById('notification');
  const notificationText = document.getElementById('notificationText');
  
  notificationText.textContent = message;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}


function checkout() {
  if (cart.length === 0) {
    showNotification('❌ Keranjang belanja kosong');
    return;
  }

  let message = "🛒 *Order HM MODZ TEAM*\n\n";
  let total = 0;

  cart.forEach(item => {
    message += `▪️ *${item.name}*\n`;
    message += `   💰 Rp${item.price.toLocaleString()}\n\n`;
    total += item.price * item.quantity;
  });

  message += `\n*Total: Rp${total.toLocaleString()}*\n`;
  message += "\n💬 Mohon konfirmasi pesanan saya";

  const waURL = `https://wa.me/+6287852411934=${encodeURIComponent(message)}`;
  window.open(waURL, '_blank');
}


document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isCartOpen) {
    toggleCart();
  }
});


overlay.addEventListener('click', (e) => {
  if (isCartOpen) {
    toggleCart();
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imageObserver.observe(img));
});


const animateOnScroll = () => {
  const elements = document.querySelectorAll('.product');
  
  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    
    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add('animate');
    }
  });
};

window.addEventListener('scroll', animateOnScroll);
