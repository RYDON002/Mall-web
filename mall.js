const container = document.getElementById('container');
const signUpBtn = document.getElementById('signUp');
const signInBtn = document.getElementById('signIn');
const authRoot = document.getElementById('auth-root');
const appRoot = document.getElementById('app-root');

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

const topnavBtns = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');

const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');

const logoutBtn = document.getElementById('logoutBtn');
const adminPanelBtn = document.getElementById('adminPanelBtn');
const pageAdminLogin = document.getElementById('page-admin-login');

const adminLoginForm = document.getElementById('adminLoginForm');
const adminAddForm = document.getElementById('adminAddForm');
const adminProdList = document.getElementById('adminProdList');

const buyModal = document.getElementById('buyModal');
const closeBuyModal = document.getElementById('closeBuyModal');
const orderForm = document.getElementById('orderForm');
const orderItemEl = document.getElementById('order-item');
const orderTitle = document.getElementById('orderTitle');


let currentUser = null;
let products = { houses: [], room: [], parlor: [], kitchen: [], clothes: [], devices: [] };
const folderMap = { houses: 'Home.images', room: 'Room.images', parlor: 'parlor.images', kitchen: 'kitchen.images', clothes: 'Cloths.images', devices: 'Devices.images', home: 'Home.images' };

function buildInitialProducts() {
  const makeList = (key, baseName, priceStart) => {
    const arr = [];
    for (let i = 1; i <= 10; i++) {
      const name = `${key.charAt(0).toUpperCase() + key.slice(1)} ${i}`;
      const price = Math.round((priceStart + Math.random() * priceStart) / 5) * 5;
      const src = `${folderMap[key]}/${baseName}${i}.jpg`;
      arr.push({ id: `${key}-${i}`, name, price, src });
    }
    return arr;
  };
  products.houses = makeList('houses', 'home', 500);
  products.room = makeList('room', 'room', 300);
  products.parlor = makeList('parlor', 'parlor', 400);
  products.kitchen = makeList('kitchen', 'kitchen', 60);
  products.clothes = makeList('clothes', 'cloth', 30);
  products.devices = makeList('devices', 'laptop', 600);
}
buildInitialProducts();

function renderGrid(cat) {
  const el = document.getElementById(`grid-${cat}`);
  if (!el) return;
  el.innerHTML = '';
  (products[cat] || []).forEach(p => {
    const card = document.createElement('div'); card.className = 'card';
    const img = document.createElement('img'); img.src = p.src; img.alt = p.name;
    img.onerror = function () { this.src = `https://source.unsplash.com/featured/?${encodeURIComponent(p.name)}&sig=${Math.floor(Math.random() * 1000)}`; };

    const info = document.createElement('div'); info.className = 'info';
    const left = document.createElement('div');
    const name = document.createElement('div'); name.className = 'name'; name.textContent = p.name; left.appendChild(name);
    const price = document.createElement('div'); price.className = 'price'; price.textContent = '$' + p.price;
    const buy = document.createElement('button'); buy.className = 'buy'; buy.textContent = 'Buy'; buy.addEventListener('click', () => openBuyModal(p));

    info.appendChild(left); info.appendChild(price); info.appendChild(buy);
    card.appendChild(img); card.appendChild(info); el.appendChild(card);
  });
}
function renderAllGrids() { ['houses', 'room', 'parlor', 'kitchen', 'clothes', 'devices'].forEach(renderGrid); }
renderAllGrids();

renderAllGrids();

signUpBtn.addEventListener('click', () => container.classList.add('right-panel-active'));
signInBtn.addEventListener('click', () => container.classList.remove('right-panel-active'));

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim().toLowerCase();
  const password = document.getElementById('signup-password').value;
  if (!name || !email || !password) return alert('Please fill all fields');
  const stored = JSON.parse(localStorage.getItem('megashop_users') || '{}');
  if (stored[email]) return alert('Account exists. Please sign in.');
  stored[email] = { name, password, role: 'user' };
  localStorage.setItem('megashop_users', JSON.stringify(stored));
  alert('Account created! You can now sign in.');
  signupForm.reset(); container.classList.remove('right-panel-active');
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  if (!email || !password) return;
  if (email === 'rydon@admin.com' && password === 'rydon@1234') { currentUser = { name: 'Admin', email, role: 'admin' }; showApp(); return; }
  const stored = JSON.parse(localStorage.getItem('megashop_users') || '{}');
  if (stored[email] && stored[email].password === password) { currentUser = { name: stored[email].name, email, role: 'user' }; showApp(); }
  else alert('Invalid credentials. Or sign up first.');
});

function showApp() {
  authRoot.classList.add('hidden'); appRoot.classList.remove('hidden');
  document.body.scrollTop = 0; document.documentElement.scrollTop = 0;
  renderAllGrids();
  try {
    if (currentUser && currentUser.role === 'admin') adminPanelBtn.style.display = 'inline-block';
    else adminPanelBtn.style.display = 'none';
  } catch (err) { };
}

