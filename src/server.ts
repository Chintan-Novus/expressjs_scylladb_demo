import express, {Express, NextFunction, Request, Response} from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import videosRoutes from "./routes/videos.routes";
import commentsRoutes from "./routes/comments.routes";
import repliesRoutes from "./routes/replies.routes";
import {authenticate} from "./middleware/authMiddleware";
import {connectCassandra} from "./utils/cassandraClient";

// Load environment variables
dotenv.config();

const app: Express = express();

app.use(bodyParser.json());

// Routes
app.use(authRoutes);

app.use(authenticate, videosRoutes);
app.use(authenticate, commentsRoutes);
app.use(authenticate, repliesRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error(err.stack);
    res.status(500).json({message: "Something went wrong"});
});

// Server initialization
const PORT = process.env.PORT || 3000;

connectCassandra().then(() => {
    app.listen(PORT, () => {
        console.info(`Server running at http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to start server due to Cassandra connection error:", err);
    process.exit(1); // Exit if connection fails
});
