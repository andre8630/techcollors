import database from "src/infra/database";
import { ValidationError, NotFoundError } from "src/infra/errors";

async function create(userInputValues) {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUsername(userInputValues.username);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function validateUniqueEmail(email) {
    const result = await database.query({
      text: "SELECT email FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1;",
      values: [email],
    });
    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "Email ja cadastrado no banco de dados",
        action: "Tente usar outro email",
      });
    }
  }

  async function validateUniqueUsername(username) {
    const result = await database.query({
      text: "SELECT username FROM users WHERE LOWER(username) = LOWER($1) LIMIT 1;",
      values: [username],
    });
    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "Username ja cadastrado no banco de dados",
        action: "Tente usar outro username",
      });
    }
  }

  async function runInsertQuery(userInputValues) {
    const result = await database.query({
      text: "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;",
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return result.rows[0];
  }
}

async function findOnByUsername(username) {
  const userFound = runInsertQuery(username);

  return userFound;

  async function runInsertQuery(username) {
    const findUser = await database.query({
      text: "SELECT * FROM users WHERE LOWER(username) = LOWER($1) LIMIT 1;",
      values: [username],
    });
    if (findUser.rowCount === 0) {
      throw new NotFoundError({
        message: "Username nao encontrado no banco de dados",
        action: "Tente usar outro username",
      });
    }
    return findUser.rows[0];
  }
}

const user = {
  create,
  findOnByUsername,
};

export default user;
