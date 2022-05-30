import { Router } from "express";

import {
  listCustomers,
  listCustomerById,
  createCustomer,
  updateCustomer,
} from "./../controllers/customersController.js";
import {
  validateBodyCustomer,
  validateQueryCustomer,
} from "./../middlewares/customerMiddleware.js";

const customersRouter = Router();

customersRouter.get("/", validateQueryCustomer, listCustomers);
customersRouter.get("/:id", listCustomerById);
customersRouter.post("/", validateBodyCustomer, createCustomer);
customersRouter.put("/:id", validateBodyCustomer, updateCustomer);

export default customersRouter;
