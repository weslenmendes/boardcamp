import connection from "../config/database.js";

import {
  rentalsSchema,
  querySchema,
  metricsQuerySchema,
} from "../schemas/rentalSchema.js";

export const validateRental = async (req, res, next) => {
  const { customerId, gameId, daysRented } = req.body;

  const { error } = rentalsSchema.validate({ customerId, gameId, daysRented });

  if (error) {
    const allMessagesOfError = error.details
      .map(({ message }) => message)
      .join(", ");
    return res.status(400).send(allMessagesOfError);
  }

  try {
    const queryOne = {
      text: `
        SELECT 
          * 
        FROM
          customers
        WHERE
          (id = $1);
    `,
      values: [customerId],
    };

    const customerSearch = await connection.query(queryOne);

    if (customerSearch.rows.length === 0) {
      return res
        .status(400)
        .send(
          "Por favor, insira um id de cliente existente, esse cliente não existe.",
        );
    }

    const queryTwo = {
      text: `
        SELECT 
          * 
        FROM 
          games 
        WHERE 
          (id = $1);
      `,
      values: [gameId],
    };

    const gameSearch = await connection.query(queryTwo);

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

export const validateQueryRental = (req, res, next) => {
  const { error } = querySchema.validate(req.query);

  if (error) {
    const allMessagesOfError = error.details
      .map(({ message }) => message)
      .join(", ");
    return res.status(400).send(allMessagesOfError);
  }

  next();
};

export const validateQueryMetricsRental = (req, res, next) => {
  const { error } = metricsQuerySchema.validate(req.query);

  if (error) {
    const allMessagesOfError = error.details
      .map(({ message }) => message)
      .join(", ");
    return res.status(400).send(allMessagesOfError);
  }

  next();
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
