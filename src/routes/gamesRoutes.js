import { Router } from "express";

import { listGames, createGame } from "./../controllers/gamesController.js";
import {
  validateBodyGame,
  validateQueryGame,
} from "./../middlewares/gameMiddleware.js";

const gamesRouter = Router();

gamesRouter.get("/", validateQueryGame, listGames);
gamesRouter.post("/", validateBodyGame, createGame);

export default gamesRouter;
