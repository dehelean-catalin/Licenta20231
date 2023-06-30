import Joi from "joi";
import {
	CreatedLectureModel,
	PlanFieldModel,
} from "../../models/creator.model";
import { ContentSchema } from "./content.schema";
import { PublishSchema } from "./publish.schema";

const PlanFieldSchema = Joi.array<PlanFieldModel[]>()
	.items({
		value: Joi.string().required().allow("").max(80).messages({
			"any.required": "Value is required",
			"string.empty": "Value cannot be empty",
			"string.max": "The value must be at most {#limit} characters",
		}),
		placeholder: Joi.string().required(),
	})
	.optional();

export const LectureSchema = Joi.object<CreatedLectureModel>({
	id: Joi.string().required().messages({
		"any.required": "Id is required",
		"string.empty": "Id cannot be empty",
	}),
	lastUpdate: Joi.number().required().messages({
		"any.required": "Last update is required",
	}),
	publish: PublishSchema,
	content: ContentSchema,
	requirements: PlanFieldSchema,
	goals: PlanFieldSchema,
	rating: Joi.number().allow(null).required().messages({
		"any.required": "rating is required",
	}),
	enrolledUsers: Joi.number().required().messages({
		"any.required": "enrolledUsers is required",
	}),
	numberOfRatings: Joi.number().required().messages({
		"any.required": "numberOfRatings is required",
	}),
	duration: Joi.number().required().messages({
		"any.required": "duration is required",
	}),
});

export const PublicLectureSchema = LectureSchema.custom(
	(value: CreatedLectureModel, helpers) => {
		if (value.requirements.filter((r) => r.value.length > 0).length < 3)
			throw new Error("Not enough requirements");
		if (value.goals.filter((r) => r.value.length > 0).length < 3)
			throw new Error("Not enough goals");
		if (value.duration < 100) throw new Error("Not enough content");

		return value;
	}
);
