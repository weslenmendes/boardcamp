import { Router } from "express";

import {
  listRentals,
  createRental,
  returnRental,
  deleteRental,
  rentalMetrics,
} from "./../controllers/rentalsController.js";
import {
  validateRental,
  validateQueryRental,
  validateQueryMetricsRental,
  validateReturnRental,
  validateDeleteRental,
} from "./../middlewares/validationMiddleware.js";

const rentalsRouter = Router();

rentalsRouter.get("/", validateQueryRental, listRentals);
rentalsRouter.get("/metrics", validateQueryMetricsRental, rentalMetrics);
rentalsRouter.post("/", validateRental, createRental);
rentalsRouter.post("/:id/return", validateReturnRental, returnRental);
rentalsRouter.delete("/:id", validateDeleteRental, deleteRental);

export default rentalsRouter;
