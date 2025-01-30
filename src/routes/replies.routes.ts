import {Router} from "express";
import {addReply, getReply} from "../controllers/comment.controller";
import {replyListValidation, replyValidation} from "../validations/index.validation";
import {validateMiddleware} from "../middleware/validate.middleware";

const router: Router = Router();

router.get("/api/videos/:video_id/comments/:comment_id/replies", replyListValidation, validateMiddleware, getReply);
router.post("/api/videos/:video_id/comments/:comment_id/replies", replyValidation, validateMiddleware, addReply);

export default router;
