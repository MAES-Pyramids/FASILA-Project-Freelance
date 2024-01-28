const crypto = require("crypto");

exports.receivePayment = async (req, res) => {
  const { hmac } = req.query;
  const requestBodyObj = req.body;
  const hmacSecret = process.env.Paymob_hmacSecret;

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

  console.log("hash", hash);
  console.log("hmac", hmac);
  console.log("hmac === hash", hmac === hash);
};
