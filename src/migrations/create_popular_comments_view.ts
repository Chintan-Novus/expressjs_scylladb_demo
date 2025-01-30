import {executeQuery} from "../utils/cassandraClient";

export const up = async () => {
    const query = `
        CREATE MATERIALIZED VIEW IF NOT EXISTS popular_comments AS
            SELECT * FROM comments 
            WHERE video_id IS NOT NULL AND popularity IS NOT NULL AND comment_id IS NOT NULL AND parent_id = 00000000-0000-0000-0000-000000000000
            PRIMARY KEY (video_id, popularity, comment_id, parent_id)
            WITH CLUSTERING ORDER BY (popularity DESC, comment_id DESC);
    `;
    await executeQuery(query);
};

export const down = async () => {
    const query = `DROP MATERIALIZED VIEW IF EXISTS popular_comments;`;
    await executeQuery(query);
};