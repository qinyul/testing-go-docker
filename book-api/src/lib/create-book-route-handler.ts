import { FastifyReply, FastifyRequest } from "fastify";
import { BookRequestBody } from "types/book";
import { addBook } from "../services/book-service";
export const createBookRouteHandler = async (
  request: FastifyRequest<{ Body: BookRequestBody }>,
  reply: FastifyReply
) => {
  const { body } = request;

  try {
    await addBook(body);
    return { status: 200, message: "Books Created" };
  } catch (error) {
    throw new Error("Books not created");
  }
};
