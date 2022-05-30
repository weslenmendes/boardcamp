import connection from "../config/database.js";

import { categorySchema, querySchema } from "../schemas/categorySchema.js";

export const validateBodyCategory = async (req, res, next) => {
  const { name } = req.body;

  const { error } = categorySchema.validate({ name }, { abortEarly: false });

  if (error) {
    return res
      .status(400)
      .send("Por favor, insira um name não vazio e válido.");
  }

  try {
    const query = {
      text: `
        SELECT
          *
        FROM
          categories
        WHERE
          (name = $1);
      `,
      values: [name],
    };

    const { rows } = await connection.query(query);

    if (rows.length > 0) {
      return res
        .status(409)
        .send("Por favor, insira outra categoria, essa categoria já existe.");
    }

    next();
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
};

export const validateQueryCategory = (req, res, next) => {
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
