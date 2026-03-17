exports.handler = async (event) => {

  const { paymentId } = JSON.parse(event.body);

  return {
    statusCode: 200,
    body: JSON.stringify({ completed: true })
  };
};
