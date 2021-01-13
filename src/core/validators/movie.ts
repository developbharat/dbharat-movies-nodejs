import joi from "joi";
import { IValidationResponse } from "../interfaces/IValidationResponse";

const movie_schema = joi
  .object({
    name: joi.string().required().min(5).max(255),
    plot: joi.string().optional().min(10).max(1000),
    filename: joi.string().required().min(3).max(1000),
    mimetype: joi.string().required().min(3).max(1000),
    originalName: joi.string().required().min(3).max(1000),
    filesize: joi.number().required().min(1000000), // 1 MB
    categoryId: joi.number().min(1).max(1000).positive().required(),
    channelId: joi.number().min(1).max(1000).positive().required(),
    collectionId: joi.number().min(1).max(1000).positive().required(),
    isPublished: joi.bool().default(false).optional(),
    isPublic: joi.bool().default(false).optional()
  })
  .options({ stripUnknown: true });

export const validate_create_user_movie = (movie: any): IValidationResponse => {
  const { error, value } = movie_schema.validate(movie);

  const err = error ? error.details[0].message : undefined;
  return { error: err, value: value };
};
