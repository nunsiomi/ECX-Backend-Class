const { z } = require("zod");

const listEventsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),

  location: z.string().min(1).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED"]).optional(),

  // ISO date strings
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),

  // search query
  q: z.string().min(1).optional(),
});

module.exports = { listEventsQuerySchema };
