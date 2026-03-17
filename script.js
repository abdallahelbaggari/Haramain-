// ===============================
// 🌐 LANGUAGE SYSTEM
// ===============================
const langSelect = document.getElementById("langSelect");

function applyLanguage(lang){
  document.querySelectorAll("[data-lang-en]").forEach(el => {
    const text = el.getAttribute(`data-lang-${lang}`);
    if(text) el.innerText = text;
  });

  document.body.dir = (lang === "ar") ? "rtl" : "ltr";
}

langSelect.addEventListener("change", () => {
  applyLanguage(langSelect.value);
  localStorage.setItem("lang", langSelect.value);
});

// ===============================
// 🚀 SAFE DOM LOAD
// ===============================
window.addEventListener("DOMContentLoaded", () => {

  const savedLang = localStorage.getItem("lang") || "en";
  langSelect.value = savedLang;
  applyLanguage(savedLang);

  loadTransactions();
  generatePilgrimID();
  document.getElementById("balance").innerText = balance;
});

// ===============================
// 🔐 PI SDK INIT (TESTNET)
// ===============================
const Pi = window.Pi;

Pi.init({
  version: "2.0",
  sandbox: true
});

let currentUser = null;

// ===============================
// 🔐 LOGIN
// ===============================
document.getElementById("loginBtn").onclick = async () => {
  try {
    const user = await Pi.authenticate(['username','payments']);

    currentUser = user;
    document.getElementById("username").innerText = user.username;

    document.getElementById("landing").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("status").style.display = "none";

  } catch {
    alert("Open inside Pi Browser");
  }
};

document.getElementById("logoutBtn").onclick = () => location.reload();

// ===============================
// 📌 NAVIGATION
// ===============================
const sections = ["pilgrimID","booking","wallet","prayer","alerts","donations"];

function showSection(id){
  sections.forEach(s => document.getElementById(s).style.display="none");
  document.getElementById(id).style.display="block";
}

document.getElementById("btnID").onclick = () => showSection("pilgrimID");
document.getElementById("btnBooking").onclick = () => showSection("booking");
document.getElementById("btnWallet").onclick = () => {
  showSection("wallet");
  renderTransactions();
};
document.getElementById("btnPrayer").onclick = () => {
  showSection("prayer");
  loadPrayerTimes();
};
document.getElementById("btnAlerts").onclick = () => showSection("alerts");
document.getElementById("btnDonate").onclick = () => showSection("donations");

// ===============================
// 🪪 PILGRIM ID
// ===============================
function generatePilgrimID(){
  let id = localStorage.getItem("pid");

  if(!id){
    id = "HRM-" + Date.now();
    localStorage.setItem("pid", id);
  }

  document.getElementById("pid").innerText = id;
  QRCode.toCanvas(document.getElementById("qr"), id);
}

// ===============================
// 💳 PAYMENT SYSTEM (TESTNET)
// ===============================
document.getElementById("payBtn").onclick = async () => {

  const amount = parseFloat(document.getElementById("amount").value);
  const statusEl = document.getElementById("paymentStatus");

  if(!amount) return alert("Enter amount");

  statusEl.innerText = "⏳ Processing...";

  try {

    const res = await fetch("/.netlify/functions/payment", {
      method: "POST",
      body: JSON.stringify({ amount })
    });

    const data = await res.json();

    Pi.createPayment({
      amount: data.payment.amount,
      memo: data.payment.memo,
      metadata: data.payment.metadata
    }, {

      onReadyForServerApproval: async (paymentId) => {
        statusEl.innerText = "🔄 Approving...";
        await fetch("/.netlify/functions/approve", {
          method: "POST",
          body: JSON.stringify({ paymentId })
        });
      },

      onReadyForServerCompletion: async (paymentId) => {
        statusEl.innerText = "✅ Payment Successful";

        await fetch("/.netlify/functions/complete", {
          method: "POST",
          body: JSON.stringify({ paymentId })
        });

        saveTransaction("Booking", amount);
        renderTransactions();
      },

      onCancel: () => {
        statusEl.innerText = "❌ Cancelled";
      },

      onError: () => {
        statusEl.innerText = "⚠️ Error";
      }

    });

  } catch {
    statusEl.innerText = "❌ Failed";
  }
};

// ===============================
// 💰 WALLET
// ===============================
let balance = 200;

function saveTransaction(type, amount){
  let tx = JSON.parse(localStorage.getItem("transactions") || "[]");

  tx.unshift({
    type,
    amount,
    date: new Date().toLocaleString()
  });

  localStorage.setItem("transactions", JSON.stringify(tx));
}

function loadTransactions(){
  if(!localStorage.getItem("transactions")){
    localStorage.setItem("transactions", "[]");
  }
}

function renderTransactions(){
  const list = document.getElementById("txHistory");
  list.innerHTML = "";

  let tx = JSON.parse(localStorage.getItem("transactions"));

  tx.forEach(t => {
    let li = document.createElement("li");
    li.innerText = `${t.type}: ${t.amount}π (${t.date})`;
    list.appendChild(li);
  });
}

document.getElementById("refreshBalance").onclick = () => {
  document.getElementById("balance").innerText = balance;
};

document.getElementById("sendBtn").onclick = () => {

  const amount = parseFloat(document.getElementById("sendAmount").value);

  if(amount > balance) return alert("Insufficient");

  balance -= amount;

  saveTransaction("Sent", amount);
  renderTransactions();

  document.getElementById("balance").innerText = balance;
};

// ===============================
// ❤️ DONATIONS
// ===============================
document.getElementById("donateBtn").onclick = () => {

  const amount = document.getElementById("donateAmount").value;

  if(!amount) return alert("Enter amount");

  saveTransaction("Donation", amount);

  const li = document.createElement("li");
  li.innerText = `Donated ${amount}π`;

  document.getElementById("donationHistory").prepend(li);
};

// ===============================
// 🕌 PRAYER TIMES
// ===============================
async function loadPrayerTimes(){
  try {
    const res = await fetch("https://api.aladhan.com/v1/timingsByCity?city=Mecca&country=Saudi Arabia");
    const data = await res.json();

    const t = data.data.timings;

    const list = document.getElementById("prayerList");
    list.innerHTML = "";

    ["Fajr","Dhuhr","Asr","Maghrib","Isha"].forEach(p => {
      let li = document.createElement("li");
      li.innerText = `${p} - ${t[p]}`;
      list.appendChild(li);
    });

  } catch {}
}

// ===============================
// 🚨 ALERTS
// ===============================
setInterval(() => {

  const alerts = [
    "⚠️ High crowd",
    "🕌 Prayer time soon",
    "🚧 Road congestion"
  ];

  const li = document.createElement("li");
  li.innerText = alerts[Math.floor(Math.random()*alerts.length)];

  document.getElementById("alertsList").prepend(li);

}, 15000);
