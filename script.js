Pi.init({ version: "2.0", sandbox: true });
const loginBtn = document.getElementById("loginBtn");
const dashboard = document.getElementById("dashboard");
const landing = document.getElementById("landing");
const statusBox = document.getElementById("status");
const usernameDisplay = document.getElementById("usernameDisplay");
let balance = 0;
const txList = document.getElementById("txList");

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  dashboard.style.display="none";
  landing.style.display="block";
  txList.innerHTML="";
  balance=0;
  document.getElementById("balance").innerText="0 π";
  statusBox.innerText="Logged out. Open Haramain in Pi Browser to continue.";
});

// Login
loginBtn.addEventListener("click", async()=>{
  statusBox.innerText="Opening Pi authentication...";
  try{
    const auth = await Pi.authenticate(["username","payments"]);
    usernameDisplay.innerText = auth.user.username;
    dashboard.style.display="block";
    landing.style.display="none";
    statusBox.innerText="Logged in as "+auth.user.username;
  }catch(err){
    statusBox.innerText="Authentication failed: "+err;
  }
});

// Show utilities
const showSection = (id)=>{["pilgrimId","booking","market","wallet","prayerTimes","alerts","guide","map","donations","community","settings"].forEach(s=>{
  document.getElementById(s).style.display="none";
}); document.getElementById(id).style.display="block";}

// Quick access buttons
document.getElementById("pilgrimIdBtn").addEventListener("click", ()=>showSection("pilgrimId"));
document.getElementById("bookingBtn").addEventListener("click", ()=>showSection("booking"));
document.getElementById("marketBtn").addEventListener("click", ()=>showSection("market"));
document.getElementById("walletBtn").addEventListener("click", ()=>showSection("wallet"));
document.getElementById("prayerBtn").addEventListener("click", ()=>showSection("prayerTimes"));
document.getElementById("alertsBtn").addEventListener("click", ()=>showSection("alerts"));

// Navigation menu
document.getElementById("navGuide").addEventListener("click", ()=>showSection("guide"));
document.getElementById("navMap").addEventListener("click", ()=>showSection("map"));
document.getElementById("navDonations").addEventListener("click", ()=>showSection("donations"));
document.getElementById("navCommunity").addEventListener("click", ()=>showSection("community"));
document.getElementById("navSettings").addEventListener("click", ()=>showSection("settings"));
document.getElementById("navDashboard").addEventListener("click", ()=>showSection("pilgrimId"));

// QR for Pilgrim ID
function generatePilgrimID(){
  const pilgrimCode = "HARAM"+Math.floor(100000+Math.random()*900000);
  document.getElementById("pilgrimCode").innerText = pilgrimCode;
  QRCode.toCanvas(document.getElementById("pilgrimQr"), pilgrimCode, {width:200}, function(err){if(err)console.error(err);});
}
generatePilgrimID();

// Wallet Payment simulation
document.getElementById("refreshBalance").addEventListener("click", ()=>{
  document.getElementById("balance").innerText = balance+" π";
  statusBox.innerText="Balance refreshed!";
});
document.getElementById("sendPiBtn").addEventListener("click", ()=>{
  const amt = document.getElementById("sendAmount").value.trim();
  const walletId = document.getElementById("sendWalletId").value.trim();
  if(!amt || !walletId){alert("Enter wallet and amount!"); return;}
  balance -= Number(amt);
  document.getElementById("balance").innerText = balance+" π";
  const li = document.createElement("li"); li.innerText = "Sent "+amt+" π → "+walletId+" ("+new Date().toLocaleString()+")"; txList.prepend(li);
  statusBox.innerText="Payment sent!";
  document.getElementById("sendAmount").value=""; document.getElementById("sendWalletId").value="";
});

// Booking
document.getElementById("payBookingBtn").addEventListener("click", ()=>{
  const amt = document.getElementById("bookingAmount").value.trim();
  if(!amt){alert("Enter amount!"); return;}
  balance -= Number(amt);
  document.getElementById("balance").innerText = balance+" π";
  const li = document.createElement("li"); li.innerText = "Hajj/Umrah Booking paid "+amt+" π ("+new Date().toLocaleString()+")"; txList.prepend(li);
  statusBox.innerText="Booking completed!";
  document.getElementById("bookingAmount").value="";
});

// Donations
document.getElementById("donateBtn").addEventListener("click", ()=>{
  const amt = document.getElementById("donationAmount").value.trim();
  if(!amt){alert("Enter amount!"); return;}
  balance -= Number(amt);
  document.getElementById("balance").innerText = balance+" π";
  const li = document.createElement("li"); li.innerText = "Donation "+amt+" π ("+new Date().toLocaleString()+")"; txList.prepend(li);
  statusBox.innerText="Donation successful!";
  document.getElementById("donationAmount").value="";
});

// Populate marketplace
const marketProducts = [
  {name:"Zamzam Water", price:0.5},
  {name:"Ajwa Dates", price:1},
  {name:"Prayer Mat", price:0.7},
  {name:"Perfume", price:1.5},
  {name:"Souvenir", price:0.3}
];
const marketList = document.getElementById("marketList");
marketProducts.forEach(p=>{
  const li = document.createElement("li");
  li.innerText = p.name + " — "+p.price+" π";
  marketList.appendChild(li);
});

// Prayer Times sample
const prayerList = document.getElementById("prayerList");
["Fajr","Dhuhr","Asr","Maghrib","Isha"].forEach(t=>{
  const li=document.createElement("li"); li.innerText=t+" — 00:00"; prayerList.appendChild(li);
});

// Safety alerts sample
const alertsList = document.getElementById("alertsList");
["Crowd density alert at Masjid al-Haram","Health advisory: stay hydrated"].forEach(a=>{
  const li=document.createElement("li"); li.innerText=a; alertsList.appendChild(li);
});
