import { Router } from "express";

import {
  listCategories,
  createCategory,
} from "./../controllers/categoriesController.js";

import {
  validateBodyCategory,
  validateQueryCategory,
} from "./../middlewares/categoryMiddleware.js";

const categoriesRouter = Router();

categoriesRouter.get("/", validateQueryCategory, listCategories);
categoriesRouter.post("/", validateBodyCategory, createCategory);

export default categoriesRouter;
