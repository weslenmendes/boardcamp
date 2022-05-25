import { Router } from "express";

import categoriesRouter from "./categoriesRoutes.js";

const routes = Router();

routes.get("/", (req, res) => {
  res.send({ msg: "Application is running..." });
});

routes.use("/categories", categoriesRouter);

export default routes;
