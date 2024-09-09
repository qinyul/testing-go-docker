import amqplib, { Channel, ConsumeMessage } from "amqplib";
import { fastify } from "./fastify";
import { QUEUE_NAMES } from "../constants";
import { BookRequestBody } from "types/book";
import { addBook } from "../services/book-service";

let channel: Channel | null = null;
let connection: amqplib.Connection | null = null;

const startConsumingMessages = () => {
  channel?.consume(
    QUEUE_NAMES.addBook,
    async (msg: ConsumeMessage | null) => {
      if (msg !== null) {
        const messageContent = msg?.content.toString();
        fastify.log.info({ messageContent }, "Received message");
        const payload = JSON.parse(messageContent) as BookRequestBody;
        await addBook(payload);
        channel?.ack(msg);
      }
    },
    { noAck: false }
  );
};

const initQueues = async () => {
  try {
    if (!connection) {
      throw new Error("Connection not initialized");
    }
    if (!channel) {
      throw new Error("Channel not created");
    }
    await channel.assertQueue(QUEUE_NAMES.addBook, { durable: true });
    fastify.log.info(`Queue ${QUEUE_NAMES.addBook} created`);
  } catch (error) {
    fastify.log.error({ error }, `Failed to create queue`);
  }
};
export const connectRabbitMQ = async () => {
  try {
    connection = await amqplib.connect(
      `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@127.0.0.1:${process.env.RABBITMQ_PORT}`
    );
    channel = await connection.createChannel();
    fastify.log.info("connected to RabbitMQ");

    initQueues();
    startConsumingMessages();
  } catch (error) {
    fastify.log.error({ error }, "failed to connect to RabbitMQ");
    process.exit(1);
  }
};

export const sendToQueue = async (
  queue: string,
  message: Record<string, any>
) => {
  if (!channel) {
    throw new Error("Channel not initialized");
  }

  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
  fastify.log.info(`Message send to queue ${queue}`);
};

export const getRabbitMqChannel = () => {
  if (!channel) {
    throw new Error("Channel not initialized");
  }

  return channel;
};
