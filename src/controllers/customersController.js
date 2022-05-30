import connection from "../config/database.js";

import buildQuery from "../utils/buildQuery.js";

export async function listCustomers(req, res) {
  const { offset, limit, orderBy } = buildQuery(req.query);
  const { cpf } = req.query;

  try {
    const query = {
      text: `
        SELECT 
          customers.*,
          to_char(customers.birthday, 'YYYY-MM-DD') AS "birthday",
          COUNT (rentals.id)::INTEGER AS "rentalsCount"
        FROM 
          customers
        LEFT JOIN
          rentals
        ON
          rentals."customerId" = customers.id
        WHERE 
          (cpf ILIKE $1)
        GROUP BY
          customers.id
        ${orderBy ? orderBy : "ORDER BY customers.id ASC"}
        ${offset}
        ${limit};
      `,
      values: [`${cpf || ""}%`],
    };

    const { rows } = await connection.query(query);

    res.send(rows);
  } catch (e) {
    res.sendStatus(500);
    console.error(e);
  }
}

export async function listCustomerById(req, res) {
  try {
    const { id } = req.params;

    const query = {
      text: `
        SELECT 
          *,
          to_char(birthday, 'YYYY-MM-DD') AS "birthday"
        FROM 
          customers
        WHERE 
          (id = $1);
      `,
      values: [id],
    };

    const { rows } = await connection.query(query);

    if (rows.length === 0) {
      return res.sendStatus(404);
    }

    res.send(rows[0]);
  } catch (e) {
    res.sendStatus(500);
    console.error(e);
  }
}

export async function createCustomer(req, res) {
  try {
    const { name, phone, cpf, birthday } = req.body;

    const query = {
      text: `
        INSERT INTO
          customers(name, phone, cpf, birthday)
        VALUES
          ($1, $2, $3, $4);      
      `,
      values: [name, phone, cpf, birthday],
    };

    await connection.query(query);

    res.sendStatus(201);
  } catch (e) {
    res.sendStatus(500);
    console.error(e);
  }
}

export async function updateCustomer(req, res) {
  try {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    const query = {
      text: `
        UPDATE
          customers
        SET
          name = $1,
          phone = $2,
          cpf = $3,
          birthday = $4
        WHERE
          (id = $5);
      `,
      values: [name, phone, cpf, birthday, id],
    };

    await connection.query(query);

    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
    console.error(e);
  }
}
