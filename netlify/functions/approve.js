const axios = require("axios");

exports.handler = async function(event, context) {
  try {
    const { paymentId, userId } = JSON.parse(event.body);

    // Example: Call Pi API to approve payment
    const response = await axios.post("https://api.minepi.com/v2/payments/approve", {
      paymentId,
      userId
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Payment approved successfully",
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
