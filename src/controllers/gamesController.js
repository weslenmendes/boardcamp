import connection from "./../config/database.js";

import buildQuery from "./../utils/buildQuery.js";

export async function listGames(req, res) {
  const { offset, limit, orderBy } = buildQuery(req.query);
  const { name } = req.query;

  try {
    const query = {
      text: `
        SELECT 
          g.*, 
          c.name AS "categoryName" 
        FROM 
          games g
        JOIN 
          categories c
        ON 
          (g."categoryId" = c.id)
        WHERE
          (g.name ILIKE $1)
        ${orderBy}
        ${offset}
        ${limit};  
        `,
      values: [`${name || ""}%`],
    };

    const { rows } = await connection.query(query);

    res.send(rows);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

export async function createGame(req, res) {
  try {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    const query = {
      text: `
        INSERT INTO 
          games(name, image, "stockTotal", "categoryId", "pricePerDay") 
        VALUES 
            ($1, $2, $3, $4, $5);`,
      values: [name, image, stockTotal, categoryId, pricePerDay],
    };

    await connection.query(query);

    res.sendStatus(201);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}
