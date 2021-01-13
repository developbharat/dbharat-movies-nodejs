// database realted configurations
export const DB_TYPE: string = process.env.DB_TYPE || "mysql";
export const DB_NAME: string = process.env.DB_NAME || "moviesdb";
export const DB_USERNAME: string = process.env.DB_USERNAME || "test";
export const DB_PASSWORD: string = process.env.DB_PASSWORD || "password";
export const DB_HOST: string = process.env.DB_HOST || "localhost";
export const DB_PORT: number = Number(process.env.DB_PORT) || 3306;

// related to application
export const __PRODUCTION__: boolean = process.env.NODE_ENV === "production";
export const __PORT__: number = Number(process.env.PORT) || 4500;

// related to redis
export const REDIS_URL: string = "redis://" + (process.env.REDIS_URL || "localhost:6379");

// related to express session
export const SESSION_SECRET: string = process.env.SESSION_SECRET || "secret-for-session.";

// related to multer
export const UPLOADS_DIRECTORY: string = process.env.UPLOADS_DIRECTORY || "uploads";
