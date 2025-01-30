import {executeQuery} from "../utils/cassandraClient";

export const up = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users
        (
            user_id    UUID,
            username   TEXT,
            email      TEXT,
            password   TEXT,
            created_at TIMESTAMP,
            PRIMARY KEY (user_id, email)
        );
    `;
    await executeQuery(query);
};

export const down = async () => {
    const query = `DROP TABLE IF EXISTS users;`;
    await executeQuery(query);
};
