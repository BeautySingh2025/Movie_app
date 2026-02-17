import { Router } from "express";
import addMovie, {
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  searchMovies,
  getNowShowingMovies,
  getMovieByTitle
} from "../controllers/movie_controller";

const movieRouter = Router();
movieRouter.post("/add", addMovie);
movieRouter.get("/get-all-movies", getAllMovies);
movieRouter.get("/now-showing", getNowShowingMovies);
movieRouter.get("/search", searchMovies);
movieRouter.get("/:id", getMovieById);
movieRouter.put("/:id", updateMovie);
movieRouter.delete("/:id", deleteMovie);
movieRouter.get("/by-title/:title", getMovieByTitle);

export default movieRouter;
