import connection from "./../config/database.js";

export async function listCategories(req, res) {
  try {
    const query = "SELECT * FROM categories;";

    const { rows } = await connection.query(query);

    res.send(rows);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

export async function createCategory(req, res) {
  const { name } = req.body;

  try {
    const query = "INSERT INTO categories (name) VALUES ($1);";
    const value = [name];

    await connection.query(query, value);

    res.sendStatus(201);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}
