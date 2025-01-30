import {executeQuery} from "../utils/cassandraClient";
import bcrypt from "bcryptjs";

interface userSeedData {
    username: string;
    email: string;
}

export const seed = async (): Promise<void> => {
    console.info("Starting user seeding...");

    const query = `INSERT INTO users (user_id, username, email, password, created_at)
                   VALUES (uuid(), ?, ?, ?, ?);`;

    const users: userSeedData[] = Array.from({length: 10}, (_: any, i: number): userSeedData => ({
        username: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
    }));

    try {
        const hashedPassword = await bcrypt.hash("password", 10);

        const insertPromises: Promise<void>[] = users.map((user: userSeedData): Promise<void> =>
            executeQuery(query, [user.username, user.email, hashedPassword, new Date()])
        );

        await Promise.all(insertPromises);

        console.info("User seeding completed successfully.");
    } catch (error) {
        console.error("User seeding failed:", error);
    }
};

seed().catch((err) => {
    console.error("Seeding process encountered an error:", err);
});
