import { FastifyReply, FastifyRequest } from "fastify";
import { BookRequestBody } from "types/book";
import { fastify } from "../plugins/fastify";
import { getRabbitMqChannel } from "../plugins/rabbitmq";
import { QUEUE_NAMES } from "../constants";

const logRef = "bulkCreateBooksRouteHandler::";
export const bulkCreateBooksRouteHandler = async (
  request: FastifyRequest<{ Body: BookRequestBody[] }>,
  reply: FastifyReply
) => {
  try {
    const rabbitmqChannel = getRabbitMqChannel();
    for (const payload of request.body) {
      const message = JSON.stringify(payload);

      fastify.log.info(message, `${logRef} starting sending message`);
      rabbitmqChannel.sendToQueue(QUEUE_NAMES.addBook, Buffer.from(message), {
        persistent: true,
      });
      fastify.log.info(message, `${logRef} sending message finish`);
    }

    return { status: 200, message: "Bulk update success" };
  } catch (error) {
    fastify.log.error({ error }, `${logRef} failed to send message`);
    reply.status(500).send({ error: "failed to send message" });
  }
};
