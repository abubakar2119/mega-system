import Fastify from "fastify";

const fastify = new Fastify({
  logger: true,
});

fastify.get("/", (request, reply) => {
  return {
    message: "Welcome to auth service!!",
  };
});

const start = async () => {
  const PORT = process.env.PORT || 4000;
  try {
    await fastify.listen({ port: PORT });
    console.log(`Server is running at ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
