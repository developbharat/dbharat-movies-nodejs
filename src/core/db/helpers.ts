import { Connection, ConnectionOptions, createConnection } from "typeorm";
import path from "path";
let _connection: Connection;

export const connect_db = async (config?: ConnectionOptions): Promise<void> => {
  if (!!config)
    _connection = await createConnection({
      ...config,
      entities: [path.join(__dirname, "..", "entities/*.*")],
      migrations: [path.join(__dirname, "..", "migrations/*.*")]
    });

  await _connection.runMigrations();
};

/**
 * Returns database connection if it is set else throws an error.
 */
export const get_db_connection = async (): Promise<Connection> => {
  if (typeof _connection === "undefined")
    throw new Error("Database not connected, Please connect your database before using it...");
  return _connection;
};
