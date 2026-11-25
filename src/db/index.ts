import { Pool } from "pg";
import config from "../config/index.js";

const pool = new Pool({
    connectionString: config.database_url,
});

pool.on("error", (error) => {
    console.error("Unexpected database error:", error);
});

export default pool;