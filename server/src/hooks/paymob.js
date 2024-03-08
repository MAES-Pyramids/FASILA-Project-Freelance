const logger = require("../utils/logger");
const { checkHmacValidation } = require("../utils/payment");
const { createNewPL } = require("../services/purchases.service");

exports.receivePayment = async (req, res) => {
  if (req.body.type === "TRANSACTION") {
    const { hmac } = req.query;
    const requestBody = req.body;

    const { status, extractedFields } = checkHmacValidation(requestBody, hmac);
    if (!status) return res.status(400).send("Bad Request, Invalid Signature");

    const { amount_cents, created_at, id, success } = extractedFields;
    const { merchant_order_id, paid_amount_cents } = requestBody.obj.order;

    const [lecture, student] = merchant_order_id.split("-");

    if (success && paid_amount_cents === amount_cents) {
      const { status, message } = await createNewPL(
        student,
        lecture,
        paid_amount_cents,
        {
          transactionId: id,
          purchasedAt: created_at,
        }
      );
      if (!status) logger.error(message);
    }

    res.status(200).json({ received: true });
  }
};
