import Joi from "joi";

export const gameSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().pattern(new RegExp("^http(s)?://")).required(),
  stockTotal: Joi.number().integer().min(1).required(),
  categoryId: Joi.number().integer().required(),
  pricePerDay: Joi.number().integer().min(1).required(),
});

export const querySchema = Joi.object({
  offset: Joi.number().integer().min(0),
  limit: Joi.number().integer().min(1),
  order: Joi.string().valid(
    "id",
    "name",
    "stockTotal",
    "categoryId",
    "pricePerday",
    "categoryName",
    "rentalsCount",
  ),
  desc: Joi.boolean(),
});
