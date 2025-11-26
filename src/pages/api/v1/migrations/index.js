import database from "@/infra/database";
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

async function migrations(request, respose) {
  const allowMethod = ["GET", "POST"];
  if (!allowMethod.includes(request.method)) {
    return respose.status(405).end();
  }
  const dbClient = await database.getNewClient();
  const defaultMigrationOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: join(process.cwd(), "src", "infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "POST") {
    const migrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
    });

    await dbClient.end();
    if (migrations.length > 0) {
      return respose.status(201).json(migrations);
    }

    return respose.status(200).json(migrations);
  }

  if (request.method === "GET") {
    const migrations = await migrationRunner({
      ...defaultMigrationOptions,
    });
    await dbClient.end();
    return respose.status(200).json(migrations);
  }
}

export default migrations;
