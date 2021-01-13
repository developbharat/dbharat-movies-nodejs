import joi from "joi";
import { IValidationResponse } from "../interfaces/IValidationResponse";

const collection_schema = joi
  .object({
    name: joi.string().required().min(5).max(255),
    summary: joi.string().optional().min(10).max(1000)
  })
  .options({ stripUnknown: true });

export const validate_create_user_channel_collection = (collection: any): IValidationResponse => {
  const { error, value } = collection_schema.validate(collection);

  const err = error ? error.details[0].message : undefined;
  return { error: err, value: value };
};
