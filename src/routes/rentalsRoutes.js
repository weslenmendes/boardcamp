import { Router } from "express";

import {
  listRentals,
  createRental,
  returnRental,
  deleteRental,
} from "./../controllers/rentalsController.js";
import {
  validateRental,
  validateReturnRental,
  validateDeleteRental,
} from "./../middlewares/validationMiddleware.js";

const rentalsRouter = Router();

rentalsRouter.get("/", listRentals);
rentalsRouter.post("/", validateRental, createRental);
rentalsRouter.post("/:id/return", validateReturnRental, returnRental);
rentalsRouter.delete("/:id", validateDeleteRental, deleteRental);

export default rentalsRouter;
