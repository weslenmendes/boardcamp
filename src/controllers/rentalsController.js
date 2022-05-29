import dayjs from "dayjs";
import SQLString from "sqlstring";

import connection from "./../config/database.js";

export async function listRentals(req, res) {
  try {
    const { customerId, gameId } = req.query;

    const filters = [];

    if (customerId) {
      filters.push(`rentals."customerId" = ${SQLString.escape(customerId)}`);
    }

    if (gameId) {
      filters.push(`rentals."gameId" = ${SQLString.escape(gameId)}`);
    }

    const where = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

    const query = `
      SELECT 
        rentals.id AS "rentalId",
        customers.name AS "customerName",
        categories.name As "categoryName",
        *
      FROM 
        rentals
      JOIN
        customers
      ON
        rentals."customerId" = customers.id
      JOIN
        games
      ON
        rentals."gameId" = games.id
      JOIN
        categories
      ON
        games."categoryId" = categories.id
      ${where}
      ORDER BY
        rentals.id;
    `;

    const { rows } = await connection.query(query);

    const searchFormated = rows.map((result) => ({
      id: result.rentalId,
      customerId: result.customerId,
      gameId: result.gameId,
      rentDate: dayjs(result.rentDate).format("YYYY-MM-DD"),
      daysRented: result.daysRented,
      returnDate: result.returnDate
        ? dayjs(result.returnDate).format("YYYY-MM-DD")
        : null,
      originalPrice: result.originalPrice,
      delayFee: result.delayFee,
      customer: {
        id: result.customerId,
        name: result.customerName,
      },
      game: {
        id: result.gameId,
        name: result.name,
        categoryId: result.categoryId,
        categoryName: result.categoryName,
      },
    }));

    res.send([...searchFormated]);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

export async function createRental(req, res) {
  try {
    const { customerId, gameId, daysRented } = req.body;
    const { pricePerDay } = res.locals;

    const originalPrice = pricePerDay * daysRented;
    const rentDate = dayjs().format("YYYY-MM-DD");

    const query = {
      text: `
        INSERT INTO 
          rentals (
            "customerId", 
            "gameId", 
            "rentDate", 
            "daysRented", 
            "returnDate", 
            "originalPrice", 
            "delayFee"
          ) 
        VALUES 
          ($1, $2, $3, $4, null, $5, null);
      `,
      values: [customerId, gameId, rentDate, daysRented, originalPrice],
    };

    await connection.query(query);

    res.sendStatus(201);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

export async function returnRental(req, res) {
  try {
    const { id, rentDate, pricePerDay, daysRented } = res.locals;

    const returnDate = dayjs().format("YYYY-MM-DD");
    const returnDay = dayjs(rentDate).add(daysRented, "day");
    const daysDelay = dayjs(returnDay).diff(dayjs(returnDate), "day");
    const delayFee = daysDelay > 0 ? daysDelay * pricePerDay : 0;

    const query = {
      text: `
        UPDATE 
          rentals
        SET 
          "returnDate" = $1,
          "delayFee" = $2
        WHERE 
          id = $3;
      `,
      values: [returnDate, delayFee, id],
    };

    await connection.query(query);

    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

export async function deleteRental(req, res) {
  try {
    const { id } = res.locals;

    const query = {
      text: `
        DELETE 
        FROM 
          rentals
        WHERE 
          id = $1;
      `,
      values: [id],
    };

    await connection.query(query);

    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}
