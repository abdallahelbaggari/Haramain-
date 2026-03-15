// netlify/functions/payment.js

const axios = require("axios");

const PI_API = "https://api.minepi.com/v2/payments";

// Use your Pi Developer Key
const PI_API_KEY = process.env.PI_API_KEY;

exports.handler = async function (event, context) {

  const method = event.httpMethod;

  try {

    // -----------------------------
    // Create Payment
    // -----------------------------
    if (method === "POST") {

      const data = JSON.parse(event.body);

      const paymentData = {
        amount: data.amount,
        memo: data.memo,
        metadata: data.metadata,
        uid: data.uid
      };

      const response = await axios.post(
        PI_API,
        paymentData,
        {
          headers: {
            Authorization: `Key ${PI_API_KEY}`
          }
        }
      );

      return {
        statusCode: 200,
        body: JSON.stringify(response.data)
      };

    }

    // -----------------------------
    // Complete Payment
    // -----------------------------
    if (method === "PUT") {

      const data = JSON.parse(event.body);

      const paymentId = data.paymentId;

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
        body: JSON.stringify(response.data)
      };

    }

    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request method" })
    };

  } catch (error) {

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };

  }

};
