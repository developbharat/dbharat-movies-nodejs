import express from "express";
import session from "express-session";
import path from "path";
import redis from "redis";
import connect from "connect-redis";
import { REDIS_URL, SESSION_SECRET, UPLOADS_DIRECTORY } from "../constants";
import { User } from "../core/entities/User";
import hbs from "../hbs";
import { setup_routes } from "./routes";

type ICustomSession = session.Session & Partial<session.SessionData> & { user?: User };

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
    session: ICustomSession;
  }
}

export const setup_web = async (app: express.Express): Promise<void> => {
  app.use(express.static(path.join(process.cwd(), "public")));
  app.use(express.static(path.join(process.cwd(), "public", "css")));
  app.use(express.static(path.join(process.cwd(), UPLOADS_DIRECTORY)));

  // setup health check endpoints
  app.get("/status", (_req, res) => res.sendStatus(200));
  app.engine(
    "hbs",
    hbs({
      extension: ".hbs",
      cache: false,
      defaultLayout: "main",
      viewsPath: path.join(process.cwd(), "views")
    })
  );
  app.set("view engine", "hbs");
  app.set("views", path.join(process.cwd(), "views"));

  // Configure redis for session store
  const RedisStore = connect(session);
  const redisClient = redis.createClient({ url: REDIS_URL });
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: SESSION_SECRET,
      name: "qid",
      resave: false,
      saveUninitialized: false,
      cookie: {
        signed: true,
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
      }
    })
  );

  setup_routes(app);
};
