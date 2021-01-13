import joi from "joi";
import { IValidationResponse } from "../interfaces/IValidationResponse";

const channel_schema = joi
  .object({
    name: joi.string().required().min(5).max(255),
    slug: joi.string().required().min(5).max(255).regex(new RegExp("^[a-z0-9]+(?:-[a-z0-9]+)*$")),
    summary: joi.string().optional().min(10).max(1000)
  })
  .options({ stripUnknown: true });

export const validate_create_user_channel = (channel: any): IValidationResponse => {
  const { error, value } = channel_schema.validate(channel);

  const err = error ? error.details[0].message : undefined;
  return { error: err, value: value };
};

export const validate_channel_slug = (slug: string): IValidationResponse => {
  const { error, value } = joi
    .string()
    .required()
    .min(5)
    .max(255)
    .regex(new RegExp("^[a-z0-9]+(?:-[a-z0-9]+)*$"))
    .validate(slug);

  const err = error ? error.details[0].message : undefined;
  return { error: err, value: value };
};
