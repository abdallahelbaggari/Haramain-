// Pi SDK

Pi.init({version:"2.0",sandbox:true});

let currentUser=null;


// LOGIN

document.getElementById("loginBtn").onclick=async()=>{

try{

const auth=await Pi.authenticate(["username","payments"],onIncompletePayment);

currentUser=auth.user;

document.getElementById("username").innerText=currentUser.username;

document.getElementById("landing").style.display="none";

document.getElementById("dashboard").style.display="block";

generateID();

}catch(e){console.log(e)}

};


document.getElementById("logoutBtn").onclick=()=>location.reload();



// PILGRIM QR ID

function generateID(){

const id="PILGRIM-"+Math.floor(Math.random()*100000);

document.getElementById("pid").innerText=id;

QRCode.toCanvas(document.getElementById("qr"),id);

}



// SHOW UTILITIES

function hideAll(){

document.querySelectorAll(".utility").forEach(u=>u.style.display="none");

}

function show(id){

hideAll();

document.getElementById(id).style.display="block";

}

btnID.onclick=()=>show("pilgrimID");

btnBooking.onclick=()=>show("booking");

btnWallet.onclick=()=>show("wallet");

btnPrayer.onclick=()=>show("prayer");

btnAlerts.onclick=()=>show("alerts");

btnDonate.onclick=()=>show("donations");



// PAYMENT SYSTEM

function createPayment(amount,memo){

Pi.createPayment({

amount:parseFloat(amount),

memo:memo,

metadata:{type:memo}

},{

onReadyForServerApproval:function(paymentId){

fetch("/.netlify/functions/approve",{

method:"POST",

headers:{"Content-Type":"application/json"},

body:JSON.stringify({paymentId})

});

},

onReadyForServerCompletion:function(paymentId){

fetch("/.netlify/functions/complete",{

method:"POST",

headers:{"Content-Type":"application/json"},

body:JSON.stringify({paymentId})

});

},

onCancel:function(){alert("Payment Cancelled")},

onError:function(e){console.log(e)}

});

}



// BOOKING PAYMENT

payBtn.onclick=()=>{

const amount=document.getElementById("amount").value;

createPayment(amount,"Hajj Booking");

};



// DONATION PAYMENT

donateBtn.onclick=()=>{

const amount=document.getElementById("donateAmount").value;

createPayment(amount,"Donation");

};



// HANDLE INCOMPLETE PAYMENTS

function onIncompletePayment(payment){

fetch("/.netlify/functions/complete",{

method:"POST",

headers:{"Content-Type":"application/json"},

body:JSON.stringify({paymentId:payment.identifier})

});

}



// WALLET SIMULATION

let balance=100;

balance.innerText=balance;

sendBtn.onclick=()=>{

let amt=parseFloat(sendAmount.value);

if(amt<=balance){

balance-=amt;

document.getElementById("balance").innerText=balance;

let li=document.createElement("li");

li.innerText="Sent "+amt+" π";

txHistory.appendChild(li);

}

};



// PRAYER TIMES

["Fajr 5:10","Dhuhr 12:20","Asr 3:45","Maghrib 6:30","Isha 7:50"]

.forEach(p=>{

let li=document.createElement("li");

li.innerText=p;

prayerList.appendChild(li);

});



// ALERTS

["Crowd high near Tawaf","Heat warning","Gate 4 closed"]

.forEach(a=>{

let li=document.createElement("li");

li.innerText=a;

alertsList.appendChild(li);

});



// LANGUAGE SWITCH

function switchLanguage(lang){

document.querySelectorAll("[data-lang-en]").forEach(el=>{

let text=el.getAttribute("data-lang-"+lang);

if(text) el.innerText=text;

});

if(lang==="ar") document.body.dir="rtl";
else document.body.dir="ltr";

}

langSelect.onchange=(e)=>switchLanguage(e.target.value);
