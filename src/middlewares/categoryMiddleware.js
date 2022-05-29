import connection from "../config/database.js";

import { categorySchema } from "../schemas/categorySchema.js";

export const validateCategory = async (req, res, next) => {
  const { name } = req.body;

  const { error } = categorySchema.validate({ name });

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
