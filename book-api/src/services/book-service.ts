import { fastify } from "../plugins/fastify";
import { postgreSQLClient } from "../plugins/postgresql";
import { BookRequestBody } from "../types/book";

export const addBook = async ({
  title,
  author,
  description,
}: BookRequestBody) => {
  try {
    await postgreSQLClient.query("BEGIN");
    await postgreSQLClient.query(
      "INSERT INTO books(title,author,description) VALUES($1,$2,$3)",
      [title, author, description]
    );

    await postgreSQLClient.query("COMMIT");
    fastify.log.info("Books Created");
  } catch (error) {
    await postgreSQLClient.query("ROLLBACK");
    fastify.log.error({ error }, "Something went wrong book not created");
  }
};
