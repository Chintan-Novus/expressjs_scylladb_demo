import {Request, Response} from "express";
import client from "../utils/cassandraClient";
import {getComment, mapComments, storeComment, updateCommentPopularity} from "../utils/databaseHelper";
import {QueryOptions, types} from "cassandra-driver";
import {v4 as uuidv4} from "uuid";
import {ApiResponse, CommentResponse} from "../types/responseInterfaces";

export const getComments = async (req: Request, res: Response<ApiResponse<CommentResponse[]>>): Promise<void> => {
    try {
        const {sort = "newest", limit = 10, page_state} = req.query
        const {video_id} = req.params
        let query = "";

        const options: QueryOptions = {
            prepare: true,
            autoPage: true,
            fetchSize: Number(limit),
        };

        if (page_state && page_state !== 'null') {
            options.pageState = page_state as string | undefined;
        }

        if (sort === "newest") {
            query = "SELECT * FROM latest_comments WHERE video_id = ?;";
        } else if (sort === "top") {
            query = "SELECT * FROM popular_comments WHERE video_id = ?;";
        }

        let result: types.ResultSet = await client.execute(query, [video_id], options);

        const data: CommentResponse[] = await mapComments(result.rows);

        res.json({
            data,
            page_state: result.pageState
        });
    } catch (error) {
        res.status(500).json({message: "Error fetching comments."});
    }
};

export const addComment = async (req: Request, res: Response<ApiResponse<null>>): Promise<void> => {
    try {
        const {comment} = req.body;
        const {video_id} = req.params;
        const comment_id = uuidv4();
        console.log(req.user);
        const user_id = req.user.user_id;
        const parent_id = '00000000-0000-0000-0000-000000000000';

        // Save comments
        await storeComment(video_id, comment_id, parent_id, user_id, comment);

        res.json({message: "Comment added successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error adding comment."});
    }
};

export const likeComment = async (req: Request, res: Response<ApiResponse<null>>): Promise<void> => {
    try {
        const {video_id, comment_id} = req.params;

        // Get comment
        const comment = await getComment(video_id, comment_id);

        const likes = comment.likes + 1;
        const dislikes = comment.dislikes;

        // Update popularity
        await updateCommentPopularity(video_id, comment_id, comment.parent_id, likes, dislikes)

        res.json({message: "Comment liked successfully."});
    } catch (error: any) {
        res.status(500).json({message: error.message ?? "Error while like comment."});
    }
}

export const dislikeComment = async (req: Request, res: Response<ApiResponse<null>>): Promise<void> => {
    try {
        const {video_id, comment_id} = req.params;

        // Get comment
        const comment = await getComment(video_id, comment_id);

        const likes = comment.likes;
        const dislikes = comment.dislikes + 1;

        // Update popularity
        await updateCommentPopularity(video_id, comment_id, comment.parent_id, likes, dislikes)

        res.json({message: "Comment disliked successfully."});
    } catch (error: any) {
        res.status(500).json({message: error.message ?? "Error while dislike comment."});
    }
}

export const addReply = async (req: Request, res: Response<ApiResponse<null>>): Promise<void> => {
    try {
        const {reply} = req.body;
        const {video_id, comment_id} = req.params;
        const user_id = req.user.user_id;

        // Save Reply
        await storeComment(video_id, uuidv4(), comment_id, user_id, reply);

        res.json({message: "Reply added successfully."});
    } catch (error) {
        res.status(500).json({message: "Error adding reply."});
    }
};

export const getReply = async (req: Request, res: Response<ApiResponse<CommentResponse[]>>): Promise<void> => {
    try {
        const {limit = 10, page_state} = req.query
        const {video_id, comment_id} = req.params;

        const options: QueryOptions = {
            prepare: true,
            autoPage: true,
            fetchSize: Number(limit),
        };

        if (page_state && page_state !== 'null') {
            options.pageState = page_state as string | undefined;
        }

        const commentResult = await client.execute(`SELECT *
                                                    FROM latest_reply
                                                    WHERE video_id = ?
                                                      AND parent_id = ?;`, [video_id, comment_id], options);

        const data: CommentResponse[] = await mapComments(commentResult.rows);

        res.json({
            data,
            page_state: commentResult.pageState
        });
    } catch (error) {
        res.status(500).json({message: "Error fetching replies."});
    }
};

