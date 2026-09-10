const https = require("https");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { items } = JSON.parse(event.body);
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("payment_method_types[]", "card");
    params.append("success_url", "https://sugarkrewe.com/success.html");
    params.append("cancel_url", "https://sugarkrewe.com/");

    items.forEach((item, i) => {
      params.append(`line_items[${i}][price_data][currency]`, "usd");
      params.append(`line_items[${i}][price_data][unit_amount]`, "699");
      params.append(`line_items[${i}][price_data][product_data][name]`, item.name);
      params.append(`line_items[${i}][quantity]`, String(item.qty));
    });

    const result = await new Promise((resolve, reject) => {
      const postData = params.toString();
      const options = {
        hostname: "api.stripe.com",
        path: "/v1/checkout/sessions",
        method: "POST",
        headers: {
          "Authorization": `Bearer ${stripeKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(postData),
        },
      };
      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => data += chunk);
        res.on("end", () => resolve(JSON.parse(data)));
      });
      req.on("error", reject);
      req.write(postData);
      req.end();
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        url: result.url,
        error: result.error,
        debug: result
      }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
