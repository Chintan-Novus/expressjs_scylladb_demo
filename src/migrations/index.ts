import {connectCassandra} from "../utils/cassandraClient";
import * as createUsersTable from "./create_users_table";
import * as createVideosTable from "./create_videos_table";
import * as createCommentsTable from "./create_comments_table";
import * as createLatestCommentsView from "./create_latest_comments_view";
import * as createPopularCommentsView from "./create_popular_comments_view";
import * as createLatestReplyView from "./create_latest_reply_view";

const runMigrations = async (): Promise<void> => {
    await connectCassandra();

    try {
        console.info("Running migrations...");

        const args = process.argv.slice(2);
        const isFresh = args.includes("--fresh");

        if (isFresh) {
            // Views
            await createLatestCommentsView.down();
            await createPopularCommentsView.down();
            await createLatestReplyView.down();

            // Tables
            await createUsersTable.down();
            await createVideosTable.down();
            await createCommentsTable.down();
        }

        // Tables
        await createUsersTable.up();
        await createVideosTable.up();
        await createCommentsTable.up();

        // Views
        await createLatestCommentsView.up();
        await createPopularCommentsView.up();
        await createLatestReplyView.up();

        console.info("Migrations completed successfully.");
    } catch (error) {
        console.error("Migration failed:", error);
    }
};

runMigrations().catch((err: any): void => {
    console.error("Migration error:", err);
});