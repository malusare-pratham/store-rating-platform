const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");
const { sendSuccess, sendError, sendPaginated } = require("../utils/response");

// GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const [[{ totalUsers }]] = await pool.query("SELECT COUNT(*) AS totalUsers FROM users");
    const [[{ totalStores }]] = await pool.query("SELECT COUNT(*) AS totalStores FROM stores");
    const [[{ totalRatings }]] = await pool.query("SELECT COUNT(*) AS totalRatings FROM ratings");
    const [[{ avgRating }]] = await pool.query("SELECT ROUND(AVG(rating), 1) AS avgRating FROM ratings");

    sendSuccess(res, { totalUsers, totalStores, totalRatings, avgRating: avgRating || 0 }, "Dashboard data fetched.");
  } catch (error) {
    sendError(res, "Server error.", 500);
  }
};

// GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  const { search = "", role = "", sortBy = "created_at", sortOrder = "DESC", page = 1, limit = 10 } = req.query;

  const validSortFields = ["name", "email", "address", "role", "created_at"];
  const validSortOrders = ["ASC", "DESC"];
  const safeSort = validSortFields.includes(sortBy) ? sortBy : "created_at";
  const safeOrder = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : "DESC";

  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    let whereClause = "WHERE 1=1";
    const params = [];

    if (search) {
      whereClause += " AND (name LIKE ? OR email LIKE ? OR address LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (role) {
      whereClause += " AND role = ?";
      params.push(role);
    }

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM users ${whereClause}`,
      params
    );

    const [users] = await pool.query(
      `SELECT id, name, email, address, role, created_at FROM users ${whereClause} ORDER BY ${safeSort} ${safeOrder} LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    sendPaginated(res, users, total, page, limit, "Users fetched.");
  } catch (error) {
    console.error(error);
    sendError(res, "Server error.", 500);
  }
};

// GET /api/admin/users/:id
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [users] = await pool.query(
      "SELECT id, name, email, address, role, created_at FROM users WHERE id = ?",
      [id]
    );
    if (users.length === 0) return sendError(res, "User not found.", 404);

    const user = users[0];

    if (user.role === "store_owner") {
      const [[storeData]] = await pool.query(
        `SELECT s.name AS store_name, ROUND(AVG(r.rating),1) AS avg_rating
         FROM stores s LEFT JOIN ratings r ON s.id = r.store_id
         WHERE s.owner_id = ? GROUP BY s.id`,
        [id]
      );
      user.store = storeData || null;
    }

    sendSuccess(res, { user }, "User fetched.");
  } catch (error) {
    sendError(res, "Server error.", 500);
  }
};

// POST /api/admin/users
exports.addUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  try {
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) return sendError(res, "Email already registered.", 409);

    const hashed = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashed, address, role]
    );

    sendSuccess(res, { id: result.insertId }, "User added successfully.", 201);
  } catch (error) {
    sendError(res, "Server error.", 500);
  }
};

// GET /api/admin/stores
exports.getAllStores = async (req, res) => {
  const { search = "", sortBy = "name", sortOrder = "ASC", page = 1, limit = 10 } = req.query;

  const validSortFields = ["name", "email", "address", "rating"];
  const safeSort = validSortFields.includes(sortBy) ? sortBy : "name";
  const safeOrder = sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";

  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    let whereClause = "WHERE 1=1";
    const params = [];

    if (search) {
      whereClause += " AND (s.name LIKE ? OR s.email LIKE ? OR s.address LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM stores s ${whereClause}`,
      params
    );

    const sortCol = safeSort === "rating" ? "avg_rating" : `s.${safeSort}`;

    const [stores] = await pool.query(
      `SELECT s.id, s.name, s.email, s.address,
              u.name AS owner_name,
              IFNULL(rs.avg_rating, 0) AS avg_rating,
              IFNULL(rs.total_ratings, 0) AS total_ratings
       FROM stores s
       LEFT JOIN users u ON s.owner_id = u.id
       LEFT JOIN (
         SELECT store_id, ROUND(AVG(rating), 1) AS avg_rating, COUNT(*) AS total_ratings
         FROM ratings
         GROUP BY store_id
       ) rs ON s.id = rs.store_id
       ${whereClause}
       ORDER BY ${sortCol} ${safeOrder}
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    sendPaginated(res, stores, total, page, limit, "Stores fetched.");
  } catch (error) {
    console.error(error);
    sendError(res, "Server error.", 500);
  }
};

// POST /api/admin/stores
exports.addStore = async (req, res) => {
  const { name, email, address, owner_id } = req.body;
  try {
    const [existing] = await pool.query("SELECT id FROM stores WHERE email = ?", [email]);
    if (existing.length > 0) return sendError(res, "A store with this email already exists.", 409);

    if (owner_id) {
      const [owner] = await pool.query("SELECT id, role FROM users WHERE id = ?", [owner_id]);
      if (owner.length === 0) return sendError(res, "Owner not found.", 404);
      if (owner[0].role !== "store_owner") return sendError(res, "Selected user is not a store owner.", 400);
    }

    const [result] = await pool.query(
      "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
      [name, email, address, owner_id || null]
    );

    sendSuccess(res, { id: result.insertId }, "Store added successfully.", 201);
  } catch (error) {
    sendError(res, "Server error.", 500);
  }
};
