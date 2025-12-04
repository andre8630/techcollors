import database from "@/infra/database";
import { InternalServerError } from "@/infra/errors";

async function status(request, respose) {
  try {
    const versionDataBase = await database.query("SHOW server_version;");
    const maxConnections = await database.query("SHOW max_connections;");

    const dataBaseName = process.env.POSTGRES_DB;
    const currentConnections = await database.query({
      text: "SELECT COUNT(*) ::int FROM pg_stat_activity WHERE datname= $1;",
      values: [dataBaseName],
    });

    const updatedAt = new Date().toISOString();
    return respose.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: versionDataBase.rows[0].server_version,
          max_connections: parseInt(maxConnections.rows[0].max_connections),
          current_connections: currentConnections.rows[0].count,
        },
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });
    console.log("\n Error dentro do controller");
    console.error(publicErrorObject);
    respose.status(500).json(publicErrorObject);
  }
}

export default status;
