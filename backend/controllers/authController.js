const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");
const { sendSuccess, sendError } = require("../utils/response");

// POST /api/auth/signup
exports.signup = async (req, res) => {
  const { name, email, password, address } = req.body;

  try {
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return sendError(res, "Email already registered.", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, 'user')",
      [name, email, hashedPassword, address]
    );

    sendSuccess(res, { id: result.insertId }, "Account created successfully.", 201);
  } catch (error) {
    console.error("Signup error:", error);
    sendError(res, "Server error during signup.", 500);
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query(
      "SELECT id, name, email, password, role, address FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return sendError(res, "Invalid email or password.", 401);
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return sendError(res, "Invalid email or password.", 401);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    const userData = { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address };

    sendSuccess(res, { token, user: userData }, "Login successful.");
  } catch (error) {
    console.error("Login error:", error);
    sendError(res, "Server error during login.", 500);
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, name, email, role, address, created_at FROM users WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return sendError(res, "User not found.", 404);
    }

    sendSuccess(res, { user: users[0] }, "User fetched.");
  } catch (error) {
    sendError(res, "Server error.", 500);
  }
};

// PUT /api/auth/update-password
exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const [users] = await pool.query("SELECT password FROM users WHERE id = ?", [req.user.id]);
    if (users.length === 0) return sendError(res, "User not found.", 404);

    const isMatch = await bcrypt.compare(currentPassword, users[0].password);
    if (!isMatch) return sendError(res, "Current password is incorrect.", 400);

    const hashed = await bcrypt.hash(newPassword, 12);
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [hashed, req.user.id]);

    sendSuccess(res, {}, "Password updated successfully.");
  } catch (error) {
    sendError(res, "Server error.", 500);
  }
};
