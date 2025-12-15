import * as cookie from "cookie";
import session from "src/models/session";
import {
  InternalServerError,
  MethodNotAllowedError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
} from "@/infra/errors";

function onNoMAtchHandler(resquest, response) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(error, resquest, response) {
  if (
    error instanceof ValidationError ||
    error instanceof NotFoundError ||
    error instanceof UnauthorizedError
  ) {
    return response.status(error.statusCode).json(error);
  }

  if (error instanceof UnauthorizedError) {
    clearSessionCookie(response);
  }

  const publicErrorObject = new InternalServerError({
    cause: error,
  });

  console.error(publicErrorObject);
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

async function setSessionCookie(sessionToken, response) {
  const setCookie = cookie.serialize("session_id", sessionToken, {
    path: "/",
    maxAge: session.expireAtMilleSeconds / 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  response.setHeader("Set-Cookie", setCookie);
}

async function clearSessionCookie(response) {
  const setCookie = cookie.serialize("session_id", "invalid", {
    path: "/",
    maxAge: -1,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  response.setHeader("Set-Cookie", setCookie);
}

const controller = {
  errorHandler: {
    onNoMatch: onNoMAtchHandler,
    onError: onErrorHandler,
  },
  setSessionCookie,
  clearSessionCookie,
};

export default controller;
