const Joi = require("joi");
const validationMiddleWare = require("../middlewares/validation");

const createFacultySchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(100),
    no_of_semesters: Joi.number().integer().required(),
    UniversityID: Joi.string().required(),
  }),
  query: Joi.object({}),
  params: Joi.object({
    id: Joi.string(),
  }),
});

const getFacultyByIDSchema = Joi.object({
  body: Joi.object({}),
  query: Joi.object({}),
  params: Joi.object({
    id: Joi.string().required(),
  }),
});

const getAllFacultiesSchema = Joi.object({
  body: Joi.object({}),
  query: Joi.object({
    universityID: Joi.string(),
  }),
  params: Joi.object({}),
});

const CreateF_Validation = validationMiddleWare(createFacultySchema);
const GetFByID_Validation = validationMiddleWare(getFacultyByIDSchema);
const GetAllFs_Validation = validationMiddleWare(getAllFacultiesSchema);

module.exports = {
  CreateF_Validation,
  GetFByID_Validation,
  GetAllFs_Validation,
};
