const Joi = require("joi");
const validationMiddleWare = require("../middlewares/validation");

const createUniversitySchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(100),
  }),
  query: Joi.object({}),
  params: Joi.object({}),
});

const getUniversityByIDSchema = Joi.object({
  body: Joi.object({}),
  query: Joi.object({}),
  params: Joi.object({
    id: Joi.string().required(),
  }),
});

const getALLUniversitiesSchema = Joi.object({
  body: Joi.object({}),
  query: Joi.object({}),
  params: Joi.object({}),
});

const CreateUniversity_Validation = validationMiddleWare(
  createUniversitySchema
);
const GetUniversityByID_Validation = validationMiddleWare(
  getUniversityByIDSchema
);
const GetALLUniversities_Validation = validationMiddleWare(
  getALLUniversitiesSchema
);
module.exports = {
  CreateUniversity_Validation,
  GetUniversityByID_Validation,
  GetALLUniversities_Validation,
};
