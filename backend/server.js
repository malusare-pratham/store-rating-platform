require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const storeRoutes = require("./routes/storeRoutes");

const app = express();

// ── Middlewares ──────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Health Check ─────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ success: true, message: "Store Rating API v1.0 ✅", timestamp: new Date() });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "healthy", uptime: process.uptime() });
});

// ── Routes ───────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stores", storeRoutes);

// ── Error Handling ───────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 Environment: ${process.env.NODE_ENV || "development"}\n`);
  });
};

startServer();
