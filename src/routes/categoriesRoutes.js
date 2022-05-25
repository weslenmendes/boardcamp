import { Router } from "express";

import {
  listCategories,
  createCategorie,
} from "./../controllers/categoriesController.js";
import { validateCategorie } from "./../middlewares/validationMiddleware.js";

const categoriesRouter = Router();

categoriesRouter.get("/", listCategories);
categoriesRouter.post("/", validateCategorie, createCategorie);

export default categoriesRouter;
