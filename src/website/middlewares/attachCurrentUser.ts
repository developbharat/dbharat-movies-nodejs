import { Request, Response } from "express-serve-static-core";

export const attachCurrentUser = () => (req: Request, _res: Response, next: Function) => {
  try {
    if (!!!req.session?.user)
      throw new Error(
        "Failed to attach current user to request, because user session is expired. Please login again to continue our services."
      );

    req.user = req.session.user;
    return next();
  } catch (err) {
    return next(err);
  }
};
