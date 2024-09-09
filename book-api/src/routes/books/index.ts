import { FastifyInstance, FastifyRequest } from "fastify";
import { createBookRouteHandler } from "../../lib/create-book-route-handler";
import { BookRequestBody } from "types/book";
import { bulkCreateBooksRouteHandler } from "../../lib/bulk-create-books-route-handler";

export default async function booksRoutes(
  fastify: FastifyInstance
): Promise<void> {
  fastify.get("/", async (request, reply) => {
    return {
      books: [
        {
          name: "Crayon Shincan volume 1",
        },
      ],
    };
  });

  fastify.post(
    "/",
    async (request: FastifyRequest<{ Body: BookRequestBody }>, reply) => {
      return await createBookRouteHandler(request, reply);
    }
  );
  fastify.post(
    "/bulk-create-books",
    async (request: FastifyRequest<{ Body: BookRequestBody[] }>, reply) => {
      return await bulkCreateBooksRouteHandler(request, reply);
    }
  );
}
