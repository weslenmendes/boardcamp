import Joi from "joi";

import connection from "../config/database.js";

export const validateCategory = async (req, res, next) => {
  const { name } = req.body;

  const categorySchema = Joi.object({
    name: Joi.string().required(),
  });

  const { error } = categorySchema.validate({ name });

  if (error) {
    return res
      .status(400)
      .send("Por favor, insira um name não vázio e válido.");
  }

  try {
    const query = "SELECT * FROM categories WHERE (name = $1);";
    const value = [name];

    const { rows } = await connection.query(query, value);

    if (rows.length > 0) {
      return res
        .status(409)
        .send("Por favor, insira outra categoria, essa categoria já existe.");
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
    const queryOne = "SELECT * FROM categories WHERE (id = $1);";
    const valueOne = [categoryId];

    const categorieSearch = await connection.query(queryOne, valueOne);

    if (categorieSearch.rows.length === 0) {
      return res
        .status(400)
        .send(
          "Por favor, insira um id de categoria existente, essa categoria não existe.",
        );
    }

    const queryTwo = "SELECT * FROM games WHERE (name = $1);";
    const valueTwo = [name];

    const nameSearch = await connection.query(queryTwo, valueTwo);

    if (nameSearch.rows.length > 0) {
      return res
        .status(409)
        .send(
          "Por favor, insira um nome de jogo diferente, esse jogo já existe.",
        );
    }

    res.locals.categoryName = categorieSearch.rows[0].name;
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

  next();
};

export const validateCustomer = async (req, res, next) => {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;

  const customerSchema = Joi.object({
    name: Joi.string().required().messages({
      "string.base": "Por favor, insira um nome não vazio e válido.",
      "string.empty": "Por favor, insira um nome não vazio.",
    }),
    phone: Joi.string()
      .pattern(/[0-9]{10,11}/)
      .required()
      .messages({
        "string.pattern.base":
          "Por favor, insira um telefone válido, deve ser uma string contendo apenas números, com 10 ou 11 dígitos.",
      }),
    cpf: Joi.string()
      .pattern(/[0-9]{11}/)
      .required()
      .messages({
        "string.empty": "Por favor, insira um cpf não vazio.",
        "string.pattern.base":
          "Por favor, insira um CPF válido, deve ser uma string com apenas números e com 11 dígitos.",
      }),
    birthday: Joi.date().required().messages({
      "date.base":
        "Por favor, insira uma string com uma data de nascimento válida.",
    }),
  });

  const { error } = customerSchema.validate({ name, phone, cpf, birthday });

  if (error) {
    const allMessagesOfError = error.details
      .map(({ message }) => message)
      .join(", ");
    return res.status(400).send(allMessagesOfError);
  }

  try {
    const query = {
      text: `
        SELECT 
          * 
        FROM 
          customers
        WHERE
          (cpf = $1);
      `,
      values: [cpf],
    };

    const { rows } = await connection.query(query);

    const isCreateCustomer = rows.length === 0 && !id;
    const isUpdateCustomer =
      rows.length > 0 && id && parseInt(id) !== rows[0].id;

    if (isCreateCustomer || isUpdateCustomer) {
      return res.status(409).send("Por favor, insira outro cpf.");
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

  next();
};
