/**
 * Mock data for the banking API.
 * In a real app this would come from a database.
 */

const accounts = [
  { id: "acc-001", userId: "user-001", name: "Main Account", type: "checking", balance: 12450.75, currency: "ILS", lastFour: "4521" },
  { id: "acc-002", userId: "user-001", name: "Savings", type: "savings", balance: 85000.0, currency: "ILS", lastFour: "7832" },
  { id: "acc-003", userId: "user-001", name: "Family Account", type: "checking", balance: 3200.5, currency: "ILS", lastFour: "1098" },
  { id: "acc-004", userId: "user-001", name: "USD Account", type: "checking", balance: 1500.0, currency: "USD", lastFour: "5544" },
  { id: "acc-005", userId: "user-001", name: "Euro Account", type: "savings", balance: 2200.0, currency: "EUR", lastFour: "6612" },
  { id: "acc-006", userId: "user-001", name: "Credit Card", type: "credit", balance: -1200.25, currency: "ILS", lastFour: "3345" },
  { id: "acc-007", userId: "user-002", name: "Business Checking", type: "checking", balance: 45670.0, currency: "ILS", lastFour: "9012" },
  { id: "acc-008", userId: "user-002", name: "Emergency Fund", type: "savings", balance: 25000.0, currency: "ILS", lastFour: "2789" },
  { id: "acc-009", userId: "user-003", name: "Holiday Savings", type: "savings", balance: 5800.0, currency: "ILS", lastFour: "4433" },
  { id: "acc-010", userId: "user-003", name: "Secondary Checking", type: "checking", balance: 890.0, currency: "ILS", lastFour: "6677" },
];

const users = [
  { id: "user-001", email: "demo@bank.com", password: "demo123", firstName: "Avi", lastName: "Demo" },
  { id: "user-002", email: "maya@bank.com", password: "maya123", firstName: "Maya", lastName: "Cohen" },
  { id: "user-003", email: "david@bank.com", password: "david123", firstName: "David", lastName: "Levi" },
];

const transactions = [
  { id: "tx-001", accountId: "acc-001", amount: -89.5, type: "debit", description: "Supermarket", category: "groceries", date: "2025-02-18T10:30:00Z", merchant: "Shufersal" },
  { id: "tx-002", accountId: "acc-001", amount: -45.0, type: "debit", description: "Coffee", category: "food", date: "2025-02-18T08:15:00Z", merchant: "Cafe Cafe" },
  { id: "tx-003", accountId: "acc-001", amount: 2500.0, type: "credit", description: "Salary", category: "income", date: "2025-02-15T00:00:00Z", merchant: "Employer Ltd" },
  { id: "tx-004", accountId: "acc-001", amount: -120.0, type: "debit", description: "Electricity", category: "utilities", date: "2025-02-14T12:00:00Z", merchant: "IEC" },
  { id: "tx-005", accountId: "acc-001", amount: -299.0, type: "debit", description: "Internet", category: "utilities", date: "2025-02-13T09:00:00Z", merchant: "Bezeq" },
  { id: "tx-006", accountId: "acc-001", amount: -55.0, type: "debit", description: "Pharmacy", category: "health", date: "2025-02-12T14:20:00Z", merchant: "Super-Pharm" },
  { id: "tx-007", accountId: "acc-001", amount: -180.0, type: "debit", description: "Restaurant", category: "food", date: "2025-02-11T19:45:00Z", merchant: "Miznon" },
  { id: "tx-008", accountId: "acc-001", amount: 500.0, type: "credit", description: "Transfer from savings", category: "transfer", date: "2025-02-10T11:00:00Z", merchant: "Internal Transfer" },
  { id: "tx-009", accountId: "acc-001", amount: -32.0, type: "debit", description: "Fuel", category: "transport", date: "2025-02-09T07:30:00Z", merchant: "Paz" },
  { id: "tx-010", accountId: "acc-001", amount: -199.0, type: "debit", description: "Streaming", category: "entertainment", date: "2025-02-08T00:00:00Z", merchant: "Netflix" },
  { id: "tx-011", accountId: "acc-001", amount: -67.0, type: "debit", description: "Books", category: "shopping", date: "2025-02-07T16:00:00Z", merchant: "Steimatzky" },
  { id: "tx-012", accountId: "acc-001", amount: -410.0, type: "debit", description: "Insurance", category: "insurance", date: "2025-02-05T00:00:00Z", merchant: "Migdal" },
  { id: "tx-013", accountId: "acc-001", amount: -89.5, type: "debit", description: "Supermarket", category: "groceries", date: "2025-02-04T18:00:00Z", merchant: "Rami Levy" },
  { id: "tx-014", accountId: "acc-001", amount: -22.0, type: "debit", description: "Parking", category: "transport", date: "2025-02-03T12:00:00Z", merchant: "Pango" },
  { id: "tx-015", accountId: "acc-001", amount: 2500.0, type: "credit", description: "Salary", category: "income", date: "2025-02-01T00:00:00Z", merchant: "Employer Ltd" },
  // user-002 (acc-007, acc-008)
  { id: "tx-016", accountId: "acc-007", amount: 12000.0, type: "credit", description: "Invoice paid", category: "income", date: "2025-02-17T14:00:00Z", merchant: "Acme Ltd" },
  { id: "tx-017", accountId: "acc-007", amount: -350.0, type: "debit", description: "Office supplies", category: "shopping", date: "2025-02-16T11:30:00Z", merchant: "IKEA" },
  { id: "tx-018", accountId: "acc-007", amount: -1200.0, type: "debit", description: "Payroll", category: "utilities", date: "2025-02-15T09:00:00Z", merchant: "Bank Transfer" },
  { id: "tx-019", accountId: "acc-008", amount: 2000.0, type: "credit", description: "Monthly deposit", category: "transfer", date: "2025-02-14T08:00:00Z", merchant: "Internal Transfer" },
  { id: "tx-020", accountId: "acc-008", amount: 15.5, type: "credit", description: "Interest", category: "income", date: "2025-02-10T00:00:00Z", merchant: "Bank" },
  // user-003 (acc-009, acc-010)
  { id: "tx-021", accountId: "acc-009", amount: 500.0, type: "credit", description: "Savings deposit", category: "transfer", date: "2025-02-18T16:00:00Z", merchant: "Internal Transfer" },
  { id: "tx-022", accountId: "acc-009", amount: 200.0, type: "credit", description: "Bonus", category: "income", date: "2025-02-12T12:00:00Z", merchant: "Employer" },
  { id: "tx-023", accountId: "acc-010", amount: -75.0, type: "debit", description: "Grocery", category: "groceries", date: "2025-02-17T18:45:00Z", merchant: "Victory" },
  { id: "tx-024", accountId: "acc-010", amount: -210.0, type: "debit", description: "Dental", category: "health", date: "2025-02-15T10:00:00Z", merchant: "Dr. Smith" },
  { id: "tx-025", accountId: "acc-010", amount: 890.0, type: "credit", description: "Salary", category: "income", date: "2025-02-01T00:00:00Z", merchant: "Employer Ltd" },
];

module.exports = { accounts, users, transactions };
