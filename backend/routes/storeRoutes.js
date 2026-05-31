const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { getStores, submitRating, getOwnerDashboard } = require("../controllers/storeController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");

// Public-ish: browsable by users (token optional for user_rating)
router.get("/", authMiddleware, getStores);

// Submit/update rating
router.post("/:id/rate", authMiddleware, roleMiddleware("user"), [
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  validate,
], submitRating);

// Store owner dashboard
router.get("/owner/dashboard", authMiddleware, roleMiddleware("store_owner"), getOwnerDashboard);

module.exports = router;
