const axios = require("axios");

const Paymob_Key = process.env.Paymob_Key;
const integration_id = process.env.Paymob_Integration_id;

const AuthenticationReq = async () => {
  const { data } = await axios.post(
    "https://accept.paymob.com/api/auth/tokens",
    { api_key: Paymob_Key },
    { headers: { "Content-Type": "application/json" } }
  );
  return data.token;
};

const OrderRegistrationReq = async (token, amount, orderId, item) => {
  const { data } = await axios.post(
    "https://accept.paymob.com/api/ecommerce/orders",
    {
      auth_token: token,
      delivery_needed: false,
      amount_cents: amount * 100,
      // merchant_order_id: orderId,
      currency: "EGP",
      items: [item],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data.id;
};

const PaymentKeyReq = async (token, orderId, customerData) => {
  const { data } = await axios.post(
    "https://accept.paymob.com/api/acceptance/payment_keys",
    {
      auth_token: token,
      amount_cents: 100,
      expiration: 1200,
      order_id: orderId,
      billing_data: {
        first_name: customerData.first_name,
        last_name: customerData.last_name,
        phone_number: `+${customerData.phone}`,
        email: "mohamed.11021@stemgharbiya.moe.edu.eg",
        apartment: "NA",
        floor: "NA",
        street: "NA",
        building: "NA",
        shipping_method: "NA",
        postal_code: "NA",
        city: "NA",
        country: "NA",
        state: "NA",
      },
      currency: "EGP",
      integration_id: integration_id,
      lock_order_when_paid: true,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data.token;
};

const getCardIframe = async (token, orderId, customerData) => {
  try {
    const key = await PaymentKeyReq(token, orderId, customerData);
    return `https://accept.paymob.com/api/acceptance/iframes/819222?payment_token=${key}`;
  } catch (error) {
    throw error;
  }
};
