const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Event Booking API",
    version: "1.0.0",
    description: "Backend-only Event Booking & Ticketing API (PostgreSQL + Prisma + JWT)",
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Local server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"], // where we’ll put the doc comments
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerSpec };
