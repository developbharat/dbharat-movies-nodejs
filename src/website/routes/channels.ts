import { create_user_channel, get_user_channels, get_user_channel_by_slug } from "../../core";
import { Router } from "express";
import { attachCurrentUser } from "../middlewares/attachCurrentUser";
import { redirectUnauthenticated } from "../middlewares/redirectUnauthenticated";

export const setup_channels_routes = (router: Router) => {
  const app = Router();
  router.use("/channels", redirectUnauthenticated(), attachCurrentUser(), app);

  app.get("/", (_req, res) => res.redirect("/channels/list"));
  app.get("/create", (_req, res) => res.render("channels/create"));
  app.get("/list", async (req, res) => {
    const page = Number(req.query.page || 1);
    if (!req.user?.id) throw new Error("User with provided id doesn't exist.");

    const { channels, hasMoreItems } = await get_user_channels(req.user.id, page);

    const nextPage = hasMoreItems ? page + 1 : null;
    const previousPage = page !== 1 || nextPage === null ? page - 1 : null;

    return res.render("channels/list", { channels, hasMoreItems, page: page, nextPage, previousPage });
  });
  app.get("/details/:slug", async (req, res) => {
    try {
      if (!req.user?.id) throw new Error("User is not logged in...");
      const channel = await get_user_channel_by_slug(req.user.id, req.params.slug);
      return res.render("channels/details", { channel });
    } catch (err) {
      return res.render("channels/details", { error: err.message });
    }
  });

  app.post("/create", async (req, res) => {
    try {
      const { name, slug, summary } = req.body;
      if (!req.user?.id) throw new Error("You are not logged in. Please login to add new channel.");
      await create_user_channel(req.user.id, { name, slug, summary });
      return res.render("channels/create", { message: "Channel Created successfully." });
    } catch (err) {
      return res.render("channels/create", { error: err.message });
    }
  });
};
