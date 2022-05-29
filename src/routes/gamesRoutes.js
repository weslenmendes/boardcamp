import { Router } from "express";

import { listGames, createGame } from "./../controllers/gamesController.js";
import { validateGame } from "./../middlewares/gameMiddleware.js";

const gamesRouter = Router();

gamesRouter.get("/", listGames);
gamesRouter.post("/", validateGame, createGame);

export default gamesRouter;
