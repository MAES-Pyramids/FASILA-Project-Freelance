const axios = require("axios");
const crypto = require("crypto");

const integration_id = process.env.Paymob_Integration_id;
const Paymob_CardIFrame = process.env.Paymob_CardIFrame;
const hmacSecret = process.env.Paymob_hmacSecret;
const Paymob_Key = process.env.Paymob_Key;

const AuthenticationReq = async () => {
  try {
    const { data } = await axios.post(
      "https://accept.paymob.com/api/auth/tokens",
      { api_key: Paymob_Key },
      { headers: { "Content-Type": "application/json" } }
    );
    return { status: true, token: data.token };
  } catch (err) {
    return { status: false, message: err.response.data };
  }
};

const OrderRegistrationReq = async (token, orderData, merchant_order_id) => {
  try {
    const { amount, item } = orderData;
    const { data } = await axios.post(
      "https://accept.paymob.com/api/ecommerce/orders",
      {
        auth_token: token,
        delivery_needed: false,
        amount_cents: amount,
        merchant_order_id: merchant_order_id,
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
    return { status: false, message: err.response.data };
  }
};

const PaymentKeyReq = async (token, orderId, customerData, amount) => {
  try {
    const { data } = await axios.post(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      {
        auth_token: token,
        amount_cents: amount,
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
    return { status: false, message: err.response.data };
  }
};
//------------------------------------------------------------//
const getCardIframe = async (merchant_id, customerData, orderData) => {
  try {
    let status, token, orderId, key, message;
    ({ status, token, message } = await AuthenticationReq());
    if (!status) throw new Error(message);

    ({ status, orderId, message } = await OrderRegistrationReq(
      token,
      orderData,
      merchant_id
    ));
    if (!status) throw new Error(message);

    ({ status, key, message } = await PaymentKeyReq(
      token,
      orderId,
      customerData,
      orderData.amount
    ));
    if (!status) throw new Error(message);

    return { status: true, IFrame: Paymob_CardIFrame + key };
  } catch (err) {
    return { status: false, message: err };
  }
};
//------------------------------------------------------------//
const checkHmacValidation = (requestBodyObj, hmac) => {
  const extractedFields = {
    amount_cents: requestBodyObj.obj.amount_cents,
    created_at: requestBodyObj.obj.created_at,
    currency: requestBodyObj.obj.currency,
    error_occured: requestBodyObj.obj.error_occured,
    has_parent_transaction: requestBodyObj.obj.has_parent_transaction,
    id: requestBodyObj.obj.id,
    integration_id: requestBodyObj.obj.integration_id,
    is_3d_secure: requestBodyObj.obj.is_3d_secure,
    is_auth: requestBodyObj.obj.is_auth,
    is_capture: requestBodyObj.obj.is_capture,
    is_refunded: requestBodyObj.obj.is_refunded,
    is_standalone_payment: requestBodyObj.obj.is_standalone_payment,
    is_voided: requestBodyObj.obj.is_voided,
    order_id: requestBodyObj.obj.order.id,
    owner: requestBodyObj.obj.owner,
    pending: requestBodyObj.obj.pending,
    source_data_pan: requestBodyObj.obj.source_data.pan,
    source_data_sub_type: requestBodyObj.obj.source_data.sub_type,
    source_data_type: requestBodyObj.obj.source_data.type,
    success: requestBodyObj.obj.success,
  };

  // Sort the keys lexicographically
  const sortedKeys = Object.keys(extractedFields).sort();

  // Concatenate values of sorted keys
  const concatenatedValues = sortedKeys
    .map((key) => extractedFields[key])
    .join("");

  // Calculate the hash of the concatenated string using SHA512 and HMAC secret
  const RHmac = crypto.createHmac("sha512", hmacSecret);
  RHmac.update(concatenatedValues);
  const hash = RHmac.digest("hex");

  return { status: hash === hmac, extractedFields };
};
//------------------------------------------------------------//
module.exports = { getCardIframe, checkHmacValidation };
