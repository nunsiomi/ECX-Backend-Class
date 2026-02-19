const { prisma } = require("../utils/prisma");
const { createBookingSchema } = require("../validators/booking.validator");

async function createBooking(req, res, next) {
  try {
    const userId = req.user.id;
    const eventId = req.params.id;

    const data = createBookingSchema.parse(req.body);
    const quantity = data.quantity;

    // Transaction: check seats + deduct seats + create booking
    const result = await prisma.$transaction(async (tx) => {
      // 1) Load event
      const event = await tx.event.findUnique({ where: { id: eventId } });

      if (!event) {
        const err = new Error("Event not found");
        err.status = 404;
        throw err;
      }

      if (event.status !== "PUBLISHED") {
        const err = new Error("Event is not available for booking");
        err.status = 400;
        throw err;
      }

      // 2) Ensure enough seats
      if (event.remainingSeats < quantity) {
        const err = new Error("Not enough seats available");
        err.status = 409;
        throw err;
      }

      // 3) Deduct seats
      await tx.event.update({
        where: { id: eventId },
        data: { remainingSeats: { decrement: quantity } },
      });

      // 4) Create booking (unique constraint prevents duplicates)
      const booking = await tx.booking.create({
        data: {
          userId,
          eventId,
          quantity,
          status: "CONFIRMED",
        },
        select: {
          id: true,
          eventId: true,
          userId: true,
          quantity: true,
          status: true,
          createdAt: true,
        },
      });

      return booking;
    });

    res.status(201).json({ booking: result });
  } catch (err) {
    // Zod validation errors
    if (err.name === "ZodError") {
      err.status = 400;
      err.message = err.issues.map((i) => i.message).join(", ");
    }

    // Prisma unique constraint: user already booked this event
    // Prisma throws a known request error with code "P2002"
    if (err.code === "P2002") {
      err.status = 409;
      err.message = "You have already booked this event";
    }

    next(err);
  }
}

async function listMyBookings(req, res, next) {
  try {
    const userId = req.user.id;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        quantity: true,
        status: true,
        createdAt: true,
        event: {
          select: {
            id: true,
            title: true,
            location: true,
            startsAt: true,
            status: true,
          },
        },
      },
    });

    res.json({ bookings });
  } catch (err) {
    next(err);
  }
}

async function listBookingsForEvent(req, res, next) {
  try {
    const organizerId = req.user.id;
    const eventId = req.params.id;

    // ownership check: event must belong to this organizer
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, organizerId: true, title: true },
    });

    if (!event) {
      const err = new Error("Event not found");
      err.status = 404;
      throw err;
    }

    if (event.organizerId !== organizerId) {
      const err = new Error("Forbidden: you can only view bookings for your own events");
      err.status = 403;
      throw err;
    }

    const bookings = await prisma.booking.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        quantity: true,
        status: true,
        createdAt: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.json({ event: { id: event.id, title: event.title }, bookings });
  } catch (err) {
    next(err);
  }
}



module.exports = { createBooking, listMyBookings, listBookingsForEvent  };
