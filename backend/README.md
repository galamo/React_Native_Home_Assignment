# Backend — Mock Banking API

Express server that provides mock data for the Mini Banking Dashboard app. No database; all data is in memory from `data.js`.

---

## Install and run

**Requirements:** Node.js 24

```bash
cd backend
npm install
npm start
```

Server runs at **http://localhost:3000**.  


**Test login:** `demo@bank.com` / `demo123`

**Run integration tests:**

```bash
npm test
```

Tests hit the API in-process (no server needed) and cover login, accounts, transactions list/detail, create transaction, auth errors, and 404/CORS.

---

## API base URL

| Environment        | Base URL              |
|--------------------|-----------------------|
| iOS Simulator      | `http://localhost:3000` |


Use this base URL for all requests from the React Native app.

---

## API endpoints

### 1. Login (get token)

**`POST /api/auth/login`**

Authenticates the user and returns a token. The client must send this token in the `Authorization` header for all other requests.

**Request body:**

```json
{
  "email": "demo@bank.com",
  "password": "demo123"
}
```

**Success (200):**

```json
{
  "token": "mock-jwt-user-001",
  "user": {
    "id": "user-001",
    "email": "demo@bank.com",
    "firstName": "Alex",
    "lastName": "Demo"
  }
}
```

**Error (401):**

```json
{
  "error": "Invalid email or password"
}
```

**Usage:** Call this on the Login screen. Store the `token` and optionally `user`; send `Authorization: Bearer <token>` on every subsequent request.

---

### 2. Get my accounts

**`GET /api/accounts/me`**

Returns the list of accounts for the logged-in user.

**Headers:** `Authorization: Bearer <token>` (required)

**Success (200):**

```json
{
  "accounts": [
    {
      "id": "acc-001",
      "userId": "user-001",
      "name": "Main Account",
      "type": "checking",
      "balance": 12450.75,
      "currency": "ILS",
      "lastFour": "4521"
    }
  ]
}
```

**Error (401):** Missing or invalid token → `{ "error": "Unauthorized" }`

**Usage:** Call after login to show balance and account summary on the Dashboard. You can show the first account or let the user choose if multiple exist.

---

### 3. Get transactions list

**`GET /api/transactions`**

Returns transactions for the logged-in user’s accounts, newest first.

**Headers:** `Authorization: Bearer <token>` (required)

**Query (optional):**

- `limit` — max number of transactions (default 50, max 100). Example: `GET /api/transactions?limit=20`

**Success (200):**

```json
{
  "transactions": [
    {
      "id": "tx-001",
      "accountId": "acc-001",
      "amount": -89.5,
      "type": "debit",
      "description": "Supermarket",
      "category": "groceries",
      "date": "2025-02-18T10:30:00Z",
      "merchant": "Shufersal"
    }
  ]
}
```

- `amount`: negative = money out, positive = money in.
- `type`: `"debit"` or `"credit"`.
- `date`: ISO 8601 string.

**Error (401):** Missing or invalid token → `{ "error": "Unauthorized" }`

**Usage:** Use on the Transaction list screen. Support pull-to-refresh and optionally pagination via `limit` and (in the future) offset or cursor.

---

### 4. Get single transaction

**`GET /api/transactions/:id`**

Returns one transaction by ID.

**Headers:** `Authorization: Bearer <token>` (required)

**Example:** `GET /api/transactions/tx-001`

**Success (200):** Same transaction object as in the list (single object, not wrapped in `transactions`).

**Error (401):** `{ "error": "Unauthorized" }`  
**Error (404):** `{ "error": "Transaction not found" }`

**Usage:** Use on the Transaction detail screen when the user taps a transaction.

---

### 5. Create transaction

**`POST /api/transactions`**

Creates a new transaction for the logged-in user’s account. The transaction is stored **in memory** (same array as the list) and will appear in `GET /api/transactions` until the server restarts.

**Headers:** `Authorization: Bearer <token>` (required)

**Request body:**

```json
{
  "amount": 50.5,
  "type": "debit",
  "description": "Lunch",
  "category": "food",
  "merchant": "Restaurant Name"
}
```

| Field         | Type   | Required | Description |
|---------------|--------|----------|-------------|
| `amount`      | number | Yes      | Positive number. Stored as negative for `debit`, positive for `credit`. |
| `type`        | string | Yes      | `"debit"` (money out) or `"credit"` (money in). |
| `description` | string | Yes      | Short description. Defaults to `"Transaction"` if empty. |
| `category`    | string | No       | e.g. `groceries`, `food`, `utilities`. Defaults to `"other"`. |
| `merchant`    | string | No       | Merchant name. Defaults to `description` if omitted. |

**Success (201):** Returns the created transaction (same shape as in the list), including generated `id` and `date`.

**Errors:**

- **400** — `{ "error": "Invalid amount" }` if `amount` is missing, not a number, or zero.
- **400** — `{ "error": "No account found for user" }` (unexpected with mock data).
- **401** — `{ "error": "Unauthorized" }` if token is missing or invalid.

**Usage:** Use on the Transaction form screen. After success, navigate to the transaction list or detail so the user sees the new transaction.

---

## Summary

| Method | Endpoint                  | Purpose              | Auth   |
|--------|---------------------------|----------------------|--------|
| POST   | `/api/auth/login`         | Login, get token     | No     |
| GET    | `/api/accounts/me`        | My accounts          | Bearer |
| GET    | `/api/transactions`       | Transaction list     | Bearer |
| GET    | `/api/transactions/:id`   | One transaction      | Bearer |
| POST   | `/api/transactions`       | Create transaction   | Bearer |

All responses are JSON. Use the base URL + path for each request (e.g. `http://localhost:3000/api/auth/login`).
