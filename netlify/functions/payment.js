// netlify/functions/payment.js

const axios = require("axios");

const PI_API = "https://api.minepi.com/v2/payments";
const PI_API_KEY = process.env.PI_API_KEY;

exports.handler = async function (event, context) {

  const method = event.httpMethod;

  try {

    const data = JSON.parse(event.body || "{}");

    // -----------------------------
    // CREATE PAYMENT
    // -----------------------------
    if (method === "POST") {

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
    // APPROVE PAYMENT
    // -----------------------------
    if (method === "PATCH") {

      const paymentId = data.paymentId;

      const response = await axios.post(
        `${PI_API}/${paymentId}/approve`,
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

    // -----------------------------
    // COMPLETE PAYMENT
    // -----------------------------
    if (method === "PUT") {

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
        error: error.response?.data || error.message
      })
    };

  }

};
