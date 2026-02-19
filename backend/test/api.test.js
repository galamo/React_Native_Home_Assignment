/**
 * Integration tests for the Banking API.
 * Run: npm test
 */

const { describe, it } = require("node:test");
const assert = require("node:assert");
const request = require("supertest");
const app = require("../server");

const validCredentials = { email: "demo@bank.com", password: "demo123" };

describe("Banking API", () => {
  describe("POST /api/auth/login", () => {
    it("returns 200 and token for valid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .set("Content-Type", "application/json")
        .send(validCredentials);
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.token);
      assert.strictEqual(res.body.token, "mock-jwt-user-001");
      assert.strictEqual(res.body.user.email, "demo@bank.com");
      assert.ok(res.body.user.firstName);
      assert.ok(res.body.user.lastName);
    });

    it("returns 401 for wrong password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .set("Content-Type", "application/json")
        .send({ email: "demo@bank.com", password: "wrong" });
      assert.strictEqual(res.status, 401);
      assert.strictEqual(res.body.error, "Invalid email or password");
    });

    it("returns 401 for unknown email", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .set("Content-Type", "application/json")
        .send({ email: "unknown@bank.com", password: "demo123" });
      assert.strictEqual(res.status, 401);
      assert.strictEqual(res.body.error, "Invalid email or password");
    });

    it("returns 401 when body is empty", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .set("Content-Type", "application/json")
        .send({});
      assert.strictEqual(res.status, 401);
    });
  });

  describe("GET /api/accounts/me", () => {
    const token = "mock-jwt-user-001";

    it("returns 200 and accounts when authorized", async () => {
      const res = await request(app)
        .get("/api/accounts/me")
        .set("Authorization", "Bearer " + token);
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.accounts));
      assert.ok(res.body.accounts.length >= 1);
      const acc = res.body.accounts[0];
      assert.strictEqual(acc.id, "acc-001");
      assert.strictEqual(acc.name, "Main Account");
      assert.strictEqual(typeof acc.balance, "number");
      assert.strictEqual(acc.currency, "ILS");
    });

    it("returns 401 without Authorization header", async () => {
      const res = await request(app).get("/api/accounts/me");
      assert.strictEqual(res.status, 401);
      assert.strictEqual(res.body.error, "Unauthorized");
    });

    it("returns 401 with invalid token", async () => {
      const res = await request(app)
        .get("/api/accounts/me")
        .set("Authorization", "Bearer invalid-token");
      assert.strictEqual(res.status, 401);
    });
  });

  describe("GET /api/transactions", () => {
    const token = "mock-jwt-user-001";

    it("returns 200 and transactions array when authorized", async () => {
      const res = await request(app)
        .get("/api/transactions")
        .set("Authorization", "Bearer " + token);
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.transactions));
      assert.ok(res.body.transactions.length >= 1);
      const tx = res.body.transactions[0];
      assert.ok(tx.id);
      assert.ok(tx.amount !== undefined);
      assert.ok(tx.type === "debit" || tx.type === "credit");
      assert.ok(tx.description);
      assert.ok(tx.date);
    });

    it("returns transactions sorted by date descending", async () => {
      const res = await request(app)
        .get("/api/transactions")
        .set("Authorization", "Bearer " + token);
      assert.strictEqual(res.status, 200);
      const list = res.body.transactions;
      for (let i = 1; i < list.length; i++) {
        const prev = new Date(list[i - 1].date).getTime();
        const curr = new Date(list[i].date).getTime();
        assert.ok(prev >= curr, "transactions should be newest first");
      }
    });

    it("honors limit query param", async () => {
      const res = await request(app)
        .get("/api/transactions?limit=3")
        .set("Authorization", "Bearer " + token);
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.transactions.length <= 3);
    });

    it("returns 401 without token", async () => {
      const res = await request(app).get("/api/transactions");
      assert.strictEqual(res.status, 401);
    });
  });

  describe("GET /api/transactions/:id", () => {
    const token = "mock-jwt-user-001";

    it("returns 200 and transaction when authorized and id exists", async () => {
      const res = await request(app)
        .get("/api/transactions/tx-001")
        .set("Authorization", "Bearer " + token);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.id, "tx-001");
      assert.strictEqual(res.body.accountId, "acc-001");
      assert.strictEqual(res.body.description, "Supermarket");
      assert.strictEqual(res.body.amount, -89.5);
    });

    it("returns 404 for non-existent transaction id", async () => {
      const res = await request(app)
        .get("/api/transactions/tx-nonexistent")
        .set("Authorization", "Bearer " + token);
      assert.strictEqual(res.status, 404);
      assert.strictEqual(res.body.error, "Transaction not found");
    });

    it("returns 401 without token", async () => {
      const res = await request(app).get("/api/transactions/tx-001");
      assert.strictEqual(res.status, 401);
    });
  });

  describe("POST /api/transactions", () => {
    const token = "mock-jwt-user-001";

    it("returns 201 and created transaction for valid debit", async () => {
      const body = {
        amount: 25.5,
        type: "debit",
        description: "Test purchase",
        category: "food",
        merchant: "Test Store",
      };
      const res = await request(app)
        .post("/api/transactions")
        .set("Authorization", "Bearer " + token)
        .set("Content-Type", "application/json")
        .send(body);
      assert.strictEqual(res.status, 201);
      assert.ok(res.body.id);
      assert.ok(res.body.id.startsWith("tx-"));
      assert.strictEqual(res.body.amount, -25.5);
      assert.strictEqual(res.body.type, "debit");
      assert.strictEqual(res.body.description, "Test purchase");
      assert.strictEqual(res.body.category, "food");
      assert.strictEqual(res.body.merchant, "Test Store");
      assert.strictEqual(res.body.accountId, "acc-001");
      assert.ok(res.body.date);
    });

    it("returns 201 and created transaction for valid credit", async () => {
      const body = {
        amount: 100,
        type: "credit",
        description: "Refund",
        category: "other",
      };
      const res = await request(app)
        .post("/api/transactions")
        .set("Authorization", "Bearer " + token)
        .set("Content-Type", "application/json")
        .send(body);
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.amount, 100);
      assert.strictEqual(res.body.type, "credit");
      assert.strictEqual(res.body.description, "Refund");
    });

    it("returns 400 for invalid amount (zero)", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set("Authorization", "Bearer " + token)
        .set("Content-Type", "application/json")
        .send({ amount: 0, type: "debit", description: "x" });
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.error, "Invalid amount");
    });

    it("returns 400 for invalid amount (missing)", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set("Authorization", "Bearer " + token)
        .set("Content-Type", "application/json")
        .send({ type: "debit", description: "x" });
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.error, "Invalid amount");
    });

    it("returns 401 without token", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set("Content-Type", "application/json")
        .send({ amount: 10, type: "debit", description: "x" });
      assert.strictEqual(res.status, 401);
    });
  });

  describe("CORS and 404", () => {
    it("OPTIONS returns 204 with CORS headers", async () => {
      const res = await request(app)
        .options("/api/transactions")
        .set("Origin", "http://localhost:19006");
      assert.strictEqual(res.status, 204);
      assert.strictEqual(res.headers["access-control-allow-origin"], "*");
      assert.ok(res.headers["access-control-allow-methods"]);
      assert.ok(res.headers["access-control-allow-headers"]);
    });

    it("unknown path returns 404", async () => {
      const res = await request(app).get("/api/unknown");
      assert.strictEqual(res.status, 404);
      assert.strictEqual(res.body.error, "Not found");
      assert.strictEqual(res.body.path, "/api/unknown");
    });
  });
});
