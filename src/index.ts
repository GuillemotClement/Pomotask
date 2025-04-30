import express from "express";
import { config } from "./config.js";
import { handleCreateUser, handleLoginUser } from "./controllers/users.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import cors from "cors";

// auto migrate
// const migrationClient = postgres(config.db.url!, { max: 1 });
// await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
app.use(express.json()); // application/json
app.use(express.urlencoded({ extended: true })); // application/x-www-form-urlencoded

// cors
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/api/users", handleCreateUser);
app.post("/api/login", handleLoginUser);

app.listen(config.api.port, () => {
  console.log(`🚀 Server is listen as http://localhost:${config.api.port}`);
});
