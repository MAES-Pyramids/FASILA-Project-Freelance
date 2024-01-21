const Joi = require("joi");
const validationMiddleWare = require("../middlewares/validation");

const createDoctorSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().required(),
    faculty: Joi.string().required(),
  }),
  query: Joi.object({}),
  params: Joi.object({}),
});

const getDoctorByIDSchema = Joi.object({
  body: Joi.object({}),
  query: Joi.object({}),
  params: Joi.object({
    id: Joi.string().required(),
  }),
});

const getAllDoctorsSchema = Joi.object({
  body: Joi.object({}),
  query: Joi.object({
    faculty: Joi.string(),
  }),
  params: Joi.object({}),
});

const CreateDoc_Validation = validationMiddleWare(createDoctorSchema);
const GetDocByID_Validation = validationMiddleWare(getDoctorByIDSchema);
const GetAllDocs_Validation = validationMiddleWare(getAllDoctorsSchema);

module.exports = {
  CreateDoc_Validation,
  GetDocByID_Validation,
  GetAllDocs_Validation,
};
