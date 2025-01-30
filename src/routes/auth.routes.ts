import {Router} from "express";
import {login} from "../controllers/auth.controller";
import {validateMiddleware} from "../middleware/validate.middleware";
import {loginValidation} from "../validations/index.validation";

const router: Router = Router();

router.post("/api/auth/login", loginValidation, validateMiddleware, login);

export default router;
