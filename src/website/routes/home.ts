import { Router } from "express";
import { attachCurrentUser } from "../middlewares/attachCurrentUser";
import { redirectUnauthenticated } from "../middlewares/redirectUnauthenticated";

export const setup_home_routes = (router: Router) => {
  const app = Router();
  router.use("/home", redirectUnauthenticated(), attachCurrentUser(), app);

  app.get("/", (_req, res) => res.redirect("/home/welcome"));
  app.get("/welcome", (_req, res) => res.render("home/welcome"));
};
