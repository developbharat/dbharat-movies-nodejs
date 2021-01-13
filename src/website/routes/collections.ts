import {
  get_user_channels,
  create_user_channel_collection,
  get_user_collections_by_channel_slug,
  get_user_collections
} from "../../core";
import { Router } from "express";
import { attachCurrentUser } from "../middlewares/attachCurrentUser";
import { redirectUnauthenticated } from "../middlewares/redirectUnauthenticated";

export const setup_collections_routes = (router: Router) => {
  const app = Router();
  router.use("/collections", redirectUnauthenticated(), attachCurrentUser(), app);

  app.get("/", (_req, res) => res.redirect("/collections/list"));
  app.get("/create", async (req, res) => {
    try {
      if (!req.user?.id) throw new Error("You are not logged in...");
      const { channels } = await get_user_channels(req.user?.id, 1, 100);
      return res.render("collections/create", { channels });
    } catch (err) {
      return res.render("collections/create", { error: err.message });
    }
  });

  app.get("/list", async (req, res) => {
    try {
      if (!req.user?.id) throw new Error("You are not logged in...");
      const page = Number(req.query.page || 1);

      const { collections, hasMoreItems } = await get_user_collections(req.user?.id, page);

      const nextPage = hasMoreItems ? page + 1 : null;
      const previousPage = page !== 1 || nextPage === null ? page - 1 : null;

      return res.render("collections/list", { collections, hasMoreItems, page, nextPage, previousPage });
    } catch (err) {
      return res.render("collections/list", { error: err.message });
    }
  });

  app.get("/list/:channel_slug", async (req, res) => {
    try {
      if (!req.user?.id) throw new Error("You are not logged in...");
      const { channel_slug } = req.params;
      const page = Number(req.query.page || 1);

      const { collections, hasMoreItems } = await get_user_collections_by_channel_slug(
        req.user?.id,
        channel_slug,
        page
      );

      const nextPage = hasMoreItems ? page + 1 : null;
      const previousPage = page !== 1 || nextPage === null ? page - 1 : null;

      return res.render("collections/list", { collections, hasMoreItems, page, nextPage, previousPage });
    } catch (err) {
      return res.render("collections/list", { error: err.message });
    }
  });

  app.post("/create", async (req, res) => {
    try {
      if (!req.user?.id) throw new Error("You are not logged in...");
      const { channelId, name, summary } = req.body;
      await create_user_channel_collection(req.user.id, channelId, { name, summary });

      const { channels } = await get_user_channels(req.user?.id, 1, 100);
      return res.render("collections/create", { channels, message: "Collection created successfully." });
    } catch (err) {
      return res.render("collections/create", { error: err.message });
    }
  });
};
