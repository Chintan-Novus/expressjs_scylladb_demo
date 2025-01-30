export interface Comment {
    video_id: string;
    comment_id: string;
    parent_id: string;
    user_id: string;
    comment_text: string;
    created_at: string;
    popularity: number;
    likes: number;
    dislikes: number;
}
