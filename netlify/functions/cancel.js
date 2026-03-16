const axios = require("axios");

exports.handler = async function(event, context) {
  try {
    const { paymentId, userId } = JSON.parse(event.body);

    // Example: Cancel the payment
    const response = await axios.post("https://api.minepi.com/v2/payments/cancel", {
      paymentId,
      userId
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Payment canceled successfully",
        data: response.data
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
