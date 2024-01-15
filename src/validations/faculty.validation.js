const Joi = require("joi");
const validationMiddleWare = require("../middlewares/validation");

const createFaculty = Joi.object({
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

const getFacultyByID = Joi.object({
  params: Joi.object({
    id: Joi.string().required(),
  }),
});

const CreateF_Validation = validationMiddleWare(createFaculty);
const GetFByID_Validation = validationMiddleWare(getFacultyByID);

module.exports = { CreateF_Validation, GetFByID_Validation };
