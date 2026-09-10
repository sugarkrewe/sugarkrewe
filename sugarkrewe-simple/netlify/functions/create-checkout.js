exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { items } = JSON.parse(event.body);
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    let body = "mode=payment";
    body += "&success_url=https://sugarkrewe.com/success.html";
    body += "&cancel_url=https://sugarkrewe.com/";
    body += "&payment_method_types[0]=card";

    items.forEach((item, i) => {
      body += `&line_items[${i}][price_data][currency]=usd`;
      body += `&line_items[${i}][price_data][unit_amount]=699`;
      body += `&line_items[${i}][price_data][product_data][name]=${encodeURIComponent(item.name)}`;
      body += `&line_items[${i}][quantity]=${item.qty}`;
    });

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + stripeKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    });

    const session = await response.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: session.url, error: session.error }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
