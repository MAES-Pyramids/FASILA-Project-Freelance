const Joi = require("joi");
const validationMiddleWare = require("../middlewares/validation");

const userLoginSchema = Joi.object({
  body: Joi.object({
    phone: Joi.string().length(12).required().messages({
      "string.length": "Phone number must be 12 digits long.",
    }),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-zA-Z])(?=.*\d).*$/)
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters long.",
        "string.pattern.base": "Password must contain both letters & numbers.",
      }),
  }),
  query: Joi.object({}),
  params: Joi.object({}),
});

const Login_Validation = validationMiddleWare(userLoginSchema);
module.exports = { Login_Validation };
