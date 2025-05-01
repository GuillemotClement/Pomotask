import { Request, Response } from "express";
import { createUser, getUserByUsername } from "../db/queries/users.js";
import { checkPassword, hashPassword } from "../utils/crypto.js";
import { UserNotAuthenticatedError } from "src/errors/errors.js";
import { config } from "../config.js";
import { makeJWT } from "src/utils/jwtToken.js";

type LoginResponse = UserResponse & {
  token: string;
};

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
  type parameters = {
    password: string;
    username: string;
    expiresIn?: number;
  };

  const params: parameters = req.body;

  const user = await getUserByUsername(params.username);
  if (!user) {
    throw new UserNotAuthenticatedError("invalid username or password");
  }

  let duration = config.jwt.defaultDuration;
  if (params.expiresIn && !(params.expiresIn > config.jwt.defaultDuration)) {
    duration = params.expiresIn;
  }

  const accessToken = makeJWT(user.id, duration, config.jwt.secret!);

  res.status(200).json({
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt,
    updateAt: user.updateAt,
    token: accessToken,
  } satisfies LoginResponse);

  // try {
  //   const { username, password } = req.body;

  //   const dbUser = await getUserByUsername(username);

  //   if (!dbUser) {
  //     res.status(500).json({ erreur: "Echec de l'authentification" });
  //     return;
  //   }

  //   const hashedPassword = dbUser.password;

  //   const authUser = await checkPassword(password, hashedPassword);

  //   if (!authUser) {
  //     res.status(500).json({ erreur: "Echec de l'authentification" });
  //     return;
  //   }

  //   res.status(200).json({ message: "Authentification ok" });
  // } catch (err) {
  //   console.error(err);
  // }
}
