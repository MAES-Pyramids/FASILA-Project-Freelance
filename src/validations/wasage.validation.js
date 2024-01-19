const Joi = require("joi");
const validationMiddleWare = require("../middlewares/validation");

const createOTPSchema = Joi.object({
  body: Joi.object({
    id: Joi.string().required(),
  }),
  query: Joi.object({
    type: Joi.string().valid("verify", "reset", "force").required(),
  }),
  params: Joi.object({}),
});

const CreateOTP_Validation = validationMiddleWare(createOTPSchema);
module.exports = { CreateOTP_Validation };
