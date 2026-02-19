/**
 * Mock Banking API server (Express).
 * Run: npm install && npm start
 * Base URL: http://localhost:3000 (use your machine IP for device/emulator)
 */

const express = require("express");
const { accounts, users, transactions } = require("./data.js");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

// CORS for React Native (localhost / emulator / device)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());

function getUserId(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer mock-jwt-")) return null;
  return auth.replace("Bearer mock-jwt-", "");
}

// POST /api/auth/login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  res.json({
    token: "mock-jwt-" + user.id,
    user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
  });
});

// GET /api/accounts/me
app.get("/api/accounts/me", (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const userAccounts = accounts.filter((a) => a.userId === userId);
  res.json({ accounts: userAccounts });
});

// GET /api/transactions
app.get("/api/transactions", (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const userAccounts = accounts.filter((a) => a.userId === userId).map((a) => a.id);
  const list = transactions
    .filter((t) => userAccounts.includes(t.accountId))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
  res.json({ transactions: list.slice(0, limit) });
});

// GET /api/transactions/:id
app.get("/api/transactions/:id", (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const tx = transactions.find((t) => t.id === req.params.id);
  if (!tx) {
    return res.status(404).json({ error: "Transaction not found" });
  }
  const userAccounts = accounts.filter((a) => a.userId === userId).map((a) => a.id);
  if (!userAccounts.includes(tx.accountId)) {
    return res.status(404).json({ error: "Transaction not found" });
  }
  res.json(tx);
});

// POST /api/transactions — create a transaction (stored in memory)
app.post("/api/transactions", (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const userAccounts = accounts.filter((a) => a.userId === userId);
  if (!userAccounts.length) {
    return res.status(400).json({ error: "No account found for user" });
  }
  const accountId = userAccounts[0].id;
  const { amount, type, description, category, merchant } = req.body || {};
  const numAmount = typeof amount === "string" ? parseFloat(amount) : Number(amount);
  if (numAmount === undefined || Number.isNaN(numAmount) || numAmount === 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }
  const txType = type === "credit" ? "credit" : "debit";
  const finalAmount = txType === "debit" ? -Math.abs(numAmount) : Math.abs(numAmount);
  const desc = typeof description === "string" && description.trim() ? description.trim() : "Transaction";
  const cat = typeof category === "string" && category.trim() ? category.trim() : "other";
  const merc = typeof merchant === "string" ? merchant.trim() : desc;
  const newTx = {
    id: "tx-" + Date.now(),
    accountId,
    amount: finalAmount,
    type: txType,
    description: desc,
    category: cat,
    date: new Date().toISOString(),
    merchant: merc || desc,
  };
  transactions.push(newTx);
  res.status(201).json(newTx);
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Not found", path: req.path });
});

if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(`Mock Banking API running at http://${HOST}:${PORT}`);
    console.log("Login: demo@bank.com / demo123");
  });
}

module.exports = app;
