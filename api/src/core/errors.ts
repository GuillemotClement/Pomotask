import type { ContentfulStatusCode } from "hono/utils/http-status";

// classe de base pour les erreurs API
export class AppError extends Error {
  constructor(
    public message: string,
    public readonly statusCode: ContentfulStatusCode,
  ) {
    super(message);
    this.name = "AppError";
  }
}

// création d'une classe d'erreur dédié
export class NotFoundError extends AppError {
  constructor(message: string = "Ressource non trouvée") {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "user unauthorized") {
    super(message, 401);
  }
}

export class UnprocessableEntity extends AppError {
  constructor(message: string = "cannot be processed") {
    super(message, 422);
  }
}
