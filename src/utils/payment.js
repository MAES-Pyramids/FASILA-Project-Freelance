const axios = require("axios");

const Paymob_Key = process.env.Paymob_Key;
const integration_id = process.env.Paymob_Integration_id;
const Paymob_CardIFrame = process.env.Paymob_CardIFrame;

const AuthenticationReq = async () => {
  try {
    const { data } = await axios.post(
      "https://accept.paymob.com/api/auth/tokens",
      { api_key: Paymob_Key },
      { headers: { "Content-Type": "application/json" } }
    );
    return { status: true, token: data.token };
  } catch (err) {
    return { status: false, message: err };
  }
};

const OrderRegistrationReq = async (orderData, lectureId) => {
  try {
    const { status, token, message } = await AuthenticationReq();
    if (!status) throw new Error(message);

    const { amount, item } = orderData;
    const { data } = await axios.post(
      "https://accept.paymob.com/api/ecommerce/orders",
      {
        auth_token: token,
        delivery_needed: false,
        amount_cents: amount * 100,
        merchant_order_id: lectureId,
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
    return { status: true, orderId: data.id };
  } catch (err) {
    return { status: false, message: err };
  }
};

const PaymentKeyReq = async (orderId, customerData) => {
  try {
    const { status, token, message } = await AuthenticationReq();
    if (!status) throw new Error(message);

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
    return { status: true, key: data.token };
  } catch (err) {
    return { status: false, message: err };
  }
};

const getCardIframe = async (orderId, customerData) => {
  try {
    const { status, key, message } = await PaymentKeyReq(orderId, customerData);
    if (!status) throw new Error(message);

    return { status: true, IFrame: Paymob_CardIFrame + key };
  } catch (err) {
    return { status: false, message: err };
  }
};

module.exports = { OrderRegistrationReq, getCardIframe };
