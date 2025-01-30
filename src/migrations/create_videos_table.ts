import {executeQuery} from "../utils/cassandraClient";

export const up = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS videos
        (
            video_id    UUID,
            user_id     UUID,
            title       TEXT,
            description TEXT,
            created_at  TIMESTAMP,
            PRIMARY KEY (video_id, created_at, user_id, title)
        ) WITH CLUSTERING ORDER BY (created_at DESC);
    `;
    await executeQuery(query);
};

export const down = async () => {
    const query = `DROP TABLE IF EXISTS videos;`;
    await executeQuery(query);
};