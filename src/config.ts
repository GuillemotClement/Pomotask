type Config = {
  api: APIConfig;
  db: DBConfig;
};

// configuration de l'api
type APIConfig = {
  url: string;
  port: number;
  platform: string;
};

// configuration DB
type DBConfig = {
  url: string;
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

export const config = {
  api: {
    port: Number(envOrThrow("PORT")),
    platform: envOrThrow("PLATFORM"),
  },
  db: {
    url: envOrThrow("DB_URL"),
  },
};
