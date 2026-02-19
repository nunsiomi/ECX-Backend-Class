const router = require("express").Router();
const { requireAuth } = require("../middleware/auth.middleware");
const { listMyBookings } = require("../controllers/booking.controller");

/**
 * @openapi
 * /bookings/me:
 *   get:
 *     summary: Get my bookings (Attendee or Organizer)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of my bookings
 *       401:
 *         description: Unauthorized
 */

router.get("/me", requireAuth, listMyBookings);

module.exports = router;
