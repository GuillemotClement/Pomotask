import express from "express";
import { config } from "./config.js";

const app = express();

app.use(express.json());

app.listen(config.api.port, () => {
  console.log(`🚀 Server is listen as http://localhost:${config.api.port}`);
});
