const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  getDashboard, getAllUsers, getUserById, addUser,
  getAllStores, addStore
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");

router.use(authMiddleware, roleMiddleware("admin"));

router.get("/dashboard", getDashboard);

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", [
  body("name").isLength({ min: 20, max: 60 }).withMessage("Name must be 20-60 characters").trim(),
  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
  body("password").isLength({ min: 8, max: 16 }).withMessage("Password 8-16 chars")
    .matches(/[A-Z]/).withMessage("Must have uppercase")
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Must have special character"),
  body("address").optional().isLength({ max: 400 }).withMessage("Address max 400 chars"),
  body("role").isIn(["admin", "user", "store_owner"]).withMessage("Invalid role"),
  validate,
], addUser);

router.get("/stores", getAllStores);
router.post("/stores", [
  body("name").isLength({ min: 20, max: 60 }).withMessage("Name must be 20-60 characters").trim(),
  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
  body("address").optional().isLength({ max: 400 }).withMessage("Address max 400 chars"),
  validate,
], addStore);

module.exports = router;
