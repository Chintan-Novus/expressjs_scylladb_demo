import {Request, Response} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../utils/cassandraClient";
import {ApiResponse, LoginResponse} from "../types/responseInterfaces";

export const login = async (req: Request, res: Response<ApiResponse<LoginResponse>>): Promise<void> => {
    try {
        const {email, password} = req.body;

        const query = "SELECT * FROM users WHERE email = ?";
        const result = await client.execute(query, [email], {prepare: true});

        if (result.rowLength === 0) {
            res.status(404).json({message: "Invalid credentials."});
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({message: "Invalid credentials."});
        }

        const token = jwt.sign({
                user_id: user.user_id,
                email: user.email,
                username: user.username,
            },
            process.env.JWT_SECRET || "",
            {expiresIn: "7d"}
        );

        res.json({
            data: {
                token
            }
        });
    } catch (error) {
        res.status(500).json({message: "Error logging in."});
    }
};
