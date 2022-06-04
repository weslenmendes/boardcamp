import Joi from "joi";

export const customerSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,11}$/)
    .required(),
  cpf: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .required(),
  birthday: Joi.date().required(),
});

export const querySchema = Joi.object({
  cpf: Joi.string().allow(""),
  offset: Joi.number().integer().min(0),
  limit: Joi.number().integer().min(1),
  order: Joi.string().valid(
    "id",
    "name",
    "phone",
    "cpf",
    "birthday",
    "rentalsCount",
  ),
  desc: Joi.boolean(),
});
