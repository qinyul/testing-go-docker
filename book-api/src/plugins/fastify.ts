import { config } from "../config";
import Fastify from "fastify";

export const fastify = Fastify({
  logger: {
    level: config.env === "development" ? "debug" : "info",
  },
});
