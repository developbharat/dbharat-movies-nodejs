import { get_db_connection } from "../db";
import { Category } from "../entities/Category";

export const get_categories = async (): Promise<Category[]> => {
  const conn = await get_db_connection();
  return await conn.getRepository(Category).find({});
};
