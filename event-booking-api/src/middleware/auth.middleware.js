const { verifyToken } = require("../utils/jwt");
const { prisma } = require("../utils/prisma");

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      const err = new Error("Missing or invalid Authorization header");
      err.status = 401;
      throw err;
    }

    const token = header.split(" ")[1];
    const payload = verifyToken(token); // { userId, role }

    // Attach user to request (fresh from DB)
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      const err = new Error("User not found");
      err.status = 401;
      throw err;
    }

    req.user = user; // now all routes can access req.user
    next();
  } catch (err) {
    err.status = err.status || 401;
    next(err);
  }
}

// Role guard (e.g. requireRole("ORGANIZER"))
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      const err = new Error("Unauthorized");
      err.status = 401;
      return next(err);
    }
    if (req.user.role !== role) {
      const err = new Error("Forbidden: insufficient permissions");
      err.status = 403;
      return next(err);
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
