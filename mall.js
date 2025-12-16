/* =======================
   AUTH & ROOT ELEMENTS
======================= */
const container = document.getElementById('container');
const signUpBtn = document.getElementById('signUp');
const signInBtn = document.getElementById('signIn');
const authRoot = document.getElementById('auth-root');
const appRoot = document.getElementById('app-root');

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

/* =======================
   NAVIGATION & PAGES
======================= */
const topnavBtns = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');

const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');

const logoutBtn = document.getElementById('logoutBtn');
const adminPanelBtn = document.getElementById('adminPanelBtn');
const pageAdminLogin = document.getElementById('page-admin-login');

/* =======================
   ADMIN
======================= */
const adminLoginForm = document.getElementById('adminLoginForm');
const adminAddForm = document.getElementById('adminAddForm');
const adminProdList = document.getElementById('adminProdList');

/* =======================
   BUY MODAL
======================= */
const buyModal = document.getElementById('buyModal');
const closeBuyModal = document.getElementById('closeBuyModal');
const orderForm = document.getElementById('orderForm');
const orderItemEl = document.getElementById('order-item');
const orderTitle = document.getElementById('orderTitle');

/* =======================
   STATE
======================= */
let currentUser = null;

let products = {
  houses: [],
  room: [],
  parlor: [],
  kitchen: [],
  clothes: [],
  devices: []
};

const STORAGE_KEY = 'megamall_products';

/* =======================
   STORAGE HELPERS
======================= */
function loadProducts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    products = JSON.parse(saved);
  } else {
    saveProducts();
  }
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

/* =======================
   PRODUCT RENDERING
======================= */
function renderGrid(cat) {
  const el = document.getElementById(`grid-${cat}`);
  if (!el) return;

  el.innerHTML = '';

  products[cat].forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = p.src || 'assets/placeholder.png';
    img.alt = p.name;
    img.onerror = () => img.src = 'assets/placeholder.png';

    const info = document.createElement('div');
    info.className = 'info';

    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = p.name;

    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = '$' + p.price;

    const buy = document.createElement('button');
    buy.className = 'buy';
    buy.textContent = 'Buy';
    buy.onclick = () => openBuyModal(p);

    info.append(name, price, buy);
    card.append(img, info);
    el.appendChild(card);
  });
}

function renderAllGrids() {
  Object.keys(products).forEach(renderGrid);
}

/* =======================
   AUTH TOGGLE
======================= */
signUpBtn.onclick = () => container.classList.add('right-panel-active');
signInBtn.onclick = () => container.classList.remove('right-panel-active');

/* =======================
   SIGN UP
======================= */
signupForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = signupForm['name'].value.trim();
  const email = signupForm['email'].value.trim().toLowerCase();
  const password = signupForm['password'].value;

  if (!name || !email || !password) return alert('Fill all fields');

  const users = JSON.parse(localStorage.getItem('megashop_users') || '{}');
  if (users[email]) return alert('Account exists');

  users[email] = { name, password, role: 'user' };
  localStorage.setItem('megashop_users', JSON.stringify(users));

  alert('Account created');
  signupForm.reset();
  container.classList.remove('right-panel-active');
});

/* =======================
   LOGIN
======================= */
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = loginForm['email'].value.trim().toLowerCase();
  const password = loginForm['password'].value;

  if (email === 'rydon@admin.com' && password === 'rydon@1234') {
    currentUser = { role: 'admin' };
    showApp();
    return;
  }

  const users = JSON.parse(localStorage.getItem('megashop_users') || '{}');
  if (users[email]?.password === password) {
    currentUser = users[email];
    showApp();
  } else {
    alert('Invalid login');
  }
});

function showApp() {
  authRoot.classList.add('hidden');
  appRoot.classList.remove('hidden');
  adminPanelBtn.style.display = currentUser?.role === 'admin' ? 'inline-block' : 'none';
  renderAllGrids();
  refreshAdminList();
}

/* =======================
   LOGOUT
======================= */
logoutBtn.onclick = () => {
  currentUser = null;
  appRoot.classList.add('hidden');
  authRoot.classList.remove('hidden');
};

/* =======================
   NAVIGATION
======================= */
topnavBtns.forEach(btn => {
  btn.onclick = () => {
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${btn.dataset.page}`)?.classList.add('active');
    topnavBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  };
});

/* =======================
   SIDEBAR
======================= */
hamburger.onclick = () => sidebar.classList.remove('hidden');
closeSidebar.onclick = () => sidebar.classList.add('hidden');

document.querySelectorAll('.side-link').forEach(link => {
  link.onclick = e => {
    e.preventDefault();
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${link.dataset.sidebar}`)?.classList.add('active');
    sidebar.classList.add('hidden');
  };
});

/* =======================
   ADMIN LOGIN
======================= */
adminPanelBtn.onclick = () => {
  pages.forEach(p => p.classList.remove('active'));
  pageAdminLogin.classList.add('active');
};

adminLoginForm?.addEventListener('submit', e => {
  e.preventDefault();
  const email = adminLoginForm['email'].value;
  const pass = adminLoginForm['password'].value;

  if (email === 'rydon@admin.com' && pass === 'rydon@1234') {
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById('page-admin-dashboard').classList.add('active');
  } else alert('Invalid admin');
});

/* =======================
   ADMIN ADD / DELETE
======================= */
adminAddForm?.addEventListener('submit', e => {
  e.preventDefault();

  const name = adminAddForm['name'].value.trim();
  const price = Number(adminAddForm['price'].value);
  const image = adminAddForm['image'].value.trim();
  const cat = document.getElementById('prod-category').value;

  if (!name || !price) return alert('Missing fields');

  products[cat].unshift({
    id: Date.now().toString(),
    name,
    price,
    src: image || 'assets/placeholder.png'
  });

  saveProducts();
  renderGrid(cat);
  refreshAdminList();
  adminAddForm.reset();
});

function refreshAdminList() {
  adminProdList.innerHTML = '';

  Object.entries(products).forEach(([cat, list]) => {
    list.forEach(p => {
      const row = document.createElement('div');
      row.className = 'admin-row';
      row.innerHTML = `<strong>${p.name}</strong> — $${p.price}`;

      const del = document.createElement('button');
      del.textContent = 'Delete';
      del.onclick = () => {
        products[cat] = products[cat].filter(x => x.id !== p.id);
        saveProducts();
        renderGrid(cat);
        refreshAdminList();
      };

      row.appendChild(del);
      adminProdList.appendChild(row);
    });
  });
}

/* =======================
   BUY MODAL
======================= */
function openBuyModal(p) {
  buyModal.classList.remove('hidden');
  orderTitle.textContent = `Buy: ${p.name}`;
  orderItemEl.textContent = `${p.name} — $${p.price}`;
}

closeBuyModal.onclick = () => buyModal.classList.add('hidden');

/* =======================
   INIT
======================= */
loadProducts();
renderAllGrids();
refreshAdminList();

