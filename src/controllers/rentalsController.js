import SQLString from "sqlstring";
import dayjs from "dayjs";

import connection from "./../config/database.js";

import buildQuery from "./../utils/buildQuery.js";

export async function listRentals(req, res) {
  const { offset, limit, orderBy } = buildQuery(req.query);
  const { customerId, gameId, status, startDate } = req.query;

  const customerIdParsed = customerId && parseInt(customerId);
  const gameIdParsed = gameId && parseInt(gameId);
  const filters = [];

  if (!isNaN(customerIdParsed)) {
    filters.push(`rentals."customerId" = ${SQLString.escape(customerId)}`);
  }

  if (!isNaN(gameIdParsed)) {
    filters.push(`rentals."gameId" = ${SQLString.escape(gameId)}`);
  }

  if (status) {
    if (status === "open") {
      filters.push('rentals."returnDate" IS NULL');
    }

    if (status === "closed") {
      filters.push('rentals."returnDate" IS NOT NULL');
    }
  }

  if (startDate) {
    filters.push(`rentals."rentDate" >= ${SQLString.escape(startDate)}`);
  }

  const where = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

  try {
    const query = `
      SELECT 
        rentals.*, 
        games.name AS "gameName", 
        games."categoryId", 
        customers.name AS "customerName", 
        categories.name AS "categoryName"
      FROM 
        rentals
      JOIN 
        games 
      ON 
        rentals."gameId" = games.id
      JOIN 
        categories 
      ON 
        games."categoryId" = categories.id
      JOIN 
        customers 
      ON 
        rentals."customerId" = customers.id
      ${where}
      ${orderBy}
      ${offset}
      ${limit};
    `;

    const { rows } = await connection.query(query);

    const searchFormated = rows.map((row) => {
      const newRow = {
        ...row,
        rentDate: dayjs(row.rentDate).format("YYYY-MM-DD"),
        returnDate: row.returnDate
          ? dayjs(row.returnDate).format("YYYY-MM-DD")
          : null,
        customer: {
          id: row.customerId,
          name: row.customerName,
        },
        game: {
          id: row.gameId,
          name: row.gameName,
          categoryId: row.categoryId,
          categoryName: row.categoryName,
        },
      };

      delete newRow.customerName;
      delete newRow.gameName;
      delete newRow.categoryId;
      delete newRow.categoryName;

      return newRow;
    });

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
