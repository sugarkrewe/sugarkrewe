    exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { items } = JSON.parse(event.body);
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    const lineItems = items.map(item => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: 699,
      },
      quantity: item.qty,
    }));

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "payment_method_types[]": "card",
        "mode": "payment",
        "success_url": `${process.env.URL}/success.html`,
        "cancel_url": `${process.env.URL}/`,
        ...Object.fromEntries(lineItems.flatMap((item, i) => [
          [`line_items[${i}][price_data][currency]`, "usd"],
          [`line_items[${i}][price_data][product_data][name]`, item.price_data.product_data.name],
          [`line_items[${i}][price_data][unit_amount]`, "699"],
          [`line_items[${i}][quantity]`, String(item.quantity)],
        ])),
      }).toString(),
    });

    const session = await response.json();
    
    if (session.error) {
      throw new Error(session.error.message);
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
