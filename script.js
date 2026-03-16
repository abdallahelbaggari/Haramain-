// Initialize Pi SDK
Pi.init({ version: "2.0", sandbox: true });

let currentUser = null;



// HANDLE INCOMPLETE PAYMENTS
function onIncompletePaymentFound(payment) {

console.log("Incomplete payment detected:", payment.identifier);

fetch("/.netlify/functions/complete", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
paymentId: payment.identifier
})
})
.then(res => res.json())
.then(data => {
console.log("Payment completed:", data);
})
.catch(err => {
console.error("Completion error:", err);
});

}



// LOGIN
document.getElementById("loginBtn").onclick = async () => {

try {

const auth = await Pi.authenticate(
["username","payments"],
onIncompletePaymentFound
);

currentUser = auth.user;

document.getElementById("username").innerText = currentUser.username;

document.getElementById("landing").style.display = "none";

document.getElementById("dashboard").style.display = "block";

generateID();

} catch(e) {

console.error(e);

}

};



// LOGOUT
document.getElementById("logoutBtn").onclick = () => location.reload();



// GENERATE PILGRIM QR ID
function generateID(){

const id = "PILGRIM-" + Math.floor(Math.random()*100000);

document.getElementById("pid").innerText = id;

QRCode.toCanvas(document.getElementById("qr"), id);

}



// SHOW UTILITIES
function hideAll(){

document.querySelectorAll(".utility").forEach(u => {
u.style.display = "none";
});

}

function show(id){

hideAll();

document.getElementById(id).style.display = "block";

}

document.getElementById("btnID").onclick = () => show("pilgrimID");

document.getElementById("btnBooking").onclick = () => show("booking");

document.getElementById("btnWallet").onclick = () => show("wallet");

document.getElementById("btnPrayer").onclick = () => show("prayer");

document.getElementById("btnAlerts").onclick = () => show("alerts");

document.getElementById("btnDonate").onclick = () => show("donations");



// CREATE PI PAYMENT
function createPayment(amount, memo){

Pi.createPayment({

amount: parseFloat(amount),

memo: memo,

metadata: { type: memo }

}, {

onReadyForServerApproval: function(paymentId){

console.log("Approving payment:", paymentId);

fetch("/.netlify/functions/approve", {

method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify({
paymentId: paymentId
})

});

},



onReadyForServerCompletion: function(paymentId){

console.log("Completing payment:", paymentId);

fetch("/.netlify/functions/complete", {

method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify({
paymentId: paymentId
})

});

},



onCancel: function(){

alert("Payment cancelled");

},



onError: function(error){

console.error("Payment error:", error);

}

});

}



// BOOKING PAYMENT
document.getElementById("payBtn").onclick = () => {

const amount = document.getElementById("amount").value;

if(!amount || amount <= 0){

alert("Enter valid amount");

return;

}

createPayment(amount,"Hajj Booking");

};



// DONATION PAYMENT
document.getElementById("donateBtn").onclick = () => {

const amount = document.getElementById("donateAmount").value;

if(!amount || amount <= 0){

alert("Enter valid amount");

return;

}

createPayment(amount,"Donation");

};



// WALLET SIMULATION
let balance = 100;

document.getElementById("balance").innerText = balance;



document.getElementById("sendBtn").onclick = () => {

let amt = parseFloat(document.getElementById("sendAmount").value);

if(isNaN(amt) || amt <= 0){

alert("Invalid amount");

return;

}

if(amt > balance){

alert("Insufficient balance");

return;

}

balance -= amt;

document.getElementById("balance").innerText = balance;

let li = document.createElement("li");

li.innerText = "Sent " + amt + " π";

document.getElementById("txHistory").appendChild(li);

};



// REFRESH BALANCE
document.getElementById("refreshBalance").onclick = () => {

document.getElementById("balance").innerText = balance;

};



// PRAYER TIMES
const prayers = [

"Fajr 5:10",
"Dhuhr 12:20",
"Asr 3:45",
"Maghrib 6:30",
"Isha 7:50"

];

prayers.forEach(p => {

let li = document.createElement("li");

li.innerText = p;

document.getElementById("prayerList").appendChild(li);

});



// ALERTS
const alerts = [

"Crowd high near Tawaf",
"Heat warning",
"Gate 4 closed"

];

alerts.forEach(a => {

let li = document.createElement("li");

li.innerText = a;

document.getElementById("alertsList").appendChild(li);

});



// LANGUAGE SWITCH
function switchLanguage(lang){

document.querySelectorAll("[data-lang-en]").forEach(el => {

let text = el.getAttribute("data-lang-" + lang);

if(text) el.innerText = text;

});

if(lang === "ar"){

document.body.dir = "rtl";

}else{

document.body.dir = "ltr";

}

}

document.getElementById("langSelect").onchange = (e) => {

switchLanguage(e.target.value);

};
