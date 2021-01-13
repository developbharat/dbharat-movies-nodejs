import {
  check_user_credentials_email_password,
  check_user_credentials_username_password,
  create_user_account
} from "../../core";
import { Router } from "express";
import { redirectAuthenticated } from "../middlewares/redirectAuthenticated";

export const setup_auth_routes = (router: Router) => {
  const app = Router();
  router.use("/auth", app);

  app.get("/", (_req, res) => res.redirect("/auth/signin"));
  app.get("/signin", redirectAuthenticated(), (_req, res) => res.render("auth/signin"));
  app.get("/signup", redirectAuthenticated(), (_req, res) => res.render("auth/signup"));

  app.post("/signin", redirectAuthenticated(), async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (username && password) {
        const user = await check_user_credentials_username_password(username, password);
        req.session.user = user;
      } else if (email && password) {
        const user = await check_user_credentials_email_password(email, password);
        req.session.user = user;
      }

      return res.render("auth/signin", { message: "Authentication Successful..." });
    } catch (err) {
      console.error(err);
      return res.render("auth/signin", { error: err.message });
    }
  });

  app.post("/signup", redirectAuthenticated(), async (req, res) => {
    try {
      const { fullname, username, email, password } = req.body;

      await create_user_account({ fullname, username, email, password });
      return res.render("auth/signup", { message: "Account Created successfully." });
    } catch (err) {
      return res.render("auth/signup", { error: err.message });
    }
  });
};
