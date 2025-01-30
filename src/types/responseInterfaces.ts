export interface ApiResponse<T> {
    message?: string;
    data?: T;
    page_state?: string;
}

export interface LoginResponse {
    token: string;
}

export interface UserResponse {
    user_id: string;
    username: string;
}

export interface VideoResponse {
    video_id: string;
    title: string;
    description: string;
    created_at: string;
    user: UserResponse | null;
}

export interface CommentResponse {
    comment_id: string;
    comment_text: string;
    created_at: string;
    likes: number;
    dislikes: number;
    user: UserResponse | null;
}