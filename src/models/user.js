import database from "src/infra/database";
import { ValidationError, NotFoundError } from "src/infra/errors";
import password from "src/models/password.js";

async function create(userInputValues) {
  await validateUniqueUsername(userInputValues.username);
  await validateUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function runInsertQuery(userInputValues) {
    const result = await database.query({
      text: "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;",
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });
    console.log(result.rows[0]);
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

async function update(username, userInputValues) {
  const currentUser = await findOnByUsername(username);

  if ("username" in userInputValues) {
    await validateUniqueUsername(userInputValues.username);
  }

  if ("email" in userInputValues) {
    await validateUniqueEmail(userInputValues.email);
  }

  if ("password" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const userWithNewData = { ...currentUser, ...userInputValues };

  const updatedUser = runUpdateQuery(userWithNewData);

  return updatedUser;

  async function runUpdateQuery(userWithNewData) {
    const results = await database.query({
      text: `UPDATE users SET username = $2, email = $3, password = $4, updated_at = timezone('utc', now()) WHERE id = $1 RETURNING *`,
      values: [
        userWithNewData.id,
        userWithNewData.username,
        userWithNewData.email,
        userWithNewData.password,
      ],
    });
    return results.rows[0];
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

async function hashPasswordInObject(userInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);
  userInputValues.password = hashedPassword;
}

const user = {
  create,
  update,
  findOnByUsername,
};

export default user;
