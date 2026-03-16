const axios=require("axios");

exports.handler=async(event)=>{

const {paymentId}=JSON.parse(event.body);

await axios.post(
"https://api.minepi.com/v2/payments/"+paymentId+"/approve",
{},
{headers:{Authorization:`Key ${process.env.PI_API_KEY}`}}
);

return {statusCode:200};

};
