import { Router } from "express";

import {
  listCategories,
  createCategory,
} from "./../controllers/categoriesController.js";
import { validateCategory } from "./../middlewares/validationMiddleware.js";

const categoriesRouter = Router();

categoriesRouter.get("/", listCategories);
categoriesRouter.post("/", validateCategory, createCategory);

export default categoriesRouter;
