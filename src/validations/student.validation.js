const Joi = require("joi");
const validationMiddleWare = require("../middlewares/validation");

const signUpSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(1).max(255),
    phone: Joi.string().length(12).required().messages({
      "string.length": "Phone number must be 12 digits long.",
    }),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-zA-Z])(?=.*\d).*$/)
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters long.",
        "string.pattern.base":
          "Password must contain both letters and numbers.",
      }),
    gender: Joi.string().valid("male", "female").required(),
    semester: Joi.number().integer().required(),
    facultyCard: Joi.string(),
    faculty: Joi.string(),
  }),
  query: Joi.object({}),
  params: Joi.object({}),
});

const Signup_Validation = validationMiddleWare(signUpSchema);
module.exports = { Signup_Validation };
