import fastifyCors from "@fastify/cors";
import { FastifyInstance } from "fastify";

export default async function corsPlugin(
  fastify: FastifyInstance
): Promise<void> {
  fastify.register(fastifyCors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  });
}
