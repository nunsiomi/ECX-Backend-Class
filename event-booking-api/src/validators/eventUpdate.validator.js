const { z } = require("zod");

const updateEventSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(5).optional(),
  location: z.string().min(2).optional(),
  startsAt: z.string().datetime().optional(),
  ticketPrice: z.number().int().min(0).optional(),

  // if changing seats, we’ll update remainingSeats safely
  totalSeats: z.number().int().min(1).optional(),

  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED"]).optional(),
});

module.exports = { updateEventSchema };
