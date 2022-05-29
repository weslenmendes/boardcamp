import { Router } from "express";

import categoriesRouter from "./categoriesRoutes.js";
import gamesRouter from "./gamesRoutes.js";
import customersRouter from "./customersRoutes.js";
import rentalsRouter from "./rentalsRoutes.js";

const routes = Router();

routes.get("/", (req, res) => {
  res.send({ msg: "Application is running..." });
});

routes.use("/categories", categoriesRouter);
routes.use("/games", gamesRouter);
routes.use("/customers", customersRouter);
routes.use("/rentals", rentalsRouter);

export default routes;
