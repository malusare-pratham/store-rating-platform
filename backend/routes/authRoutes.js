const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { signup, login, getMe, updatePassword } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");

const passwordRules = body("password")
  .isLength({ min: 8, max: 16 }).withMessage("Password must be 8-16 characters")
  .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
  .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password must contain at least one special character");

router.post("/signup", [
  body("name").isLength({ min: 20, max: 60 }).withMessage("Name must be 20-60 characters").trim(),
  body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
  body("address").optional().isLength({ max: 400 }).withMessage("Address must be max 400 characters"),
  passwordRules,
  validate,
], signup);

router.post("/login", [
  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
  body("password").notEmpty().withMessage("Password required"),
  validate,
], login);

router.get("/me", authMiddleware, getMe);

router.put("/update-password", authMiddleware, [
  body("currentPassword").notEmpty().withMessage("Current password required"),
  passwordRules.optional({ values: "falsy" })
    .withMessage("").isLength({ min: 8, max: 16 }).withMessage("Password must be 8-16 characters")
    .matches(/[A-Z]/).withMessage("Must include uppercase")
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Must include special character"),
  validate,
], updatePassword);

module.exports = router;
