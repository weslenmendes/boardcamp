import connection from "./../config/database.js";

import { customerSchema, querySchema } from "./../schemas/customerSchema.js";

export const validateBodyCustomer = async (req, res, next) => {
  const { id } = req.params;

  const { error } = customerSchema.validate(req.body);

  if (error) {
    const allMessagesOfError = error.details
      .map(({ message }) => message)
      .join(", ");
    return res.status(400).send(allMessagesOfError);
  }

  try {
    const query = {
      text: `
        SELECT 
          * 
        FROM 
          customers
        WHERE
          (cpf = $1);
      `,
      values: [req.body.cpf],
    };

    const { rows } = await connection.query(query);

    const isCreateCustomer = rows.length > 0 && !id;
    const isUpdateCustomer =
      rows.length > 0 && id && parseInt(id) !== rows[0].id;

    if (isCreateCustomer || isUpdateCustomer) {
      return res.status(409).send("Por favor, insira outro cpf.");
    }

    next();
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

export const validateQueryCustomer = (req, res, next) => {
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
