import { Router } from "express";
import { setup_auth_routes } from "./auth";
import { setup_channels_routes } from "./channels";
import { setup_collections_routes } from "./collections";
import { setup_home_routes } from "./home";
import { setup_movies_routes } from "./movies";
import { setup_public_routes } from "./public";
import { setup_root_routes } from "./root";

export const setup_routes = (app: Router) => {
  setup_root_routes(app);
  setup_auth_routes(app);
  setup_home_routes(app);
  setup_channels_routes(app);
  setup_movies_routes(app);
  setup_collections_routes(app);
  setup_public_routes(app);
};
