import joi from "joi";
import { IValidationResponse } from "../interfaces/IValidationResponse";

// Schemas shared across file
const _password_schema = joi.string().min(6).max(20);
const _username_schema = joi.string().min(5).max(20).alphanum().trim();
const _email_schema = joi.string().email().required().min(10).max(50).trim();

// Core schemas used in functions.
const user_schema = joi
  .object({
    fullname: joi.string().min(4).max(30).trim(),
    email: _email_schema,
    password: _password_schema,
    username: _username_schema
  })
  .options({ stripUnknown: true });

const username_password_schema = joi
  .object({
    username: _username_schema,
    password: _password_schema
  })
  .options({ stripUnknown: true });

const email_password_schema = joi
  .object({
    email: _email_schema,
    password: _password_schema
  })
  .options({ stripUnknown: true });

// Validation functions.
export const validate_user = (user: any): IValidationResponse => {
  const result = user_schema.validate(user);
  const err = result.error ? result.error.details[0].message : undefined;
  return { error: err, value: result.value };
};

export const validate_username_password = (credentials: any) => {
  const result = username_password_schema.validate(credentials);
  const err = result.error ? result.error.details[0].message : undefined;
  return { error: err, value: result.value };
};

export const validate_email_password = (credentials: any) => {
  const result = email_password_schema.validate(credentials);
  const err = result.error ? result.error.details[0].message : undefined;
  return { error: err, value: result.value };
};
