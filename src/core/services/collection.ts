import { USER_COLLECTIONS_PER_PAGE } from "../constants";
import { get_db_connection } from "../db";
import { Channel } from "../entities/Channel";
import { Collection } from "../entities/Collection";
import { User } from "../entities/User";
import { validate_create_user_channel_collection } from "../validators/collection";

interface IGetUserCollections {
  collections: Collection[];
  hasMoreItems: boolean;
}

export const get_user_collections = async (
  userId: number,
  page: number,
  per_page?: number
): Promise<IGetUserCollections> => {
  const conn = await get_db_connection();
  // make sure to not accept page numbers below or equal to zero
  if (page <= 0) return { collections: [], hasMoreItems: false };

  if (typeof per_page === "undefined" || Number(per_page) <= 0) {
    per_page = USER_COLLECTIONS_PER_PAGE;
  }

  // page 1 = 0 * 2 = 0; page 2 = 1 * 2 = 2
  const skip_count = per_page * (page - 1);

  const user = await conn.getRepository(User).findOne({ id: userId });
  if (!user) throw new Error("User with provided id doesn't exist. You are not logged in.");

  const collections = await conn.getRepository(Collection).find({
    skip: skip_count,
    take: per_page + 1,
    where: { user },
    order: { createdAt: "DESC" }
  });

  // check if more items are available.
  const hasMoreItems = collections.length == per_page + 1;

  // Remove last item from movies to remove our extra 1 item,
  // we fetched to check if there are more items available for us.
  if (hasMoreItems) delete collections[collections.length - 1];
  return {
    collections: collections.filter((ch) => ch !== undefined),
    hasMoreItems
  };
};

interface ICreateUserChannelCollectionOptions {
  name: string;
  summary: string;
}
export const create_user_channel_collection = async (
  userId: number,
  channelId: number,
  collection: ICreateUserChannelCollectionOptions
): Promise<Collection> => {
  const conn = await get_db_connection();
  const { error, value } = validate_create_user_channel_collection(collection);
  if (error) throw new Error(error);

  const user = await conn.getRepository(User).findOne({ id: userId });
  if (!user) throw new Error("User with provided id doesn't exist. Make sure you are logged in.");

  const channel = await conn.getRepository(Channel).findOne({ user, id: channelId });
  if (!channel) throw new Error("Channel with provided id doesn't exist.");

  const coll = await conn.getRepository(Collection).save({ channel, user, ...value });
  return coll;
};

export const get_user_collections_by_channel_slug = async (
  userId: number,
  slug: string,
  page: number,
  per_page?: number
): Promise<IGetUserCollections> => {
  const conn = await get_db_connection();
  // make sure to not accept page numbers below or equal to zero
  if (page <= 0) return { collections: [], hasMoreItems: false };

  if (typeof per_page === "undefined" || Number(per_page) <= 0) {
    per_page = USER_COLLECTIONS_PER_PAGE;
  }

  // page 1 = 0 * 2 = 0; page 2 = 1 * 2 = 2
  const skip_count = per_page * (page - 1);

  const user = await conn.getRepository(User).findOne({ id: userId });
  if (!user) throw new Error("User with provided id doesn't exist. You are not logged in.");

  const channel = await conn.getRepository(Channel).findOne({ slug: slug });
  if (!channel) throw new Error("Channel with provided slug doesn't exist. You are not logged in.");

  const collections = await conn.getRepository(Collection).find({
    skip: skip_count,
    take: per_page + 1,
    where: { user, channel },
    order: { createdAt: "DESC" }
  });

  // check if more items are available.
  const hasMoreItems = collections.length == per_page + 1;

  // Remove last item from movies to remove our extra 1 item,
  // we fetched to check if there are more items available for us.
  if (hasMoreItems) delete collections[collections.length - 1];
  return {
    collections: collections.filter((ch) => ch !== undefined),
    hasMoreItems
  };
};
