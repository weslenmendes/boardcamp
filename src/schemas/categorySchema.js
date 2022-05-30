import Joi from "joi";

export const categorySchema = Joi.object({
  name: Joi.string().required(),
});

export const querySchema = Joi.object({
  offset: Joi.number().integer().min(0),
  limit: Joi.number().integer().min(1),
  order: Joi.string().valid("id", "name"),
  desc: Joi.boolean(),
});
