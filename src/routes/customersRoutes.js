import { Router } from "express";

import {
  listCustomers,
  listCustomerById,
  createCustomer,
  updateCustomer,
} from "./../controllers/customersController.js";
import { validateCustomer } from "./../middlewares/customerMiddleware.js";

const customersRouter = Router();

customersRouter.get("/", listCustomers);
customersRouter.get("/:id", listCustomerById);
customersRouter.post("/", validateCustomer, createCustomer);
customersRouter.put("/:id", validateCustomer, updateCustomer);

export default customersRouter;
