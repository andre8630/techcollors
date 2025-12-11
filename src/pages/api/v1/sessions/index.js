import { createRouter } from "next-connect";
import controller from "src/infra/controller";
import * as cookie from "cookie";
import authentication from "src/models/authentication";
import session from "src/models/session";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandler);

async function postHandler(request, response) {
  const userInputValues = request.body;

  const authenticationUser = await authentication.getAuthenticateUser(
    userInputValues.email,
    userInputValues.password
  );
  const newSession = await session.create(authenticationUser.id);

  const setCookie = cookie.serialize("session_id", newSession.token, {
    path: "/",
    maxAge: session.expireAtMilleSeconds / 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  response.setHeader("Set-Cookie", setCookie);

  return response.status(201).json(newSession);
}
