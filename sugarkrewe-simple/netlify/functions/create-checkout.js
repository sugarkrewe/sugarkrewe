const https = require("https");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({error: "Method not allowed"})
    };
  }

  try {
    const { items } = JSON.parse(event.body);
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    let body = "mode=payment";
    body += "&success_url=https://sugarkrewe.com/success.html";
    body += "&cancel_url=https://sugarkrewe.com/";
    body += "&payment_method_types[0]=card";

    items.forEach((item, i) => {
      body += "&line_items[" + i + "][price_data][currency]=usd";
      body += "&line_items[" + i + "][price_data][unit_amount]=699";
      body += "&line_items[" + i + "][price_data][product_data][name]=" + encodeURIComponent(item.name);
      body += "&line_items[" + i + "][quantity]=" + item.qty;
    });

    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: "api.stripe.com",
        path: "/v1/checkout/sessions",
        method: "POST",
        headers: {
          "Authorization": "Bearer " + stripeKey,
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body),
        },
      };
      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", chunk => data += chunk);
        res.on("end", () => resolve(JSON.parse(data)));
      });
      req.on("error", reject);
      req.write(body);
      req.end();
    });

    return {
      statusCode: 200,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({url: result.url, error: result.error}),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({error: err.message}),
    };
  }
};
