const { prisma } = require("../utils/prisma");
const { createEventSchema } = require("../validators/event.validator");

async function createEvent(req, res, next) {
  try {
    const data = createEventSchema.parse(req.body);

    // organizer is the logged-in user
    const organizerId = req.user.id;

    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        startsAt: new Date(data.startsAt),
        ticketPrice: data.ticketPrice ?? 0,
        totalSeats: data.totalSeats,
        remainingSeats: data.totalSeats, // important
        status: "PUBLISHED",
        organizerId,
      },
    });

    res.status(201).json({ event });
  } catch (err) {
    if (err.name === "ZodError") {
      err.status = 400;
      err.message = err.issues.map((i) => i.message).join(", ");
    }
    next(err);
  }
}


const { listEventsQuerySchema } = require("../validators/eventQuery.validator");

// GET /events
async function listEvents(req, res, next) {
  try {
    const query = listEventsQuerySchema.parse(req.query);
    const { page, limit, location, status, from, to, q } = query;

    const where = {};

    // Only show published events publicly (you can relax this later if needed)
    where.status = status ?? "PUBLISHED";

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    if (from || to) {
      where.startsAt = {};
      if (from) where.startsAt.gte = new Date(from);
      if (to) where.startsAt.lte = new Date(to);
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { startsAt: "asc" },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          location: true,
          startsAt: true,
          ticketPrice: true,
          totalSeats: true,
          remainingSeats: true,
          status: true,
          organizerId: true,
          createdAt: true,
        },
      }),
      prisma.event.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      page,
      limit,
      total,
      totalPages,
      items,
    });
  } catch (err) {
    if (err.name === "ZodError") {
      err.status = 400;
      err.message = err.issues.map((i) => i.message).join(", ");
    }
    next(err);
  }
}

async function getEventById(req, res, next) {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        startsAt: true,
        ticketPrice: true,
        totalSeats: true,
        remainingSeats: true,
        status: true,
        organizerId: true,
        createdAt: true,
        updatedAt: true,
        organizer: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!event) {
      const err = new Error("Event not found");
      err.status = 404;
      throw err;
    }

    // Public endpoint: only allow viewing PUBLISHED events
    if (event.status !== "PUBLISHED") {
      const err = new Error("Event not found");
      err.status = 404;
      throw err;
    }

    res.json({ event });
  } catch (err) {
    next(err);
  }
}

const { updateEventSchema } = require("../validators/eventUpdate.validator");

async function updateEvent(req, res, next) {
  try {
    const { id } = req.params;
    const organizerId = req.user.id;

    const data = updateEventSchema.parse(req.body);

    // Find event first
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      const err = new Error("Event not found");
      err.status = 404;
      throw err;
    }

    // Ownership check
    if (existing.organizerId !== organizerId) {
      const err = new Error("Forbidden: you can only update your own events");
      err.status = 403;
      throw err;
    }

    // If totalSeats changes, adjust remainingSeats carefully
    // Rule: remainingSeats should not exceed totalSeats, and should not go negative.
    let remainingSeats = existing.remainingSeats;
    let totalSeats = existing.totalSeats;

    if (typeof data.totalSeats === "number") {
      totalSeats = data.totalSeats;

      const alreadyBooked = existing.totalSeats - existing.remainingSeats;
      const newRemaining = totalSeats - alreadyBooked;

      if (newRemaining < 0) {
        const err = new Error(
          "totalSeats is too small because people already booked seats"
        );
        err.status = 400;
        throw err;
      }

      remainingSeats = newRemaining;
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
        ticketPrice: data.ticketPrice,
        status: data.status,

        totalSeats: typeof data.totalSeats === "number" ? totalSeats : undefined,
        remainingSeats: typeof data.totalSeats === "number" ? remainingSeats : undefined,
      },
    });

    res.json({ event: updated });
  } catch (err) {
    if (err.name === "ZodError") {
      err.status = 400;
      err.message = err.issues.map((i) => i.message).join(", ");
    }
    next(err);
  }
}

async function deleteEvent(req, res, next) {
  try {
    const { id } = req.params;
    const organizerId = req.user.id;

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      const err = new Error("Event not found");
      err.status = 404;
      throw err;
    }

    if (existing.organizerId !== organizerId) {
      const err = new Error("Forbidden: you can only delete your own events");
      err.status = 403;
      throw err;
    }

    await prisma.event.delete({ where: { id } });

    res.json({ message: "Event deleted" });
  } catch (err) {
    next(err);
  }
}


module.exports = {
  createEvent,
  listEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
