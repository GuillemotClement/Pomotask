import jwt from "jsonwebtoken"; // lib pour generer et lire des token JWT
import type { JwtPayload } from "jsonwebtoken"; // type TS fourni par jsonwebtoken
import { UserNotAuthenticatedError } from "../errors/errors.js"; // erreur personnalisee

const TOKEN_ISSUER = "pomotask"; // emetteur du iss du token -> identifie l'app

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">; // definition du type avec les champs necessaire
// iss: emetteur du token
// sub: identifiant de l'utilisateur (subject)
// iat: date emission du token
// exp: date d'expiration

export function makeJWT(userId: string, expiresIn: number, secret: string) {
  // userId -> vas dans le sub
  // expiresIn -> duree de validite en seconde
  // secret -> utiliser pour signer le token
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + expiresIn;

  // creation du token
  const token = jwt.sign(
    {
      iss: TOKEN_ISSUER,
      sub: userId,
      iat: issuedAt,
      exp: expiresAt,
    } satisfies payload,
    secret,
    { algorithm: "HS256" }
  );

  // retourne le token signer
  return token;
}
// verifie le token et retourne l'id de l'utilisateur
export function validateJWT(tokenString: string, secret: string) {
  // contient le contenu du token si valie
  // variable qui prends le type payload avec les champs iss, sub, iat, exp
  let decoded: payload;

  // verifie que le token est signer avec le bon secret + date d'expiration
  try {
    decoded = jwt.verify(tokenString, secret) as JwtPayload;
  } catch (err) {
    throw new UserNotAuthenticatedError("Invalid token");
  }
  // verifie que le token provient bien de l'app
  if (decoded.iss != TOKEN_ISSUER) {
    throw new UserNotAuthenticatedError("Invalid issue");
  }
  // verifie qu'on as bien un user
  if (!decoded.sub) {
    throw new UserNotAuthenticatedError("No user ID in token");
  }

  // retourne l'id de l'user
  return decoded.sub;
}
