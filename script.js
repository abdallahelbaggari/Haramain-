/* ============================
HARAMAIN SCRIPT
Pi Testnet Ready
============================ */

let currentUser = null;
let currentLang = "en";

/* ============================
LANGUAGE SWITCHING
============================ */

function applyLanguage(lang){

currentLang = lang;

document.querySelectorAll("[data-lang-en]").forEach(el =>{

let text = el.getAttribute("data-lang-"+lang);

if(text){
el.innerText = text;
}

});

}

/* language select */

document.getElementById("langSelect").addEventListener("change",(e)=>{

applyLanguage(e.target.value)

})



/* ============================
UTILITY NAVIGATION
============================ */

function hideUtilities(){

document.querySelectorAll(".utility").forEach(u=>{

u.style.display="none"

})

}

document.getElementById("btnID").onclick=()=>{

hideUtilities()
document.getElementById("pilgrimID").style.display="block"

generatePilgrimID()

}

document.getElementById("btnBooking").onclick=()=>{

hideUtilities()
document.getElementById("booking").style.display="block"

}

document.getElementById("btnWallet").onclick=()=>{

hideUtilities()
document.getElementById("wallet").style.display="block"

}

document.getElementById("btnPrayer").onclick=()=>{

hideUtilities()
document.getElementById("prayer").style.display="block"

loadPrayerTimes()

}

document.getElementById("btnAlerts").onclick=()=>{

hideUtilities()
document.getElementById("alerts").style.display="block"

loadAlerts()

}

document.getElementById("btnDonate").onclick=()=>{

hideUtilities()
document.getElementById("donations").style.display="block"

}



/* ============================
PI SDK INITIALIZATION
============================ */

const Pi = window.Pi;

Pi.init({
version:"2.0",
sandbox:true
})



/* ============================
LOGIN
============================ */

document.getElementById("loginBtn").addEventListener("click",async ()=>{

try{

const scopes=['username','payments'];

const auth=await Pi.authenticate(scopes,onIncompletePaymentFound);

currentUser=auth.user;

document.getElementById("username").innerText=currentUser.username;

document.getElementById("landing").style.display="none";

document.getElementById("dashboard").style.display="block";

generatePilgrimID();

}catch(err){

console.log(err)

}

})



/* ============================
LOGOUT
============================ */

document.getElementById("logoutBtn").onclick=()=>{

location.reload()

}



/* ============================
INCOMPLETE PAYMENT RECOVERY
============================ */

function onIncompletePaymentFound(payment){

console.log("Recovering payment",payment)

}



/* ============================
PILGRIM QR ID
============================ */

function generatePilgrimID(){

if(!currentUser)return;

let id="HARAMAIN-"+currentUser.username+"-"+Date.now();

document.getElementById("pid").innerText=id;

QRCode.toCanvas(

document.getElementById("qr"),

id,

function(error){

if(error) console.error(error)

}

)

}



/* ============================
PRAYER TIMES
============================ */

function loadPrayerTimes(){

let prayers=[

"Fajr - 05:10",
"Dhuhr - 12:20",
"Asr - 15:45",
"Maghrib - 18:10",
"Isha - 19:30"

]

let list=document.getElementById("prayerList");

list.innerHTML="";

prayers.forEach(p=>{

let li=document.createElement("li");
li.innerText=p;
list.appendChild(li);

})

}



/* ============================
CROWD ALERTS
============================ */

function loadAlerts(){

let alerts=[

"Gate 3 crowded",
"Tawaf area busy",
"Sa'i area moderate",
"Mina transport delayed"

]

let list=document.getElementById("alertsList");

list.innerHTML="";

alerts.forEach(a=>{

let li=document.createElement("li");
li.innerText=a;
list.appendChild(li);

})

}



/* ============================
BOOKING PAYMENT
============================ */

document.getElementById("payBtn").onclick=async()=>{

let amount=parseFloat(document.getElementById("amount").value);

if(!amount){

alert("Enter amount");

return;

}

try{

const payment=await Pi.createPayment({

amount:amount,

memo:"Hajj / Umrah Booking",

metadata:{type:"booking"}

},{

onReadyForServerApproval:function(paymentId){

console.log("approve",paymentId)

},

onReadyForServerCompletion:function(paymentId,txid){

console.log("complete",paymentId)

},

onCancel:function(paymentId){

console.log("cancel",paymentId)

},

onError:function(error){

console.log(error)

}

})

}catch(e){

console.log(e)

}

}



/* ============================
DONATION PAYMENT
============================ */

document.getElementById("donateBtn").onclick=async()=>{

let amount=parseFloat(document.getElementById("donateAmount").value);

if(!amount){

alert("Enter amount");

return;

}

try{

await Pi.createPayment({

amount:amount,

memo:"Zakat Donation",

metadata:{type:"donation"}

},{

onReadyForServerApproval:function(paymentId){

console.log("approve",paymentId)

},

onReadyForServerCompletion:function(paymentId,txid){

console.log("complete",paymentId)

addDonationHistory(amount)

},

onCancel:function(paymentId){

console.log("cancel")

},

onError:function(error){

console.log(error)

}

})

}catch(e){

console.log(e)

}

}



/* ============================
DONATION HISTORY
============================ */

function addDonationHistory(amount){

let li=document.createElement("li");

li.innerText="Donated "+amount+" π";

document.getElementById("donationHistory").appendChild(li)

}



/* ============================
WALLET SIMULATION
============================ */

document.getElementById("sendBtn").onclick=()=>{

let to=document.getElementById("sendTo").value;

let amt=document.getElementById("sendAmount").value;

let li=document.createElement("li");

li.innerText="Sent "+amt+" π to "+to;

document.getElementById("txHistory").appendChild(li)

}



/* ============================
BALANCE REFRESH
============================ */

document.getElementById("refreshBalance").onclick=()=>{

let balance=(Math.random()*100).toFixed(2);

document.getElementById("balance").innerText=balance

}
