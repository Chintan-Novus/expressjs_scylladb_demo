import {NextFunction, Request, Response} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader: string | undefined = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({success: false, message: "Unauthorized: No token provided."});
        return;
    }

    const token: string = authHeader.split(" ")[1];
    const secretKey: string | undefined = process.env.JWT_SECRET;

    if (!secretKey) {
        console.error("JWT_SECRET is not defined");
        res.status(500).json({success: false, message: "Internal server error"});
        return;
    }

    try {
        req.user = jwt.verify(token, secretKey) as JwtPayload;
        next();
    } catch (error) {
        res.status(401).json({success: false, message: "Unauthorized: Invalid token."});
    }
};
