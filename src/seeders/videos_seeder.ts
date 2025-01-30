import client, {executeQuery} from "../utils/cassandraClient";

interface videoSeedData {
    title: string;
    description: string;
    created_at: Date;
}

export const seed = async (): Promise<void> => {
    try {
        console.info("Starting video seeding...");

        const users = await client.execute("SELECT user_id FROM users");

        if (users.rowLength === 0) {
            console.error("No users found to associate with videos.");
            return;
        }

        const query = `INSERT INTO videos (video_id, user_id, title, description, created_at)
                       VALUES (uuid(), ?, ?, ?, ?);`;

        const videos: videoSeedData[] = Array.from({length: 10}, (_: any, i: number): videoSeedData => ({
            title: `Video## ${i + 1}`,
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
            created_at: new Date(2025, 0, i + 1, 0, 0, 0, 0),
        }));

        const shuffledUsers = users.rows.sort(() => 0.5 - Math.random());

        const insertPromises: Promise<void>[] = videos.map(async (video: videoSeedData): Promise<void> => {
            const randomUser = shuffledUsers[Math.floor(Math.random() * shuffledUsers.length)].user_id;

            return await executeQuery(query, [randomUser, video.title, video.description, video.created_at]);
        });

        await Promise.all(insertPromises);

        console.info("Video seeding completed successfully.");
    } catch (error) {
        console.error("Error during video seeding:", error);
    }
};

seed().catch((err) => {
    console.error("Seeding process encountered an error:", err);
});
