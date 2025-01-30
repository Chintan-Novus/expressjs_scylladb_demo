import {Client} from "cassandra-driver";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
    contactPoints: [
        process.env.DB_CONTACT_POINTS as string
    ],
    localDataCenter: process.env.DB_DATA_CENTER as string,
    credentials: {
        username: process.env.DB_USERNAME as string,
        password: process.env.DB_PASSWORD as string
    },
    keyspace: process.env.DB_KEYSPACE || "video_comment_system"
});

export const connectCassandra = async () => {
    try {
        await client.connect();
        console.info("Connected to Cassandra");
    } catch (error) {
        console.error("Cassandra connection error:", error);
        process.exit(1);
    }
};

export const executeQuery = async (query: string, params: any[] = []) => {
    try {
        await client.execute(query, params, {prepare: true});
        console.info(`Executed query: ${query}`);
    } catch (error) {
        console.error(`Error executing query: ${query}`, error);
        throw error;
    }
};

export default client;
