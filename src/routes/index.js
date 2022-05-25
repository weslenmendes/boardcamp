import { Router } from "express";

import categoriesRouter from "./categoriesRoutes.js";
import gamesRouter from "./gamesRoutes.js";

const routes = Router();

routes.get("/", (req, res) => {
  res.send({ msg: "Application is running..." });
});

routes.use("/categories", categoriesRouter);
routes.use("/games", gamesRouter);

export default routes;
