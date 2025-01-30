import {executeQuery} from "../utils/cassandraClient";

export const up = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS comments
        (
            video_id     UUID,
            comment_id   UUID,
            parent_id    UUID,
            user_id      UUID,
            comment_text TEXT,
            created_at   TIMESTAMP,
            popularity   INT,
            likes        INT,
            dislikes     INT,
            PRIMARY KEY (video_id, comment_id, parent_id)
        );
    `;
    await executeQuery(query);
};

export const down = async () => {
    const query = `DROP TABLE IF EXISTS comments;`;
    await executeQuery(query);
};