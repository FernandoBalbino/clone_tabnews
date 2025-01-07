import database from "infra/database.js";
import { version } from "react";
async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const db_version_result = await database.query("SHOW server_version;");
  const db_version_value = db_version_result.rows[0].server_version;

  const db_max_connections = await database.query("SHOW max_connections;");

  const db_name = process.env.POSTGRES_DB;

  const db_max_connections_value = db_max_connections.rows[0].max_connections;

  const db_opened_connections = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1",
    values: [db_name],
  });
  const db_opened_connections_value = db_opened_connections.rows[0].count;
  console.log(db_opened_connections_value);
  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: db_version_value,
        max_connections: db_max_connections_value,
        opened_connections: db_opened_connections_value,
      },
    },
  });
}

export default status;
