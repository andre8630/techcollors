import database from "@/infra/database";
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

async function migrations(request, respose) {
  const defaultMigrationOptions = {
    databaseUrl: process.env.DATABASE_URL,
    dryRun: false,
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
    if (migrations.length > 0) {
      return respose.status(201).json(migrations);
    }
    return respose.status(200).json(migrations);
  }

  if (request.method === "GET") {
    const migrations = await migrationRunner({
      ...defaultMigrationOptions,
    });
    return respose.status(200).json(migrations);
  }
}

export default migrations;
