// ===============================
// 🌐 LANGUAGE
// ===============================
const langSelect = document.getElementById("langSelect");

function applyLanguage(lang){
  document.querySelectorAll("[data-lang-en]").forEach(el => {
    const text = el.getAttribute(`data-lang-${lang}`);
    if(text) el.innerText = text;
  });
}

langSelect.addEventListener("change", () => {
  applyLanguage(langSelect.value);
});

// ===============================
// 🔐 PI INIT
// ===============================
const Pi = window.Pi;

Pi.init({
  version: "2.0",
  sandbox: true
});

// ===============================
// 🔐 LOGIN
// ===============================
document.getElementById("loginBtn").onclick = async () => {
  try {
    const user = await Pi.authenticate(['username','payments']);

    document.getElementById("username").innerText = user.username;

    landing.style.display = "none";
    dashboard.style.display = "block";

  } catch {
    alert("Use Pi Browser");
  }
};

// ===============================
// 🪪 ID
// ===============================
function generateID(){
  const id = "HRM-" + Date.now();
  document.getElementById("pid").innerText = id;
  QRCode.toCanvas(document.getElementById("qr"), id);
}

generateID();

// ===============================
// 💳 PAYMENT (FIXED)
// ===============================
document.getElementById("payBtn").onclick = async () => {

  const amount = parseFloat(document.getElementById("amountInput").value);
  const status = document.getElementById("paymentStatus");

  if(!amount) return alert("Enter amount");

  status.innerText = "Processing...";

  try {

    const res = await fetch("/.netlify/functions/payment", {
      method: "POST",
      body: JSON.stringify({ amount })
    });

    const data = await res.json();

    Pi.createPayment(data.payment, {

      onReadyForServerApproval: async (paymentId) => {
        await fetch("/.netlify/functions/approve", {
          method: "POST",
          body: JSON.stringify({ paymentId })
        });
      },

      onReadyForServerCompletion: async (paymentId) => {
        await fetch("/.netlify/functions/complete", {
          method: "POST",
          body: JSON.stringify({ paymentId })
        });

        status.innerText = "✅ Success";
      },

      onCancel: async (paymentId) => {
        await fetch("/.netlify/functions/cancel", {
          method: "POST",
          body: JSON.stringify({ paymentId })
        });

        status.innerText = "Cancelled";
      },

      onError: () => {
        status.innerText = "Error";
      }

    });

  } catch {
    status.innerText = "Failed";
  }
};

// ===============================
// 💰 WALLET (DEMO)
// ===============================
let balance = 200;

document.getElementById("sendBtn").onclick = () => {
  const amount = parseFloat(document.getElementById("sendAmount").value);

  if(amount > balance) return alert("Insufficient");

  balance -= amount;
  document.getElementById("balance").innerText = balance;
};

// ===============================
// ❤️ DONATE
// ===============================
document.getElementById("donateBtn").onclick = () => {
  const amount = document.getElementById("donateAmount").value;

  const li = document.createElement("li");
  li.innerText = `Donated ${amount}π`;

  document.getElementById("donationHistory").prepend(li);
};
