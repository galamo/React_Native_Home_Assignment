# Client — Mini Banking Dashboard (Home Task)

Your task is to build a small **React Native** banking-style app that uses the mock API provided in the `backend` folder. This document describes exactly what to implement on each screen and what the goals of the exercise are.

---

## What you need to deliver

1. **Working app** that implements all screens and behaviors described below.
2. **README in the `client` folder** with:
   - How to install dependencies and run the app.
   - Which API base URL you used for simulator/device (so we can run it the same way).
3. **Code** that we can open and run without guessing (clear structure, no unexplained steps).

---

## Screens and requirements

Implement the following screens and behavior. You choose navigation structure (tabs, stack, etc.) and exact UI layout as long as the described functionality is there.

---

### 1. Login screen

**Purpose:** Let the user sign in with email and password; get a token from the API and move to the rest of the app.

**Required:**

- Two inputs: **email**, **password**.
- A **Login** button that calls `POST /api/auth/login` with `{ email, password }`.
- **Loading state** while the request is in progress (e.g. disabled button or spinner).
- **Error handling:** if the API returns 401 or an error, show a clear message (e.g. “Invalid email or password”). Do not navigate on error.
- On **success:** store the token (AsyncStorage) and navigate to the main app (e.g. Dashboard).
- Use the mock credentials: `demo@bank.com` / `demo123` for testing.

**Optional:** You can pre-fill email/password for demo convenience; mention it in the README.

---

### 2. Dashboard (Home) screen

**Purpose:** Show the user’s main account summary and balance so they see their financial overview at a glance.

**Required:**

- After login, call `GET /api/accounts/me` with the token in the `Authorization: Bearer <token>` header.
- Display at least:
  - **Account name** (e.g. “Main Account”).
  - **Balance** with currency (e.g. “12,450.75 ILS” — format the number appropriately).
  - **Last 4 digits** of the account if you want (e.g. “\*\*\*\* 4521”).
- **Loading state** while fetching accounts.
- **Error handling:** if the request fails (e.g. 401), show a message and optionally redirect to Login or offer retry.
- A way to **navigate to the Transaction list** (e.g. “View transactions” button or list item).

---

### 3. Transaction list screen

**Purpose:** Show recent transactions in a list with pull-to-refresh so the user can see activity and open details.

**Required:**

- Call `GET /api/transactions` with `Authorization: Bearer <token>`.
- Display each transaction with at least:
  - **Description**
  - **Amount** — show as positive/negative or “+”/“-” and format the number (e.g. “-89.50” or “+2,500.00”). Use different styling for debits vs credits if you like.
  - **Date** — format in a readable way (e.g. “18 Feb 2025” or “Today, 10:30”).
- **Pull-to-refresh** to fetch the list again from the API.
- **Loading state** on first load.
- **Error handling** if the request fails (show message, optional retry).
- **Tap on a row** opens the Transaction detail screen for that transaction (pass id).

- **Pagination** Pagination or "load more" is required; the mock returns a fixed list, so control the pagination as client configuration. add search/filter by description or category if you have time.

---

### 4. Transaction detail screen

**Purpose:** Show full details of a single transaction when the user taps it from the list.

**Required:**

- Receive the transaction id (or full object) from the list (e.g. via navigation params).
- Call `GET /api/transactions/:id` with `Authorization: Bearer <token>` (or use the data you already have from the list — both are acceptable).
- Display at least:
  - **Description / merchant**
  - **Amount** (formatted, with sign)
  - **Date** (formatted)
  - **Category** (e.g. “groceries”)
  - **Type** (debit/credit) if useful
- **Loading state** if you fetch by id.
- **Error handling** if you fetch and get 404 or network error (show message).
- **Back:** Back button or header back to the list is expected as part of normal navigation.

---

### 5. Transaction form (New transaction)

**Purpose:** Let the user create a new transaction. The form submits to the API; the new transaction is saved in memory on the backend and will appear in the transaction list.

**Required:**

- A way to **open this screen** from the app (e.g. “Add transaction” or “New transaction” from the Dashboard or from the Transaction list).
- Form inputs for:
  - **Amount** — number, required (positive value; debit/credit is chosen separately).
  - **Type** — `debit` (money out) or `credit` (money in). Use a picker, segmented control, or two options.
  - **Description** — text, required (e.g. “Coffee”, “Salary”).
  - **Category** — text, optional (e.g. “food”, “groceries”, “income”). Can be free text or a fixed list.
  - **Merchant** — text, optional.
- **Submit** button that calls `POST /api/transactions` with `Authorization: Bearer <token>` and body: `{ amount, type, description, category, merchant }` (see [backend README](../backend/README.md) for exact fields).
- **Loading state** while the request is in progress.
- **Error handling:** if the API returns 400 or 401, show the error message (e.g. “Invalid amount” or “Unauthorized”). Do not navigate on error.
- On **success:** show a short success feedback (e.g. “Transaction added”) and then navigate back to the Transaction list (or to the new transaction’s detail) so the user sees the new transaction. The list should show the new item (pull-to-refresh or refetch after create).

- **Validation:** Basic validation before submit (e.g. amount > 0, description non-empty). You can reuse categories from existing transactions or use a simple dropdown.

---

## Technical expectations

- **React Native**
- **Pagination**
- **Navigation**
- **Error handling**
- **Crash logs**
- **API Layer**
- **Structure**
- **Unit tests**

---
