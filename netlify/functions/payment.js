exports.handler = async (event) => {

  const { amount } = JSON.parse(event.body);

  return {
    statusCode: 200,
    body: JSON.stringify({
      payment: {
        amount: amount,
        memo: "Haramain Booking",
        metadata: { type: "booking" }
      }
    })
  };
};
