const joi = require("joi");
const validationMiddleWare = require("../middlewares/validation");

const createSubjectSchema = joi.object({
  body: joi.object({
    name: joi.string().required(),
    semester: joi.number().required(),
    faculty: joi.string().required(),
    doctors: joi.array().items(joi.string()),
  }),
  query: joi.object({}),
  params: joi.object({}),
});

const getSubjectByIdSchema = joi.object({
  body: joi.object({}),
  query: joi.object({}),
  params: joi.object({
    id: joi.string().required(),
  }),
});

const getSubjectsSchema = joi.object({
  body: joi.object({}),
  query: joi.object({
    faculty: joi.string(),
    semester: joi.number(),
  }),
  params: joi.object({}),
});

const updateSubjectSchema = joi.object({
  body: joi.object({
    name: joi.string(),
    semester: joi.number(),
    doctors: joi.array().items(joi.string()),
  }),
  query: joi.object({}),
  params: joi.object({
    id: joi.string().required(),
  }),
});

const GetSubs_Validation = validationMiddleWare(getSubjectsSchema);
const CreateSub_Validation = validationMiddleWare(createSubjectSchema);
const UpdateSub_Validation = validationMiddleWare(updateSubjectSchema);
const GetSubByID_Validation = validationMiddleWare(getSubjectByIdSchema);

module.exports = {
  GetSubs_Validation,
  CreateSub_Validation,
  UpdateSub_Validation,
  GetSubByID_Validation,
};
