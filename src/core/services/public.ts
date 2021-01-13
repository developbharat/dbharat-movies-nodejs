import { MOVIES_PER_PAGE } from "../constants";
import { get_db_connection } from "../db";
import { Movie } from "../entities/Movie";

interface ILatestAddedMovies {
  movies: Array<Movie>;
  hasMoreItems: boolean;
}

/**
 * Returns a list of all latest added movies as per the page number provided.
 * And in case of page number <= 0, it returns empty array of movies.
 * Page >= 1 Result: { movies: [Movie], hasMoreItems: true }
 * Page <= 0 Result: { movies: [], hasMoreItems: false }
 * @param page {number} Page number starts from 1.
 */
export const get_latest_added_movies = async (page: number): Promise<ILatestAddedMovies> => {
  const conn = await get_db_connection();
  // make sure to not accept page numbers below or equal to zero
  if (page <= 0) return { movies: [], hasMoreItems: false };

  // page 1 = 0 * 2 = 0; page 2 = 1 * 2 = 2
  const skip_count = MOVIES_PER_PAGE * (page - 1);
  const movies = await conn.getRepository(Movie).find({
    skip: skip_count,
    take: MOVIES_PER_PAGE + 1,
    where: { isPublic: true, isPublished: true },
    order: { createdAt: "DESC" }
  });

  // check if more items are available.
  const hasMoreItems = movies.length == MOVIES_PER_PAGE + 1;

  // Remove last item from movies to remove our extra 1 item,
  // we fetched to check if there are more items available for us.
  if (hasMoreItems) delete movies[movies.length - 1];
  return { movies: movies.filter((mov) => mov !== undefined), hasMoreItems };
};
