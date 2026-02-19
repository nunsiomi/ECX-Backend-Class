const { z } = require("zod");

const createEventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  location: z.string().min(2),
  startsAt: z.string().datetime(),   // ISO string from Postman
  ticketPrice: z.number().int().min(0).optional(),
  totalSeats: z.number().int().min(1),
});

module.exports = { createEventSchema };
