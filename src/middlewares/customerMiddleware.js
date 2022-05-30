import connection from "./../config/database.js";

import { customerSchema } from "./../schemas/customerSchema.js";

export const validateCustomer = async (req, res, next) => {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;

  const { error } = customerSchema.validate({ name, phone, cpf, birthday });

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
      values: [cpf],
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
