import database from "src/infra/database";
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import { createRouter } from "next-connect";
import controller from "src/infra/controller";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandler);

const defaultMigrationOptions = {
  dryRun: true,
  dir: join(process.cwd(), "src", "infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function getHandler(request, respose) {
  let dbClient;

  dbClient = await database.getNewClient();

  try {
    const migrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient: dbClient,
    });

    return respose.status(200).json(migrations);
  } finally {
    await dbClient.end();
  }
}

async function postHandler(request, respose) {
  let dbClient;

  dbClient = await database.getNewClient();

  try {
    const migrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient: dbClient,
      dryRun: false,
    });

    if (migrations.length > 0) {
      return respose.status(201).json(migrations);
    }

    return respose.status(200).json(migrations);
  } finally {
    await dbClient?.end();
  }
}
