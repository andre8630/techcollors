import database from "src/infra/database";
import crypto from "node:crypto";

const expireAtMilleSeconds = 60 * 60 * 24 * 30 * 1000;

async function create(userId) {
  const token = crypto.randomBytes(48).toString("hex");

  const expiresAt = new Date(Date.now() + expireAtMilleSeconds);

  const newSession = await runInsertQuery(token, userId, expiresAt);

  return newSession;

  async function runInsertQuery(token, userId, expiresAt) {
    const results = await database.query({
      text: "INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, $3) RETURNING * ;",
      values: [token, userId, expiresAt],
    });
    return results.rows[0];
  }
}

const session = {
  create,
  expireAtMilleSeconds,
};

export default session;

// text:" ",
// values: []
