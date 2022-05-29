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

export const validateRental = async (req, res, next) => {
  const { customerId, gameId, daysRented } = req.body;

  const rentalsSchema = Joi.object({
    customerId: Joi.number().integer().required().messages({
      "number.base": "Por favor, insira um id do tipo number e inteiro.",
      "number.integer": "Por favor, insira um id do tipo number e inteiro.",
    }),
    gameId: Joi.number().integer().required().messages({
      "number.base": "Por favor, insira um id do tipo number e inteiro.",
      "number.integer": "Por favor, insira um id do tipo number e inteiro.",
    }),
    daysRented: Joi.number().integer().min(1).required().messages({
      "number.base": "Por favor, insira um id do tipo number e inteiro.",
      "number.integer": "Por favor, insira um id do tipo number e inteiro.",
      "number.min": "Por favor, insira um número maior que 0.",
    }),
  });

  const { error } = rentalsSchema.validate({ customerId, gameId, daysRented });

  if (error) {
    const allMessagesOfError = error.details
      .map(({ message }) => message)
      .join(", ");
    return res.status(400).send(allMessagesOfError);
  }

  try {
    const queryOne = "SELECT * FROM customers WHERE (id = $1);";
    const valueOne = [customerId];

    const customerSearch = await connection.query(queryOne, valueOne);

    if (customerSearch.rows.length === 0) {
      return res
        .status(400)
        .send(
          "Por favor, insira um id de cliente existente, esse cliente não existe.",
        );
    }

    const queryTwo = "SELECT * FROM games WHERE (id = $1);";
    const valueTwo = [gameId];

    const gameSearch = await connection.query(queryTwo, valueTwo);

    if (gameSearch.rows.length === 0) {
      return res
        .status(400)
        .send(
          "Por favor, insira um id de jogo existente, esse jogo não existe.",
        );
    }

    if (gameSearch.rows[0].stockTotal < 1) {
      return res
        .status(400)
        .send("Por favor, insira outro jogo, esse jogo não está disponível.");
    }

    res.locals.pricePerDay = gameSearch.rows[0].pricePerDay;

    next();
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
};

export const validateReturnRental = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const query = {
      text: `
        SELECT
          *
        FROM
          rentals
        WHERE
          (id = $1);
      `,
      values: [id],
    };

    const { rows } = await connection.query(query);

    if (rows.length === 0) {
      return res
        .status(404)
        .send("Por favor, insira um id de aluguel existente.");
    }

    if (rows[0].returnDate) {
      return res.status(400).send("Esse jogo já foi devolvido.");
    }

    res.locals.rentDate = rows[0].rentDate;
    res.locals.pricePerDay = rows[0].originalPrice / rows[0].daysRented;
    res.locals.id = id;

    next();
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

export const validateDeleteRental = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const query = {
      text: `
        SELECT
          *
        FROM
          rentals
        WHERE
          (id = $1);
      `,
      values: [id],
    };

    const { rows } = await connection.query(query);

    if (rows.length === 0) {
      return res
        .status(404)
        .send("Por favor, insira um id de aluguel existente.");
    }

    if (rows[0].returnDate) {
      return res.status(400).send("Esse jogo já foi devolvido.");
    }

    res.locals.id = id;
    res.locals.daysRented = parseInt(rows[0].daysRented);

    next();
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};
