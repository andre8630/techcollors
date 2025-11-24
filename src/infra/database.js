import { Client } from "pg";
let client;

async function query(queryObject) {
  try {
    client = new Client({
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      user: process.env.POSTGRES_USER,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      ssl: process.env.NODE_ENV === "development" ? false : true,
    });
    await client.connect();
    const result = await client.query(queryObject);
    return result;
  } catch {
    console.log("Erro de conexao com banco");
  } finally {
    await client.end();
  }
}

const database = {
  query,
};
export default database;
