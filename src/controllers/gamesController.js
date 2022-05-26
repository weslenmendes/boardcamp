import connection from "./../config/database.js";

export async function listGames(req, res) {
  try {
    const { name } = req.query;

    const query = {
      text: `
      SELECT 
        g.*, 
        c.name AS "categoryName" 
      FROM 
        games AS g
      INNER JOIN 
        categories AS c
      ON 
        (g."categoryId" = c.id)
      WHERE
        (g.name ~* $1);`,
      values: [name ? name : ""],
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
