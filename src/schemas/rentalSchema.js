import Joi from "joi";

export const rentalsSchema = Joi.object({
  customerId: Joi.number().integer().required(),
  gameId: Joi.number().integer().required(),
  daysRented: Joi.number().integer().min(1).required(),
});

export const querySchema = Joi.object({
  customerId: Joi.number().integer(),
  gameId: Joi.number().integer(),
  status: Joi.string().valid("open", "closed"),
  startDate: Joi.date().iso(),
  offset: Joi.number().integer().min(0),
  limit: Joi.number().integer().min(1),
  order: Joi.string().valid(
    "id",
    "customerId",
    "gameId",
    "rentDate",
    "returnDate",
    "daysRented",
    "originalPrice",
  ),
  desc: Joi.boolean(),
});

export const metricsQuerySchema = Joi.object({
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
});
