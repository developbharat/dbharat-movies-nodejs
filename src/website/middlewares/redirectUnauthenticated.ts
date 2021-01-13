import { Request, Response } from "express-serve-static-core";
import { UNAUTHENTICATED_REDIRECT_ROUTE } from "../constants";

/**
 * Redirects to UNAUTHENTICATED_REDIRECT_ROUTE by default set in config file inside src folder.
 * @param route {string} Path or Url to redirect the user to.
 */
export const redirectUnauthenticated = (route?: string) => (req: Request, res: Response, next: Function) => {
  console.log();
  if (!req.session?.user) {
    return res.redirect(typeof route === "undefined" ? UNAUTHENTICATED_REDIRECT_ROUTE : route);
  }

  return next();
};
