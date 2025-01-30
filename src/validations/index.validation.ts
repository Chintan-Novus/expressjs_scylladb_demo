import {check, ValidationChain} from "express-validator";
import {commentExists, videoExists} from "../utils/databaseHelper";

const isBase64 = (value: string): boolean => {
    const regex = /^[A-Za-z0-9+/=]+$/;
    return regex.test(value);
};

export const loginValidation: ValidationChain[] = [
    check("email").isEmail().withMessage("Invalid email address"),
    check("password").notEmpty().withMessage("Password is required"),
];

export const videoIdValidation: ValidationChain[] = [
    check("video_id")
        .isUUID()
        .withMessage("Invalid video_id")
        .custom(async (value) => {
            const exists = await videoExists(value);
            if (!exists) {
                throw new Error("Video ID does not exist in the database.");
            }
            return true;
        }),
];

export const commentIdValidation: ValidationChain[] = [
    check("comment_id")
        .isUUID()
        .withMessage("Invalid comment_id")
        .custom(async (value) => {
            const exists = await commentExists(value);
            if (!exists) {
                throw new Error("Comment ID does not exist in the database.");
            }
            return true;
        }),
];

export const sortingValidation: ValidationChain[] = [
    check("sort")
        .optional()
        .isIn(["newest", "top"])
        .withMessage("Sort must be 'newest' or 'top'"),
];

export const paginationValidation: ValidationChain[] = [
    check("limit").optional().isInt({min: 1}).withMessage("Page must be a positive integer"),
    check("page_state")
        .optional()
        .custom((value) => {
            if (value && !isBase64(value)) {
                throw new Error("Invalid page_state format. Must be a valid base64 string.");
            }
            return true;
        }),
]

export const videoListValidation: ValidationChain[] = [
    ...paginationValidation
];

export const commentListValidation: ValidationChain[] = [
    ...videoIdValidation,
    ...paginationValidation,
    ...sortingValidation
];

export const commentAddValidation: ValidationChain[] = [
    check("comment").notEmpty().withMessage("Comment is required"),
];

export const commentLikeDislikeValidation: ValidationChain[] = [
    ...videoIdValidation,
    ...commentIdValidation,
];

export const replyListValidation: ValidationChain[] = [
    ...videoIdValidation,
    ...commentIdValidation,
    ...paginationValidation,
];


export const replyValidation: ValidationChain[] = [
    check("reply").notEmpty().withMessage("Reply is required"),
];
