import app from "./app.js";
import pool from "./db/index.js";
import config from "./config/index.js";
import migrate from "./db/migrate.js";

const startServer = async () => {
    try {

        // Database Connection
        await pool.query("SELECT 1");

        console.log("PostgreSQL Connected Successfully!");

        // Create Database Tables
        await migrate();

        // Start Server
        app.listen(config.port, () => {
            console.log(
                `School Management API running on port ${config.port}`
            );
        });

    } catch (error) {
        console.error("Server Startup Failed:", error);
        await pool.end();
        process.exit(1);
    }
};

startServer();