logoutBtn.addEventListener('click', () => {
  currentUser = null;
  appRoot.classList.add('hidden'); authRoot.classList.remove('hidden');
  loginForm.reset(); signupForm.reset(); container.classList.remove('right-panel-active');
  try { adminPanelBtn.style.display = 'none'; } catch (err) { }
});

topnavBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.page;
    pages.forEach(p => p.classList.remove('active'));
    const pageEl = document.getElementById(`page-${target}`);
    if (pageEl) pageEl.classList.add('active');
    topnavBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active');
  });
});

document.querySelectorAll('[data-go]').forEach(b => {
  b.addEventListener('click', () => { document.querySelector(`.nav-btn[data-page="${b.dataset.go}"]`).click(); });
});

hamburger.addEventListener('click', () => { sidebar.classList.add('show'); sidebar.classList.remove('hidden'); });
closeSidebar.addEventListener('click', () => { sidebar.classList.remove('show'); sidebar.classList.add('hidden'); });

document.querySelectorAll('.side-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const t = link.dataset.sidebar;
    if (t) { pages.forEach(p => p.classList.remove('active')); const el = document.getElementById(`page-${t}`); if (el) el.classList.add('active'); }
    sidebar.classList.remove('show'); sidebar.classList.add('hidden');
  });
});

adminPanelBtn.addEventListener('click', () => { pages.forEach(p => p.classList.remove('active')); pageAdminLogin.classList.add('active'); topnavBtns.forEach(b => b.classList.remove('active')); });

adminLoginForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('admin-email').value.trim().toLowerCase();
  const password = document.getElementById('admin-password').value;
  if (email === 'rydon@admin.com' && password === 'rydon@1234') {
    currentUser = { name: 'Admin', email, role: 'admin' };
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById('page-admin-dashboard').classList.add('active');
    try { adminPanelBtn.style.display = 'inline-block'; } catch (err) { }
  }
  else alert('Invalid admin credentials');
});

adminAddForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('prod-name').value.trim();
  const price = parseFloat(document.getElementById('prod-price').value);
  const image = document.getElementById('prod-image').value.trim();
  const cat = document.getElementById('prod-category').value;
  if (!name || !price || !cat) return alert('Missing fields');
  const id = `${cat}-${Date.now()}`;
  const src = image || (folderMap[cat] ? `${folderMap[cat]}/${name.replace(/\s+/g, '-')}.jpg` : '');

  if (!products[cat]) products[cat] = [];
  products[cat].unshift({ id, name, price, src });
  renderGrid(cat); adminAddForm.reset(); refreshAdminList();
});

function refreshAdminList() {
  adminProdList.innerHTML = '';
  const all = Object.keys(products).flatMap(k => products[k].map(p => ({ ...p, cat: k })));
  all.forEach(p => {
    const item = document.createElement('div');
    item.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:8px;border:1px solid #f0f0f0;border-radius:8px;background:#fff';
    const left = document.createElement('div'); left.innerHTML = `<strong>${p.name}</strong><div style="color:#666;font-size:13px">${p.cat} • $${p.price}</div>`;
    const right = document.createElement('div'); const del = document.createElement('button'); del.className = 'btn'; del.style.cssText = 'background:#fff;border:1px solid #eee;padding:6px 8px'; del.textContent = 'Delete';
    del.addEventListener('click', () => { products[p.cat] = products[p.cat].filter(x => x.id !== p.id); renderGrid(p.cat); refreshAdminList(); });
    right.appendChild(del); item.appendChild(left); item.appendChild(right); adminProdList.appendChild(item);
  });
}
refreshAdminList();


function openBuyModal(product) {
  buyModal.classList.remove('hidden');
  orderItemEl.textContent = `${product.name} — $${product.price}`;
  orderTitle.textContent = `Buy: ${product.name}`;
  orderForm.dataset.productId = product.id;
}
closeBuyModal?.addEventListener('click', () => buyModal.classList.add('hidden'));
buyModal?.addEventListener('click', (e) => { if (e.target === buyModal) buyModal.classList.add('hidden'); });

orderForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('order-name').value.trim();
  const phone = document.getElementById('order-phone').value.trim();
  const address = document.getElementById('order-address').value.trim();
  const payment = document.getElementById('order-payment').value;
  const location = document.getElementById('order-location').value.trim();
  const productId = orderForm.dataset.productId;
  if (!name || !phone || !address || !location) return alert('Please fill delivery details');
  const order = { id: 'ord-' + Date.now(), name, phone, address, payment, location, productId, date: new Date().toISOString() };
  const orders = JSON.parse(localStorage.getItem('megashop_orders') || '[]'); orders.push(order); localStorage.setItem('megashop_orders', JSON.stringify(orders));
  buyModal.classList.add('hidden'); orderForm.reset(); alert('Order placed (demo). We will contact you to confirm.');
});

renderAllGrids();
