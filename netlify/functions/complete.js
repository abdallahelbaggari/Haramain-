// netlify/functions/complete.js

const axios = require("axios");

const PI_API = "https://api.minepi.com/v2/payments";
const PI_API_KEY = process.env.PI_API_KEY;

exports.handler = async function (event, context) {

  try {

    const data = JSON.parse(event.body);
    const paymentId = data.paymentId;

    if (!paymentId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Payment ID is required"
        })
      };
    }

    const response = await axios.post(
      `${PI_API}/${paymentId}/complete`,
      {},
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`
        }
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: response.data
      })
    };

  } catch (error) {

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };

  }

};
