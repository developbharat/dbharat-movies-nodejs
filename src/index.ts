import path from "path";

// Keep it at top of file to load .env file before everything.
const filename = process.env.NODE_ENV === "production" ? ".env" : ".env.development";
const filepath = path.join(process.cwd(), filename);
require("dotenv-safe").config({ path: filepath });

// Your imports
import "reflect-metadata";
import express from "express";
import { connect_db } from "./core";
import ormconfig from "./ormconfig";
import { setup_web } from "./website";
import { __PORT__, __PRODUCTION__ } from "./constants";

const main = async (): Promise<void> => {
  // connect to database
  await connect_db(ormconfig);

  // Create express application
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Setup our website related stuff on express.
  setup_web(app);

  // Start express server
  app.listen(__PORT__, () => {
    console.log(`Server started at: http://0.0.0.0:${__PORT__}`);
  });
};

main().catch((err) => {
  console.error("Error Occurred: ", err);
  process.exit(1);
});
