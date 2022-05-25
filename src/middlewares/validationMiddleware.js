import Joi from "joi";

import connection from "../config/database.js";

export const validateCategory = async (req, res, next) => {
  const { name } = req.body;

  const categorySchema = Joi.object({
    name: Joi.string().required(),
  });

  const { error } = categorySchema.validate({ name });

  if (error) {
    return res.status(400).send("name não pode ser vazio.");
  }

  try {
    const query = "SELECT * FROM categories WHERE name = $1;";
    const value = [name];

    const { rows } = await connection.query(query, value);

    if (rows.length > 0) {
      return res.status(409).send("Essa categoria já existe.");
    }
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }

  next();
};

export const validateGame = async (req, res, next) => {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  const gameSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().pattern(new RegExp("^http(s)?://")).required(),
    stockTotal: Joi.number().integer().min(1).required(),
    categoryId: Joi.number().integer().required(),
    pricePerDay: Joi.number().integer().min(1).required(),
  });

  const { error } = gameSchema.validate({
    name,
    image,
    stockTotal,
    categoryId,
    pricePerDay,
  });

  if (error) {
    const allMessagesOfError = error.details
      .map(({ message }) => message)
      .join(", ");
    return res.status(400).send(allMessagesOfError);
  }

  try {
    const categorieSearch = await connection.query(
      "SELECT * FROM categories WHERE (id = $1);",
      [categoryId],
    );

    if (categorieSearch.rows.length === 0) {
      return res
        .status(400)
        .send("Por favor, insira um id de categoria existente.");
    }

    const nameSearch = await connection.query(
      "SELECT id FROM games WHERE (name = $1);",
      [name],
    );

    if (nameSearch.rows.length > 0) {
      return res
        .status(409)
        .send("Por favor, insira um nome de jogo diferente.");
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

  next();
};
