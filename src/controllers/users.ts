import { Request, Response } from "express";
import { createUser, getUserByUsername } from "../db/queries/users.js";
import { checkPassword, hashPassword } from "../utils/crypto.js";

export async function handleCreateUser(req: Request, res: Response) {
  try {
    const { username, email, image } = req.body;

    const password = await hashPassword(req.body.password);

    if (!password || password?.length < 60) {
      res.status(500).json({ error: "Failed hash" });
      return;
    }

    const userData = {
      username,
      email,
      image,
      password,
    };

    const newUser = await createUser(userData);

    if (!newUser.id) {
      res.status(500).json({ erreur: "Echec check password" });
      return;
    }

    res.status(201).json({ newUser });
  } catch (err) {
    console.error(err);
  }
}

export async function handleLoginUser(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    const dbUser = await getUserByUsername(username);

    if (!dbUser) {
      res.status(500).json({ erreur: "Echec de l'authentification" });
      return;
    }

    const hashedPassword = dbUser.password;

    const authUser = await checkPassword(password, hashedPassword);

    if (!authUser) {
      res.status(500).json({ erreur: "Echec de l'authentification" });
      return;
    }

    res.status(200).json({ message: "Authentification ok" });
  } catch (err) {
    console.error(err);
  }
}
