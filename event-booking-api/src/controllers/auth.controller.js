const { prisma } = require("../utils/prisma");
const { hashPassword, comparePassword } = require("../utils/hash");
const { signToken } = require("../utils/jwt");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      const err = new Error("Email already in use");
      err.status = 409;
      throw err;
    }

    const hashed = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashed,
        role: data.role || "ATTENDEE",
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    res.status(201).json({ user });
  } catch (err) {
    // zod errors:
    if (err.name === "ZodError") {
      err.status = 400;
      err.message = err.issues.map((i) => i.message).join(", ");
    }
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      const err = new Error("Invalid email or password");
      err.status = 401;
      throw err;
    }

    const ok = await comparePassword(data.password, user.password);
    if (!ok) {
      const err = new Error("Invalid email or password");
      err.status = 401;
      throw err;
    }

    const token = signToken({ userId: user.id, role: user.role });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    if (err.name === "ZodError") {
      err.status = 400;
      err.message = err.issues.map((i) => i.message).join(", ");
    }
    next(err);
  }
}

module.exports = { register, login };
