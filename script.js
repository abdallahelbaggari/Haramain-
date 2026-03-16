// ==========================
// script.js for Haramain
// ==========================

// DOM Elements
const landing = document.getElementById('landing');
const dashboard = document.getElementById('dashboard');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const usernameSpan = document.getElementById('username');
const langSelect = document.getElementById('langSelect');
const status = document.getElementById('status');

// Utilities
const utilities = ['pilgrimID', 'booking', 'wallet', 'prayer', 'alerts', 'donations'];
const utilityButtons = {
  btnID: 'pilgrimID',
  btnBooking: 'booking',
  btnWallet: 'wallet',
  btnPrayer: 'prayer',
  btnAlerts: 'alerts',
  btnDonate: 'donations'
};

// Pilgrim ID elements
const qrCanvas = document.getElementById('qr');
const pidSpan = document.getElementById('pid');

// Wallet elements
const balanceSpan = document.getElementById('balance');
const txHistory = document.getElementById('txHistory');

// Donations
const donationHistory = document.getElementById('donationHistory');

// ==========================
// Pi Login / Logout
// ==========================
loginBtn.addEventListener('click', async () => {
  try {
    // Pi login
    const user = await Pi.authenticate({ app_name: 'Haramain' });
    if (user) {
      landing.style.display = 'none';
      dashboard.style.display = 'block';
      usernameSpan.textContent = user.username || 'Pilgrim';
      status.style.display = 'none';

      // Generate QR code for Pilgrim ID
      pidSpan.textContent = user.id;
      QRCode.toCanvas(qrCanvas, user.id, { width: 150 });
    }
  } catch (err) {
    alert('Login failed. Open Haramain in Pi Browser.');
  }
});

logoutBtn.addEventListener('click', () => {
  landing.style.display = 'block';
  dashboard.style.display = 'none';
  usernameSpan.textContent = '';
  utilities.forEach(id => document.getElementById(id).style.display = 'none');
  status.style.display = 'block';
});

// ==========================
// Language Switching
// ==========================
langSelect.addEventListener('change', () => {
  const lang = langSelect.value;
  document.querySelectorAll('[data-lang-en]').forEach(el => {
    const text = el.dataset[`lang${lang.toUpperCase()}`];
    if (text) el.textContent = text;
  });
});

// ==========================
// Utilities Toggle
// ==========================
Object.keys(utilityButtons).forEach(btnId => {
  const btn = document.getElementById(btnId);
  const utilityId = utilityButtons[btnId];
  btn.addEventListener('click', () => {
    // Hide all
    utilities.forEach(id => document.getElementById(id).style.display = 'none');
    // Show selected
    document.getElementById(utilityId).style.display = 'block';
  });
});

// ==========================
// Mock Wallet Functions
// ==========================
let balance = 0;
const transactions = [];

document.getElementById('refreshBalance').addEventListener('click', () => {
  balanceSpan.textContent = balance.toFixed(2);
});

document.getElementById('sendBtn').addEventListener('click', () => {
  const sendTo = document.getElementById('sendTo').value;
  const sendAmount = parseFloat(document.getElementById('sendAmount').value);
  if (!sendTo || isNaN(sendAmount) || sendAmount <= 0 || sendAmount > balance) {
    alert('Invalid transaction.');
    return;
  }
  balance -= sendAmount;
  balanceSpan.textContent = balance.toFixed(2);
  transactions.push(`Sent ${sendAmount.toFixed(2)} π to ${sendTo}`);
  renderTransactions();
});

function renderTransactions() {
  txHistory.innerHTML = '';
  transactions.forEach(tx => {
    const li = document.createElement('li');
    li.textContent = tx;
    txHistory.appendChild(li);
  });
}

// ==========================
// Mock Donations
// ==========================
document.getElementById('donateBtn').addEventListener('click', () => {
  const amount = parseFloat(document.getElementById('donateAmount').value);
  if (isNaN(amount) || amount <= 0 || amount > balance) {
    alert('Invalid donation.');
    return;
  }
  balance -= amount;
  balanceSpan.textContent = balance.toFixed(2);
  const li = document.createElement('li');
  li.textContent = `Donated ${amount.toFixed(2)} π`;
  donationHistory.appendChild(li);
});

// ==========================
// Mock Booking
// ==========================
document.getElementById('payBtn').addEventListener('click', () => {
  const flight = document.getElementById('flight').value;
  const hotel = document.getElementById('hotel').value;
  const transport = document.getElementById('transport').value;
  const amount = parseFloat(document.getElementById('amount').value);

  if (!flight || !hotel || !transport || isNaN(amount) || amount <= 0 || amount > balance) {
    alert('Invalid booking details or insufficient balance.');
    return;
  }

  balance -= amount;
  balanceSpan.textContent = balance.toFixed(2);
  alert(`Booking confirmed!\nFlight: ${flight}\nHotel: ${hotel}\nTransport: ${transport}\nAmount: ${amount.toFixed(2)} π`);
});
