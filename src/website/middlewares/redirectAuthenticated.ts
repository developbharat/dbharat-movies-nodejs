import { Request, Response } from "express-serve-static-core";
import { AUTHENTICATED_REDIRECT_ROUTE } from "../constants";

/**
 * Redirects to AUTHENTICATED_REDIRECT_ROUTE by default set in config file inside src folder.
 * @param route {string} Path or Url to redirect the user to.
 */
export const redirectAuthenticated = (route?: string) => (req: Request, res: Response, next: Function) => {
  if (!!req.session?.user) {
    return res.redirect(typeof route === "undefined" ? AUTHENTICATED_REDIRECT_ROUTE : route);
  }

  return next();
};
