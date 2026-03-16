Pi.createPayment({
  amount: 1,
  memo: "Donation",
  metadata: {type:"donation"}
},{
  onReadyForServerApproval: function(paymentId){
    fetch("/.netlify/functions/approve",{
      method:"POST",
      body: JSON.stringify({paymentId})
    })
  },

  onReadyForServerCompletion: function(paymentId){
    fetch("/.netlify/functions/complete",{
      method:"POST",
      body: JSON.stringify({paymentId})
    })
  }
});
