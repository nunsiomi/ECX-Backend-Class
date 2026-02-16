const router = require("express").Router();
const { requireAuth } = require("../middleware/auth.middleware");

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
