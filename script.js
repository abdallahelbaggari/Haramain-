/* =========================
   Haramain App Script
========================= */

document.addEventListener("DOMContentLoaded", function () {

let currentUser = null;
let currentLang = "en";
let pi;

/* =========================
   Language Switching
========================= */

const langSelect = document.getElementById("langSelect");

function updateLanguage(lang){

currentLang = lang;

document.querySelectorAll("[data-lang-en]").forEach(el=>{
const text = el.getAttribute(`data-lang-${lang}`);
if(text) el.innerText = text;
});

document.querySelectorAll("[data-placeholder-en]").forEach(el=>{
const text = el.getAttribute(`data-placeholder-${lang}`);
if(text) el.placeholder = text;
});

if(lang === "ar"){
document.body.classList.add("rtl");
}else{
document.body.classList.remove("rtl");
}

}

if(langSelect){

langSelect.addEventListener("change",function(){

updateLanguage(this.value);

});

}

/* =========================
   Pi SDK Initialization
========================= */

function initPi(){

if(window.Pi){

pi = window.Pi;

pi.init({
version:"2.0",
sandbox:true
});

console.log("Pi SDK Initialized (Testnet)");

}else{

console.log("Pi SDK not available");

}

}

initPi();

/* =========================
   Login with Pi
========================= */

const loginBtn = document.getElementById("loginBtn");
const dashboard = document.getElementById("dashboard");
const landing = document.getElementById("landing");

if(loginBtn){

loginBtn.addEventListener("click", async function(){

try{

const auth = await pi.authenticate(

["username","payments","wallet_address"],

function(payment){},

function(cancel){console.log("Payment cancelled")}

);

currentUser = auth.user;

document.getElementById("usernameDisplay").innerText = currentUser.username;

landing.style.display="none";
dashboard.style.display="block";

generatePilgrimQR();

}catch(e){

console.log(e);

}

});

}

/* =========================
   Logout
========================= */

const logoutBtn = document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.addEventListener("click",function(){

dashboard.style.display="none";
landing.style.display="block";

});

}

/* =========================
   Utility Navigation
========================= */

function hideUtilities(){

document.querySelectorAll("#utilities > div").forEach(sec=>{
sec.style.display="none";
});

}

function showUtility(id){

hideUtilities();

const el = document.getElementById(id);

if(el) el.style.display="block";

}

const pilgrimBtn=document.getElementById("pilgrimIdBtn");
const bookingBtn=document.getElementById("bookingBtn");
const walletBtn=document.getElementById("walletBtn");

if(pilgrimBtn) pilgrimBtn.onclick=()=>showUtility("pilgrimId");
if(bookingBtn) bookingBtn.onclick=()=>showUtility("booking");
if(walletBtn) walletBtn.onclick=()=>showUtility("wallet");

/* =========================
   Pilgrim QR Generator
========================= */

function generatePilgrimQR(){

const canvas=document.getElementById("pilgrimQr");

const code="HARAMAIN-"+Math.floor(Math.random()*100000000);

document.getElementById("pilgrimCode").innerText=code;

if(canvas){

QRCode.toCanvas(canvas,code,function(error){

if(error) console.error(error);

});

}

}

/* =========================
   Demo Wallet Balance
========================= */

let balance=100;

const balanceText=document.getElementById("balance");
const refreshBalance=document.getElementById("refreshBalance");

function updateBalance(){

if(balanceText){

balanceText.innerText=balance+" π";

}

}

if(refreshBalance){

refreshBalance.addEventListener("click",function(){

updateBalance();

});

}

updateBalance();

/* =========================
   Transaction History
========================= */

function addTransaction(wallet,amount){

const txList=document.getElementById("txList");

const li=document.createElement("li");

li.innerText="Sent "+amount+" π to "+wallet;

txList.prepend(li);

}

/* =========================
   Frontend Payment Call
========================= */

async function createPayment(paymentId,amount){

try{

const response=await fetch("/.netlify/functions/payment",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
paymentId:paymentId,
amount:amount
})

});

return await response.json();

}catch(err){

console.error("Payment creation error",err);

}

}

async function completePayment(paymentId){

try{

const response=await fetch("/.netlify/functions/complete",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
paymentId:paymentId
})

});

return await response.json();

}catch(err){

console.error("Completion error",err);

}

}

/* =========================
   Booking Payment (Pi Testnet)
========================= */

const payBookingBtn=document.getElementById("payBookingBtn");

if(payBookingBtn){

payBookingBtn.addEventListener("click",function(){

const amount=document.getElementById("bookingAmount").value;

if(!amount){

alert("Enter amount");

return;

}

if(!pi){

alert("Pi SDK not available");

return;

}

pi.createPayment(

{

amount:parseFloat(amount),
memo:"Haramain Hajj/Umrah Booking",
metadata:{type:"booking"}

},

{

onReadyForServerApproval:function(paymentId){

createPayment(paymentId,amount);

},

onReadyForServerCompletion:function(paymentId,txid){

completePayment(paymentId);

alert("Payment successful");

},

onCancel:function(){

alert("Payment cancelled");

},

onError:function(err){

console.error(err);

alert("Payment failed");

}

}

);

});

}

/* =========================
   Navigation Menu
========================= */

const navDashboard=document.getElementById("navDashboard");

if(navDashboard){

navDashboard.addEventListener("click",function(){

hideUtilities();

});

}

});
