import connection from "./../config/database.js";

export async function listCategories(req, res) {
  try {
    const { rows } = await connection.query("SELECT * FROM categories;");
    res.send(rows);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

export async function createCategorie(req, res) {
  const { name } = req.body;

  try {
    const { rows } = await connection.query(
      "SELECT * FROM categories WHERE name = $1;",
      [name],
    );

    if (rows.length > 0) {
      return res.status(409).send("Essa categoria já existe.");
    }

    await connection.query("INSERT INTO categories (name) VALUES ($1);", [
      name,
    ]);

    res.sendStatus(201);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}
