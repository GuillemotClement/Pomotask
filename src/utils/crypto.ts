import bcrypt from "bcrypt";
import { config } from "../config.js";

export async function hashPassword(password: string) {
  try {
    const salt = await bcrypt.genSalt(config.api.saltRound);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    console.error("Echec hash du mot de passe");
  }
}

export async function checkPassword(password: string, hashPassword: string) {
  try {
    return await bcrypt.compare(password, hashPassword);
  } catch (err) {
    console.error("Echec comparaison du mot de passe avec le hash");
  }
}
