const router = require("express").Router();

const {
  createEvent,
  listEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/event.controller");

const {
  createBooking,
  listBookingsForEvent,
} = require("../controllers/booking.controller");

const { requireAuth, requireRole } = require("../middleware/auth.middleware");

/**
 * @openapi
 * /events:
 *   get:
 *     summary: List published events (pagination + filtering)
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 10 }
 *       - in: query
 *         name: location
 *         schema: { type: string, example: "Lagos" }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [DRAFT, PUBLISHED, CANCELLED] }
 *       - in: query
 *         name: q
 *         schema: { type: string, example: "meetup" }
 *       - in: query
 *         name: from
 *         schema: { type: string, example: "2026-03-01T00:00:00.000Z" }
 *       - in: query
 *         name: to
 *         schema: { type: string, example: "2026-04-01T00:00:00.000Z" }
 *     responses:
 *       200:
 *         description: List of events
 */
router.get("/", listEvents);

/**
 * @openapi
 * /events/{id}/bookings:
 *   get:
 *     summary: List bookings for an event (Organizer only, must own event)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of bookings for this event
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Event not found
 */
router.get(
  "/:id/bookings",
  requireAuth,
  requireRole("ORGANIZER"),
  listBookingsForEvent
);

/**
 * @openapi
 * /events/{id}/book:
 *   post:
 *     summary: Book seats for an event (Attendee only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity: { type: integer, example: 2 }
 *     responses:
 *       201:
 *         description: Booking created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Event not found
 *       409:
 *         description: Not enough seats / already booked
 */
router.post("/:id/book", requireAuth, requireRole("ATTENDEE"), createBooking);

/**
 * @openapi
 * /events/{id}:
 *   get:
 *     summary: Get event details by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 */
router.get("/:id", getEventById);

/**
 * @openapi
 * /events:
 *   post:
 *     summary: Create an event (Organizer only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, location, startsAt, totalSeats]
 *             properties:
 *               title: { type: string, example: "Tech Meetup" }
 *               description: { type: string, example: "A meetup for backend beginners" }
 *               location: { type: string, example: "Akure" }
 *               startsAt: { type: string, example: "2026-03-01T10:00:00.000Z" }
 *               ticketPrice: { type: integer, example: 0 }
 *               totalSeats: { type: integer, example: 50 }
 *     responses:
 *       201:
 *         description: Event created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not organizer)
 */
router.post("/", requireAuth, requireRole("ORGANIZER"), createEvent);

/**
 * @openapi
 * /events/{id}:
 *   patch:
 *     summary: Update an event (Organizer only, must own event)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string, example: "Updated title" }
 *               description: { type: string, example: "Updated description" }
 *               location: { type: string, example: "Lagos" }
 *               startsAt: { type: string, example: "2026-03-02T10:00:00.000Z" }
 *               ticketPrice: { type: integer, example: 1000 }
 *               totalSeats: { type: integer, example: 80 }
 *               status: { type: string, enum: [DRAFT, PUBLISHED, CANCELLED] }
 *     responses:
 *       200:
 *         description: Event updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Event not found
 */
router.patch("/:id", requireAuth, requireRole("ORGANIZER"), updateEvent);

/**
 * @openapi
 * /events/{id}:
 *   delete:
 *     summary: Delete an event (Organizer only, must own event)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Event deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Event not found
 */
router.delete("/:id", requireAuth, requireRole("ORGANIZER"), deleteEvent);

module.exports = router;
