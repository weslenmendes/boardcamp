import connection from "./../config/database.js";

import buildQuery from "./../utils/buildQuery.js";

export async function listGames(req, res) {
  const { offset, limit, orderBy } = buildQuery(req.query);
  const { name } = req.query;

  try {
    const query = {
      text: `
        SELECT 
          games.*, 
          categories.name AS "categoryName",
          COUNT (rentals.id)::INTEGER AS "rentalsCount"
        FROM 
          games
        LEFT JOIN 
          categories
        ON 
          (games."categoryId" = categories.id)
        LEFT JOIN
          rentals
        ON
          (games.id = rentals."gameId")
        WHERE
          (games.name ILIKE $1)
        GROUP BY
          games.id, categories.name
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
