import {executeQuery} from "../utils/cassandraClient";

export const up = async () => {
    const query = `
        CREATE MATERIALIZED VIEW IF NOT EXISTS latest_comments AS
            SELECT * FROM comments 
            WHERE video_id IS NOT NULL AND comment_id IS NOT NULL AND parent_id = 00000000-0000-0000-0000-000000000000 AND created_at IS NOT NULL
            PRIMARY KEY (video_id, created_at, comment_id, parent_id)
            WITH CLUSTERING ORDER BY (created_at DESC, comment_id DESC);
    `;
    await executeQuery(query);
};

export const down = async () => {
    const query = `DROP MATERIALIZED VIEW IF EXISTS latest_comments;`;
    await executeQuery(query);
};