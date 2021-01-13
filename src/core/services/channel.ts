import { USER_CHANNELS_PER_PAGE } from "../constants";
import { get_db_connection } from "../db";
import { Channel } from "../entities/Channel";
import { User } from "../entities/User";
import { ValidationError } from "../utils/errors";
import { validate_channel_slug, validate_create_user_channel } from "../validators/channel";

interface ICreateUserChannelOptions {
  name: string;
  slug: string;
  summary?: string;
}

export const create_user_channel = async (userId: number, channel: ICreateUserChannelOptions): Promise<Channel> => {
  const conn = await get_db_connection();
  const { error, value } = validate_create_user_channel(channel);
  if (error) throw new ValidationError(error);

  const user = await conn.getRepository(User).findOne({ id: userId });
  if (!user) throw new Error("User with provided id doesn't exist. You are not logged in.");

  const isDuplicateSlug = await conn.getRepository(Channel).findOne({ slug: value.slug });
  if (!!isDuplicateSlug) throw new Error("Channel with this slug already exists. Please choose a new slug.");

  return await conn.getRepository(Channel).save({ ...value, user: user });
};

interface IUserChannels {
  channels: Array<Channel>;
  hasMoreItems: boolean;
}

export const get_user_channels = async (userId: number, page: number, per_page?: number): Promise<IUserChannels> => {
  const conn = await get_db_connection();
  // make sure to not accept page numbers below or equal to zero
  if (page <= 0) return { channels: [], hasMoreItems: false };

  if (typeof per_page === "undefined" || Number(per_page) <= 0) {
    per_page = USER_CHANNELS_PER_PAGE;
  }

  // page 1 = 0 * 2 = 0; page 2 = 1 * 2 = 2
  const skip_count = per_page * (page - 1);

  const user = await conn.getRepository(User).findOne({ id: userId });
  if (!user) throw new Error("User with provided id doesn't exist. You are not logged in.");

  const channels = await conn.getRepository(Channel).find({
    skip: skip_count,
    take: per_page + 1,
    where: { user: user },
    order: { createdAt: "DESC" }
  });

  // check if more items are available.
  const hasMoreItems = channels.length == per_page + 1;

  // Remove last item from movies to remove our extra 1 item,
  // we fetched to check if there are more items available for us.
  if (hasMoreItems) delete channels[channels.length - 1];
  return { channels: channels.filter((ch) => ch !== undefined), hasMoreItems };
};

export const get_user_channel_by_slug = async (userId: number, channelSlug: string): Promise<Channel> => {
  const conn = await get_db_connection();
  const user = await conn.getRepository(User).findOne({ id: userId });
  if (!user) throw new Error("User with provided id doesn't exist. You might need to relogin.");

  const isValidChannelSlug = validate_channel_slug(channelSlug);
  if (isValidChannelSlug.error) throw new Error(isValidChannelSlug.error);

  const channel = await conn.getRepository(Channel).findOne({ where: { user: user, slug: channelSlug } });
  if (!channel) throw new Error("Channel with provided slug doesn't exist.");

  return channel;
};
