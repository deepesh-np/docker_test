const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── MongoDB Connection ─────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ Error: MONGO_URI environment variable is not defined!");
  console.error("Please define it in your environment or in a .env file.");
  process.exit(1);
}
const client = new MongoClient(MONGO_URI);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("docker_test");
    console.log("✅  Connected to MongoDB");
  } catch (err) {
    console.error("❌  MongoDB connection error:", err);
    process.exit(1);
  }
}

// ── Routes ─────────────────────────────────────────────────

// Serve the HTML page
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Get all users from the database
app.get("/getuser", async (_req, res) => {
  try {
    const users = await db.collection("users").find().toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new user to the database
app.post("/adduser", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const result = await db.collection("users").insertOne({
      email,
      username,
      password,
    });
    res.json({ message: "User added successfully", insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Start Server ───────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀  Server running at http://localhost:${PORT}`);
  });
});
