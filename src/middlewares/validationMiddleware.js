import Joi from "joi";

export const validateCategorie = (req, res, next) => {
  const { name } = req.body;

  const categorieSchema = Joi.object({
    name: Joi.string().required(),
  });

  const { error } = categorieSchema.validate({ name });

  if (error) {
    return res.status(400).send("name não pode ser vazio.");
  }

  next();
};
