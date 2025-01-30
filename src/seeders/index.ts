import {connectCassandra} from "../utils/cassandraClient";
import * as userSeeder from "./users_seeder";
import * as videosSeeder from "./videos_seeder";

const runSeeders = async (): Promise<void> => {
    await connectCassandra();

    try {
        console.info("Running seeders...");

        await userSeeder.seed();
        await videosSeeder.seed();

        console.info("Seeding completed successfully.");
    } catch (error) {
        console.error("Seeding failed:", error);
    }
};

runSeeders().catch((err: any): void => {
    console.error("Error running seeders:", err);
});