import {Router} from "express";
import {getVideoList} from "../controllers/video.controller";
import {videoListValidation} from "../validations/index.validation";
import {validateMiddleware} from "../middleware/validate.middleware";

const router: Router = Router();

router.get("/api/videos", videoListValidation, validateMiddleware, getVideoList);

export default router;
