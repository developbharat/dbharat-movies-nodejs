import { MOVIES_PER_PAGE } from "../constants";
import { get_db_connection } from "../db";
import { Category } from "../entities/Category";
import { Channel } from "../entities/Channel";
import { Collection } from "../entities/Collection";
import { Movie } from "../entities/Movie";
import { User } from "../entities/User";
import { validate_create_user_movie } from "../validators/movie";

interface IAddUserMovieOptions {
  name: string;
  plot?: string;
  filename: string;
  mimetype: string;
  originalName: string;
  filesize: number;
  categoryId?: any;
  channelId: any;
  collectionId?: any;
  isPublished?: boolean;
  isPublic?: boolean;
}

export const create_user_movie = async (userId: number, movie: IAddUserMovieOptions): Promise<Movie> => {
  const conn = await get_db_connection();

  const { error, value } = validate_create_user_movie(movie);
  if (error) throw new Error(error);

  const user = await conn.getRepository(User).findOne({ id: userId });
  if (!user) throw new Error("Invalid user id provided, please login to use our services.");

  const channel = await conn.getRepository(Channel).findOne({ user: user, id: movie.channelId });
  if (!channel) throw new Error("Invalid channel id provided.");

  const category = await conn.getRepository(Category).findOne({ id: movie.categoryId });
  if (!category) throw new Error("Invalid category id provided.");

  const collection = await conn.getRepository(Collection).findOne({ id: movie.collectionId });
  if (!collection) throw new Error("Invalid collection id provided.");

  const mov = await conn.getRepository(Movie).save({
    ...value,
    user,
    channel,
    category,
    collection
  });

  return mov;
};

interface IMoviesResults {
  movies: Movie[];
  hasMoreItems: boolean;
}

export const get_user_movies_for_collection_by_id = async (
  userId: number,
  collectionId: number,
  page: number,
  per_page?: number
): Promise<IMoviesResults> => {
  const conn = await get_db_connection();
  // make sure to not accept page numbers below or equal to zero
  if (page <= 0) return { movies: [], hasMoreItems: false };

  if (typeof per_page === "undefined" || Number(per_page) <= 0) {
    per_page = MOVIES_PER_PAGE;
  }

  // page 1 = 0 * 2 = 0; page 2 = 1 * 2 = 2
  const skip_count = per_page * (page - 1);

  const user = await conn.getRepository(User).findOne({ id: userId });
  if (!user) throw new Error("User with provided id doesn't exist. You are not logged in.");

  const collection = await conn.getRepository(Collection).findOne({ id: collectionId, user: user });
  if (!collection) throw new Error("Collection with provided id doesn't exist.");

  const movies = await conn.getRepository(Movie).find({
    skip: skip_count,
    take: per_page + 1,
    where: { collection, user },
    order: { createdAt: "DESC" }
  });

  // check if more items are available.
  const hasMoreItems = movies.length == per_page + 1;

  // Remove last item from movies to remove our extra 1 item,
  // we fetched to check if there are more items available for us.
  if (hasMoreItems) delete movies[movies.length - 1];
  return { movies: movies.filter((mov) => mov !== undefined), hasMoreItems };
};

export const get_user_movie_by_id = async (userId: number, movieId: number): Promise<Movie> => {
  const conn = await get_db_connection();

  const user = await conn.getRepository(User).findOne({ id: userId });
  if (!user) throw new Error("Movie doesn't exist...");

  const movie = await conn.getRepository(Movie).findOne({ user, id: movieId });
  if (!movie) throw new Error("Movie doesn't exist...");

  return movie;
};

export const get_user_movies_for_channel_by_slug = async (
  userId: number,
  channelSlug: string,
  page: number,
  per_page?: number
): Promise<IMoviesResults> => {
  const conn = await get_db_connection();
  // make sure to not accept page numbers below or equal to zero
  if (page <= 0) return { movies: [], hasMoreItems: false };

  if (typeof per_page === "undefined" || Number(per_page) <= 0) {
    per_page = MOVIES_PER_PAGE;
  }

  // page 1 = 0 * 2 = 0; page 2 = 1 * 2 = 2
  const skip_count = per_page * (page - 1);

  const user = await conn.getRepository(User).findOne({ id: userId });
  if (!user) throw new Error("User with provided id doesn't exist. You are not logged in.");

  const channel = await conn.getRepository(Channel).findOne({ slug: channelSlug, user: user });
  if (!channel) throw new Error("Channel with provided slug doesn't exist.");

  const movies = await conn.getRepository(Movie).find({
    skip: skip_count,
    take: per_page + 1,
    where: { channel, user },
    order: { createdAt: "DESC" }
  });

  // check if more items are available.
  const hasMoreItems = movies.length == per_page + 1;

  // Remove last item from movies to remove our extra 1 item,
  // we fetched to check if there are more items available for us.
  if (hasMoreItems) delete movies[movies.length - 1];
  return { movies: movies.filter((mov) => mov !== undefined), hasMoreItems };
};

export const get_public_latest_published_movies = async (page: number, per_page?: number): Promise<IMoviesResults> => {
  const conn = await get_db_connection();
  // make sure to not accept page numbers below or equal to zero
  if (page <= 0) return { movies: [], hasMoreItems: false };

  if (typeof per_page === "undefined" || Number(per_page) <= 0) {
    per_page = MOVIES_PER_PAGE;
  }

  // page 1 = 0 * 2 = 0; page 2 = 1 * 2 = 2
  const skip_count = per_page * (page - 1);

  const movies = await conn.getRepository(Movie).find({
    skip: skip_count,
    take: per_page + 1,
    where: { isPublic: true, isPublished: true },
    order: { createdAt: "DESC" }
  });

  // check if more items are available.
  const hasMoreItems = movies.length == per_page + 1;

  // Remove last item from movies to remove our extra 1 item,
  // we fetched to check if there are more items available for us.
  if (hasMoreItems) delete movies[movies.length - 1];
  return { movies: movies.filter((mov) => mov !== undefined), hasMoreItems };
};

export const get_public_movie_by_id = async (movieId: number): Promise<Movie> => {
  const conn = await get_db_connection();

  const movie = await conn.getRepository(Movie).findOne({ id: movieId, isPublic: true, isPublished: true });
  if (!movie) throw new Error("Movie doesn't exist...");

  return movie;
};
