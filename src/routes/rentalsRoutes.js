import { Router } from "express";

import {
  listRentals,
  createRental,
  returnRental,
  deleteRental,
} from "./../controllers/rentalsController.js";
import {
  validateRental,
  validateQueryRental,
  validateReturnRental,
  validateDeleteRental,
} from "./../middlewares/validationMiddleware.js";

const rentalsRouter = Router();

rentalsRouter.get("/", validateQueryRental, listRentals);
rentalsRouter.post("/", validateRental, createRental);
rentalsRouter.post("/:id/return", validateReturnRental, returnRental);
rentalsRouter.delete("/:id", validateDeleteRental, deleteRental);

export default rentalsRouter;
