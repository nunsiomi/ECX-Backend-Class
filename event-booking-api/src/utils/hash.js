const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function comparePassword(password, hashed) {
  return bcrypt.compare(password, hashed);
}

module.exports = { hashPassword, comparePassword };
