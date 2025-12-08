import { createRouter } from "next-connect";
import controller from "src/infra/controller";
import user from "src/models/user";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandler);

async function getHandler(request, response) {
  const username = request.query.username;
  const userFound = await user.findOnByUsername(username);
  return response.status(200).json(userFound);
}
