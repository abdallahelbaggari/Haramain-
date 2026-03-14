// ====== Pi SDK Integration ======
let currentUser = null;

// Check if Pi Browser is available
function checkPiBrowser() {
  if (!window.Pi) {
    document.getElementById('status').style.display = 'block';
    document.getElementById('landing').style.display = 'none';
  } else {
    document.getElementById('status').style.display = 'none';
    document.getElementById('landing').style.display = 'block';
  }
}
checkPiBrowser();

// Login / Logout
document.getElementById('loginBtn').addEventListener('click', async () => {
  try {
    currentUser = await Pi.authenticate({ scope: 'username' });
    document.getElementById('landing').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('usernameDisplay').innerText = currentUser.username || 'Pilgrim';
    generatePilgrimQR(currentUser.username || 'Pilgrim');
    fetchWalletBalance();
  } catch (err) {
    alert('Login failed: ' + err.message);
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  currentUser = null;
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('landing').style.display = 'block';
});

// ====== Pilgrim ID QR Code ======
function generatePilgrimQR(id) {
  const canvas = document.getElementById('pilgrimQr');
  const code = document.getElementById('pilgrimCode');
  code.innerText = id;
  QRCode.toCanvas(canvas, id, { width: 150 }, function (error) {
    if (error) console.error(error);
  });
}

// ====== Dashboard Navigation ======
const sections = ['pilgrimId','booking','market','wallet','prayerTimes','alerts','guide','map','donations','community','settings'];
sections.forEach(sec => {
  const btn = document.getElementById(sec + 'Btn');
  if (btn) btn.addEventListener('click', () => showSection(sec));
});

function showSection(id) {
  sections.forEach(sec => {
    const el = document.getElementById(sec);
    if (el) el.style.display = (sec === id ? 'block' : 'none');
  });
}

// ====== Pi Wallet ======
async function fetchWalletBalance() {
  if (!currentUser) return;
  // Simulated API: Replace with real Pi SDK wallet call
  const balance = Math.floor(Math.random() * 1000); // mock balance
  document.getElementById('balance').innerText = balance + ' π';
}

document.getElementById('refreshBalance').addEventListener('click', fetchWalletBalance);

document.getElementById('sendPiBtn').addEventListener('click', () => {
  const recipient = document.getElementById('sendWalletId').value.trim();
  const amount = parseFloat(document.getElementById('sendAmount').value);
  if (!recipient || !amount) return alert('Enter valid recipient and amount.');
  // Simulated transfer
  const txList = document.getElementById('txList');
  const li = document.createElement('li');
  li.innerText = `Sent ${amount} π to ${recipient} ✅`;
  txList.prepend(li);
  document.getElementById('sendAmount').value = '';
  document.getElementById('sendWalletId').value = '';
  fetchWalletBalance();
});

// ====== Booking Payment ======
document.getElementById('payBookingBtn').addEventListener('click', () => {
  const flight = document.getElementById('flight').value.trim();
  const hotel = document.getElementById('hotel').value.trim();
  const transport = document.getElementById('transport').value.trim();
  const amount = parseFloat(document.getElementById('bookingAmount').value);
  if (!flight || !hotel || !transport || !amount) return alert('Fill all booking details.');
  alert(`Booking confirmed! Flight: ${flight}, Hotel: ${hotel}, Transport: ${transport}, Amount: ${amount} π`);
  document.getElementById('flight').value = '';
  document.getElementById('hotel').value = '';
  document.getElementById('transport').value = '';
  document.getElementById('bookingAmount').value = '';
});

// ====== Language Switching ======
function switchLanguage(lang) {
  document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-lang-en]').forEach(el => {
    const text = el.getAttribute(`data-lang-${lang}`);
    if (text) el.innerText = text;
  });
  document.querySelectorAll('input[data-placeholder-en]').forEach(inp => {
    const placeholder = inp.getAttribute(`data-placeholder-${lang}`);
    if (placeholder) inp.placeholder = placeholder;
  });
}

document.getElementById('langSelect').addEventListener('change', e => switchLanguage(e.target.value));
document.getElementById('langSettings').addEventListener('change', e => switchLanguage(e.target.value));

// Initialize default language
switchLanguage('en');
