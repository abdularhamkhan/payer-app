// Script to add mock data to the app
// Run this from Convex dashboard or create mutations to seed data

/**
 * INSTRUCTIONS:
 * 
 * 1. First, sign up a user in the app (email/password or Google)
 * 2. After signup, a wallet is automatically created
 * 3. Go to Convex Dashboard: https://dashboard.convex.dev
 * 4. Select your project (mellow-impala-302)
 * 5. Go to "Data" tab
 * 6. Find your user ID from the "users" table
 * 7. Use the Functions tab to call these mutations manually:
 * 
 * // Topup wallet
 * wallets/topup:topup
 * { "amount": 45000, "source": "bank_transfer" }
 * 
 * // Create a card
 * cards/create:create
 * { "cardType": "debit", "provider": "VISA" }
 * 
 * // Add transactions (call multiple times with different data)
 * Run these from your app's transactions/new screen:
 * - Topup Rs. 5000
 * - Topup Rs. 10000
 * - Transfer Rs. 54.75 to another user (description: "Groceries")
 * - Transfer Rs. 12.50 (description: "Transport")
 * - Receive Rs. 2500 (description: "Salary")
 * 
 * Alternatively, you can manually insert into transactions table:
 * {
 *   "userId": "<your_user_id>",
 *   "walletId": "<your_wallet_id>",
 *   "type": "DEBIT",
 *   "amount": -54.75,
 *   "description": "Groceries",
 *   "status": "completed",
 *   "createdAt": Date.now()
 * }
 */

export const mockTransactions = [
  { description: "Groceries", amount: -54.75, type: "DEBIT" },
  { description: "Transport", amount: -12.50, type: "DEBIT" },
  { description: "Salary", amount: 2500.00, type: "CREDIT" },
  { description: "Salary", amount: 2500.00, type: "CREDIT" },
  { description: "Groceries", amount: -54.75, type: "DEBIT" },
  { description: "Transport", amount: -12.50, type: "DEBIT" },
];

console.log("Mock data template ready. Follow instructions above to seed your database.");
