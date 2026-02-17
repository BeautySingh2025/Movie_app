import { Router } from "express";
import {
  getHallsByMovieAndDate,
  getHallDetailsById,
  addShowSlot,
  getSlotsByHallMovieAndDate,
  getDatesByMovieId,
} from "../controllers/movie_hall_controller";

const movieHallRouter = Router();

movieHallRouter.get("/halls", getHallsByMovieAndDate);          // /halls?movie_id=101&show_date=2026-02-13
movieHallRouter.get("/slots", getSlotsByHallMovieAndDate);  // /slots?hall_id=1&show_date=2026-02-13
movieHallRouter.get("/hall/:hall_id", getHallDetailsById);    // /hall/1
movieHallRouter.post("/add", addShowSlot);
movieHallRouter.get("/dates", getDatesByMovieId);


export default movieHallRouter;
