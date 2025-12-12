import { createRouter } from "next-connect";
import controller from "src/infra/controller";

import authentication from "src/models/authentication";
import session from "src/models/session";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandler);

async function postHandler(request, response) {
  const userInputValues = request.body;

  const authenticationUser = await authentication.getAuthenticateUser(
    userInputValues.email,
    userInputValues.password,
  );
  const newSession = await session.create(authenticationUser.id);

  controller.setSessionCookie(newSession.token, response);

  return response.status(201).json(newSession);
}
