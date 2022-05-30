import connection from "./../config/database.js";

import { gameSchema, querySchema } from "./../schemas/gameSchema.js";

export const validateBodyGame = async (req, res, next) => {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  const { error } = gameSchema.validate(
    {
      name,
      image,
      stockTotal,
      categoryId,
      pricePerDay,
    },
    { abortEarly: false },
  );

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
          categories 
        WHERE 
          (id = $1);
      `,
      values: [categoryId],
    };

    const categorieSearch = await connection.query(queryOne);

    if (categorieSearch.rows.length === 0) {
      return res
        .status(400)
        .send(
          "Por favor, insira um id de categoria existente, essa categoria não existe.",
        );
    }

    const queryTwo = {
      text: `
        SELECT 
          * 
        FROM 
          games 
        WHERE 
          (name = $1);
      `,
      values: [name],
    };

    const nameSearch = await connection.query(queryTwo);

    if (nameSearch.rows.length > 0) {
      return res
        .status(409)
        .send(
          "Por favor, insira um nome de jogo diferente, esse jogo já existe.",
        );
    }

    res.locals.categoryName = categorieSearch.rows[0].name;

    next();
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

export const validateQueryGame = (req, res, next) => {
  const { error } = querySchema.validate(req.query, {
    abortEarly: false,
  });

  if (error) {
    const allMessagesOfError = error.details
      .map((err) => err.message)
      .join(", ");

    return res.status(400).json(allMessagesOfError);
  }

  next();
};
