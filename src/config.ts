import { MigrationConfig } from "drizzle-orm/migrator";

type Config = {
  api: APIConfig;
  db: DBConfig;
  jwt: JWTConfig;
};

// configuration de l'api
type APIConfig = {
  port: number;
  platform: string;
  saltRound: number;
};

// configuration DB
type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

type JWTConfig = {
  defaultDuration: number;
  secret: string;
  issuer: string;
};

process.loadEnvFile(); // chargement des variables d'environnement.

// fonction permet de gerer les variables manquantes.
function envOrThrow(key: string) {
  try {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
  } catch (err) {
    console.error(err);
  }
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export const config = {
  api: {
    port: Number(envOrThrow("PORT")),
    platform: envOrThrow("PLATFORM"),
    saltRound: 10,
  },
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
  },
  jwt: {
    defaultDuration: 60 * 60, // 1 hour in second
    secret: envOrThrow("JWT_SECRET"),
    issuer: "pomotask",
  },
};
