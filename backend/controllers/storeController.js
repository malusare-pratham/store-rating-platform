const { pool } = require("../config/db");
const { sendSuccess, sendError, sendPaginated } = require("../utils/response");

// GET /api/stores - For normal users browsing stores
exports.getStores = async (req, res) => {
  const { search = "", sortBy = "name", sortOrder = "ASC", page = 1, limit = 12 } = req.query;
  const userId = Number.parseInt(req.user?.id, 10);
  const hasUser = Number.isInteger(userId);

  const validSortFields = ["name", "address", "avg_rating"];
  const safeSort = validSortFields.includes(sortBy) ? sortBy : "name";
  const safeOrder = sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    let whereClause = "WHERE 1=1";
    const params = [];

    if (search) {
      whereClause += " AND (s.name LIKE ? OR s.address LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM stores s ${whereClause}`, params
    );

    const userRatingJoin = hasUser
      ? "LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = ?"
      : "";
    const userRatingSelect = hasUser ? ", ur.rating AS user_rating, ur.id AS user_rating_id" : ", NULL AS user_rating, NULL AS user_rating_id";
    const sortCol = safeSort === "avg_rating" ? "avg_rating" : `s.${safeSort}`;

    const [stores] = await pool.query(
      `SELECT s.id, s.name, s.email, s.address,
              IFNULL(rs.avg_rating, 0) AS avg_rating,
              IFNULL(rs.total_ratings, 0) AS total_ratings
              ${userRatingSelect}
       FROM stores s
       LEFT JOIN (
         SELECT store_id, ROUND(AVG(rating), 1) AS avg_rating, COUNT(*) AS total_ratings
         FROM ratings
         GROUP BY store_id
       ) rs ON s.id = rs.store_id
       ${userRatingJoin}
       ${whereClause}
       ORDER BY ${sortCol} ${safeOrder}
       LIMIT ? OFFSET ?`,
      [...(hasUser ? [userId] : []), ...params, parseInt(limit), offset]
    );

    sendPaginated(res, stores, total, page, limit, "Stores fetched.");
  } catch (error) {
    console.error(error);
    sendError(res, "Server error.", 500);
  }
};

// POST /api/stores/:id/rate
exports.submitRating = async (req, res) => {
  const { id: storeId } = req.params;
  const { rating } = req.body;
  const userId = req.user.id;

  if (!rating || rating < 1 || rating > 5) {
    return sendError(res, "Rating must be between 1 and 5.", 400);
  }

  try {
    const [stores] = await pool.query("SELECT id FROM stores WHERE id = ?", [storeId]);
    if (stores.length === 0) return sendError(res, "Store not found.", 404);

    const [existing] = await pool.query(
      "SELECT id FROM ratings WHERE user_id = ? AND store_id = ?",
      [userId, storeId]
    );

    if (existing.length > 0) {
      await pool.query(
        "UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?",
        [rating, userId, storeId]
      );
      return sendSuccess(res, {}, "Rating updated successfully.");
    }

    await pool.query(
      "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
      [userId, storeId, rating]
    );

    sendSuccess(res, {}, "Rating submitted successfully.", 201);
  } catch (error) {
    console.error(error);
    sendError(res, "Server error.", 500);
  }
};

// GET /api/stores/owner/dashboard - For store owners
exports.getOwnerDashboard = async (req, res) => {
  const ownerId = req.user.id;
  try {
    const [stores] = await pool.query("SELECT id, name, email, address FROM stores WHERE owner_id = ?", [ownerId]);
    if (stores.length === 0) return sendError(res, "No store found for this owner.", 404);

    const store = stores[0];

    const [[{ avg_rating, total_ratings }]] = await pool.query(
      "SELECT ROUND(IFNULL(AVG(rating), 0), 1) AS avg_rating, COUNT(*) AS total_ratings FROM ratings WHERE store_id = ?",
      [store.id]
    );

    const [raters] = await pool.query(
      `SELECT u.id, u.name, u.email, r.rating, r.updated_at
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?
       ORDER BY r.updated_at DESC`,
      [store.id]
    );

    sendSuccess(res, { store, avg_rating, total_ratings, raters }, "Owner dashboard fetched.");
  } catch (error) {
    sendError(res, "Server error.", 500);
  }
};
