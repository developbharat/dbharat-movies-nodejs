import { Router } from "express";
import { get_public_latest_published_movies, get_public_movie_by_id } from "../../../core";

export const setup_public_routes = (router: Router) => {
  const app = Router();
  router.use("/public", app);

  app.get("/latest-movies", async (req, res) => {
    try {
      const page = Number(req.query.page || 1);

      const { movies, hasMoreItems } = await get_public_latest_published_movies(page);

      const nextPage = hasMoreItems ? page + 1 : null;
      const previousPage = page !== 1 || nextPage === null ? page - 1 : null;

      return res.render("public/latest-movies", { movies, hasMoreItems, page: page, nextPage, previousPage });
    } catch (err) {
      return res.render("public/latest-movies", { error: err.message });
    }
  });

  app.get("/details/:id", async (req, res) => {
    try {
      const movie = await get_public_movie_by_id(Number(req.params.id));
      return res.render("movies/details", { movie: movie });
    } catch (err) {
      return res.render("movies/details", { error: err.message });
    }
  });
};
