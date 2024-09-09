import { config } from "./config";
import { FastifyInstance } from "fastify";
import { readdirSync, statSync } from "fs";
import { join } from "path";
import corsPlugin from "./plugins/cors";
import { fastify } from "./plugins/fastify";
import { postgreSQLClient } from "./plugins/postgresql";
import { connectRabbitMQ } from "./plugins/rabbitmq";

const loadRoutesWithPrefix = async (
  fastify: FastifyInstance,
  dir: string,
  prefix: string
) => {
  const files = readdirSync(dir);

  for (const file of files) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      await loadRoutesWithPrefix(fastify, fullPath, prefix);
    } else if (file.endsWith(".ts") || file.endsWith(".js")) {
      const route = require(fullPath);
      fastify.register(route.default, { prefix });
    }
  }
};

const initDB = () => {
  console;
  postgreSQLClient
    .connect()
    .then(() => fastify.log.info("Connected to PostgreSQL database"))
    .catch((err) => fastify.log.error({ err }, "Connection error"));
};

const startServer = async () => {
  fastify.register(corsPlugin);

  initDB();
  await connectRabbitMQ();

  await loadRoutesWithPrefix(
    fastify,
    join(__dirname, "routes/books"),
    "/books"
  );

  try {
    await fastify.listen({ port: config.port });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer();
