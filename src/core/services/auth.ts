import argon2 from "argon2";
import { get_db_connection } from "../db";
import { User } from "../entities/User";
import { ValidationError } from "../utils/errors";
import { validate_email_password, validate_user, validate_username_password } from "../validators/user";

interface ISignupUserOptions {
  fullname: string;
  email: string;
  password: string;
  username: string;
}

export const create_user_account = async (user: ISignupUserOptions): Promise<User> => {
  const conn = await get_db_connection();
  const { error, value } = validate_user(user);
  if (error) throw new ValidationError(error);

  // check if user already exists
  const usernameExists = await conn.getRepository(User).findOne({ username: user.username });
  const emailExists = await conn.getRepository(User).findOne({ email: user.email });

  if (usernameExists) throw new Error("Username already taken.");
  if (emailExists) throw new Error("Email already exists.");

  const hashedPassword = await argon2.hash(user.password);
  const account = await conn.getRepository(User).save({ ...value, password: hashedPassword });
  Reflect.deleteProperty(account, "password");
  return account;
};

export const check_user_credentials_username_password = async (username: string, password: string): Promise<User> => {
  const conn = await get_db_connection();
  const { error, value } = validate_username_password({ username, password });
  if (error) throw new ValidationError(error);

  const user = await conn
    .getRepository(User)
    .findOne({ username: value.username }, { select: ["id", "email", "password", "username"] });
  if (!user) throw new Error("User account with provided username doesn't exist.");

  const isPasswordValid = await argon2.verify(user.password, password);
  if (!isPasswordValid) throw new Error("Provided password doesn't match your account password.");

  Reflect.deleteProperty(user, "password");
  return user;
};

export const check_user_credentials_email_password = async (email: string, password: string): Promise<User> => {
  const conn = await get_db_connection();
  const { error, value } = validate_email_password({ email, password });
  if (error) throw new ValidationError(error);

  const user = await conn
    .getRepository(User)
    .findOne({ email: value.email }, { select: ["id", "email", "password", "username"] });
  if (!user) throw new Error("User account with provided email doesn't exist.");

  const isPasswordValid = await argon2.verify(user.password, password);
  if (!isPasswordValid) throw new Error("Provided password doesn't match your account password.");

  Reflect.deleteProperty(user, "password");
  return user;
};
