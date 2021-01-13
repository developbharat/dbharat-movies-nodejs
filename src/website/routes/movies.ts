import {
  create_user_movie,
  get_categories,
  get_user_channels,
  get_user_collections,
  get_user_movies_for_collection_by_id,
  get_user_movies_for_channel_by_slug,
  get_user_movie_by_id
} from "../../core";
import { Router } from "express";
import { attachCurrentUser } from "../middlewares/attachCurrentUser";
import { redirectUnauthenticated } from "../middlewares/redirectUnauthenticated";
import multer from "multer";
import fs from "fs/promises";
import { UPLOADS_DIRECTORY } from "../../constants";

const storage = multer({ dest: UPLOADS_DIRECTORY });

export const setup_movies_routes = (router: Router) => {
  const app = Router();
  router.use("/movies", redirectUnauthenticated(), attachCurrentUser(), app);

  app.get("/create", async (req, res) => {
    try {
      if (!req.user?.id) throw new Error("User is not logged in...");
      const categories = await get_categories();
      const { channels } = await get_user_channels(req.user?.id, 1, 100);
      const { collections } = await get_user_collections(req.user.id, 1, 100);
      return res.render("movies/create", { categories, channels, collections });
    } catch (err) {
      return res.render("movies/create", { error: err.message });
    }
  });

  app.get("/details/:id", async (req, res) => {
    try {
      if (!req.user?.id) throw new Error("User is not logged in...");

      const movie = await get_user_movie_by_id(req.user.id, Number(req.params.id));
      return res.render("movies/details", { movie: movie });
    } catch (err) {
      return res.render("movies/details", { error: err.message });
    }
  });

  app.get("/list/channel/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const page = Number(req.query.page || 1);

      if (!req.user?.id) throw new Error("You are not logged in...");

      const { movies, hasMoreItems } = await get_user_movies_for_channel_by_slug(req.user.id, slug, page);

      const nextPage = hasMoreItems ? page + 1 : null;
      const previousPage = page !== 1 || nextPage === null ? page - 1 : null;

      return res.render("movies/list", { movies, hasMoreItems, page: page, nextPage, previousPage });
    } catch (err) {
      return res.render("movies/list", { error: err.message });
    }
  });

  app.get("/list/collection/:collection_id", async (req, res) => {
    try {
      const collection_id = Number(req.params.collection_id);
      const page = Number(req.query.page || 1);

      if (!req.user?.id) throw new Error("You are not logged in...");

      const { movies, hasMoreItems } = await get_user_movies_for_collection_by_id(req.user.id, collection_id, page);

      const nextPage = hasMoreItems ? page + 1 : null;
      const previousPage = page !== 1 || nextPage === null ? page - 1 : null;

      return res.render("movies/list", { movies, hasMoreItems, page: page, nextPage, previousPage });
    } catch (err) {
      return res.render("movies/list", { error: err.message });
    }
  });

  app.post("/create", storage.single("upload"), async (req, res) => {
    try {
      if (!req.user?.id) throw new Error("User is not logged in...");
      let { name, plot, categoryId, channelId, collectionId, isPublished, isPublic } = req.body;

      const file = req.file;
      await fs.rename(file.path, file.path + ".mp4");

      isPublished = isPublished ? true : false;
      isPublic = isPublic ? true : false;

      await create_user_movie(req.user.id, {
        name,
        filename: file.filename,
        filesize: file.size,
        mimetype: file.mimetype,
        originalName: file.originalname,
        plot,
        categoryId,
        channelId,
        collectionId,
        isPublic,
        isPublished
      });

      const categories = await get_categories();
      const { channels } = await get_user_channels(req.user?.id, 1, 100);
      const { collections } = await get_user_collections(req.user.id, 1, 100);
      return res.render("movies/create", { message: "Movie Added successfully.", categories, channels, collections });
    } catch (err) {
      return res.render("movies/create", { error: err.message });
    }
  });
};
