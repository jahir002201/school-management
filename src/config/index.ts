import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

const config = {
    port: Number(process.env.PORT) || 5000,

    database_url: databaseUrl,

    jwt_secret: jwtSecret,

    jwt_expires_in: jwtExpiresIn || "1d"

};

if (!jwtSecret) {
    throw new Error("Secret is missing");
}

if (!config.database_url) {
    throw new Error("DATABASE_URL is missing in .env file");
}

if (!config.jwt_secret || config.jwt_secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters");
}

export default config;