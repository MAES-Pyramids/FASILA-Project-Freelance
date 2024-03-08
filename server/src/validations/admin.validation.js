const Joi = require("joi");
const validationMiddleWare = require("../middlewares/validation");

const createAdminSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().required(),
  }),
  query: Joi.object({}),
  params: Joi.object({}),
});

const getAdminByIDSchema = Joi.object({
  body: Joi.object({}),
  query: Joi.object({}),
  params: Joi.object({
    id: Joi.string().required(),
  }),
});

const getAllAdminsSchema = Joi.object({
  body: Joi.object({}),
  query: Joi.object({}),
  params: Joi.object({}),
});

const createAdmin = validationMiddleWare(createAdminSchema);
const getAdminByID = validationMiddleWare(getAdminByIDSchema);
const getAllAdmins = validationMiddleWare(getAllAdminsSchema);

module.exports = {
  createAdmin,
  getAdminByID,
  getAllAdmins,
};
