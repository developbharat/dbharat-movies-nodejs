import { Router } from "express";

export const setup_root_routes = (router: Router) => {
  const app = Router();
  router.use("/", app);

  app.get("/", (_req, res) => res.render("index"));
};
