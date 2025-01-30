import {Router} from "express";
import {addComment, dislikeComment, getComments, likeComment} from "../controllers/comment.controller";
import {
    commentAddValidation,
    commentLikeDislikeValidation,
    commentListValidation
} from "../validations/index.validation";
import {validateMiddleware} from "../middleware/validate.middleware";

const router: Router = Router();

router.get("/api/videos/:video_id/comments", commentListValidation, validateMiddleware, getComments);
router.post("/api/videos/:video_id/comments", commentAddValidation, validateMiddleware, addComment);
router.get("/api/videos/:video_id/comments/:comment_id/like", commentLikeDislikeValidation, validateMiddleware, likeComment);
router.get("/api/videos/:video_id/comments/:comment_id/dislike", commentLikeDislikeValidation, validateMiddleware, dislikeComment);

export default router;
