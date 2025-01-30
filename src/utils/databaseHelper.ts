import client from "./cassandraClient";
import {Comment} from "../models/comment.model";
import {User} from "../models/user.model";
import {CommentResponse, UserResponse, VideoResponse} from "../types/responseInterfaces";
import {Video} from "../models/video.model";

export const videoExists = async (videoId: string): Promise<boolean> => {
    const query = "SELECT video_id FROM videos WHERE video_id = ?";
    try {
        const result = await client.execute(query, [videoId]);
        return result.rowLength > 0;
    } catch (error) {
        console.error("Error checking video in DB:", error);
        return false;
    }
};

export const commentExists = async (commentId: string): Promise<boolean> => {
    const query = "SELECT comment_id FROM comments WHERE comment_id = ?";
    try {
        const result = await client.execute(query, [commentId]);
        return result.rowLength > 0;
    } catch (error) {
        console.error("Error checking comment in DB:", error);
        return false;
    }
};

export const getUsers = async (results: any) => {
    const userIds = results.map((result: any) => result.user_id);

    const userResult = await client.execute(`SELECT user_id, username, email
                                             FROM users
                                             WHERE user_id IN ?;`, [userIds]);

    return mapUsers(userResult.rows);
}

export const getComment = async (video_id: any, comment_id: any) => {
    const commentResult = await client.execute(`SELECT *
                                                FROM comments
                                                WHERE video_id = ?
                                                  AND comment_id = ?`, [video_id, comment_id], {prepare: true});

    if (commentResult.rowLength === 0) {
        throw Error('Comment not found')
    }

    return commentResult.rows[0];
}

export const storeComment = async (video_id: any, comment_id: any, parent_id: any, user_id: any, comment_text: string, popularity: number = 0, likes: number = 0, dislike: number = 0, created_at: any = new Date()): Promise<void> => {
    await client.execute(
        `INSERT INTO comments (video_id, comment_id, parent_id, user_id, comment_text, popularity, likes, dislikes,
                               created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [video_id, comment_id, parent_id, user_id, comment_text, popularity, likes, dislike, created_at],
        {prepare: true}
    );
}

export const updateCommentPopularity = async (video_id: any, comment_id: any, parent_id: any, likes: number, dislikes: number): Promise<void> => {
    const popularity = likes - dislikes;

    await client.execute(
        `UPDATE comments
         SET popularity = ?,
             likes      = ?,
             dislikes   = ?
         WHERE video_id = ?
           AND comment_id = ?
           AND parent_id = ?;`,
        [popularity, likes, dislikes, video_id, comment_id, parent_id],
        {prepare: true}
    )
}

export const mapUsers = async (users: any[]) => {
    return new Map(
        users.map((user: User) => [
            user.user_id.toString(),
            {
                user_id: user.user_id,
                username: user.username,
            },
        ])
    );
}

export const mapVideos = async (videos: any[]): Promise<VideoResponse[]> => {
    const users = await getUsers(videos);

    return videos.map((video: Video): VideoResponse => ({
        video_id: video.video_id,
        title: video.title,
        description: video.description,
        created_at: video.created_at,
        user: users.get(video.user_id.toString()) || null as UserResponse | null,
    }));
}

export const mapComments = async (comments: any[]): Promise<CommentResponse[]> => {
    const users = await getUsers(comments);

    return comments.map((comment: Comment): CommentResponse => ({
        comment_id: comment.comment_id,
        comment_text: comment.comment_text,
        created_at: comment.created_at,
        likes: comment.likes,
        dislikes: comment.dislikes,
        user: users.get(comment.user_id.toString()) || null as UserResponse | null,
    }));
}
